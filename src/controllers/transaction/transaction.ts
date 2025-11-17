import { pool } from "../../pkg/database";
import {
  AddBalanceRequest,
  AddBalanceResponse,
  GetBalanceRequest,
  GetBalanceResponse,
  GetTransactionHistoryRequest,
  GetTransactionHistoryResponse,
  ServiceTransactionRequest,
  ServiceTransactionResponse,
} from "./types";
import { ITransactionController } from "./interface";

import { NewError } from "../../pkg/tools/error";
import {
  QueryAddToBalance,
  QueryAddTransaction,
  QueryDeductBalance,
  QueryGetMembershipBalance,
  QueryGetServiceByCode,
  QueryGetTransactionHistory,
  QueryInsertBalanceHistory,
  QueryInsertServiceTransaction,
  QueryLockUserBalance,
} from "../../models/transaction/transaction";
import { TransactionType } from "../../pkg/conf/enum/transaction";

export default class TransactionController implements ITransactionController {
  async getBalance(request: GetBalanceRequest): Promise<GetBalanceResponse> {
    const response: GetBalanceResponse = {
      balance: 0,
    };
    const db = await pool.connect();

    try {
      const query = QueryGetMembershipBalance();
      const values = [request.user_id];

      const result = await db.query(query, values);

      if (result.rowCount === 0) {
        throw NewError("Saldo tidak ditemukan", 404);
      }

      response.balance = Number(result.rows[0].balance);
      return response;
    } catch (err: any) {
      throw NewError(err.message ?? "Internal server error", 500);
    } finally {
      db.release();
    }
  }

  async addBalance(request: AddBalanceRequest): Promise<AddBalanceResponse> {
    const response: AddBalanceResponse = {
      balance: 0,
    };
    const db = await pool.connect();

    try {
      await db.query("BEGIN");

      const updateBalanceQuery = QueryAddToBalance();
      const updateBalanceValues = [request.top_up_amount, request.user_id];
      const updateBalanceResult = await db.query(
        updateBalanceQuery,
        updateBalanceValues,
      );

      if (updateBalanceResult.rowCount === 0) {
        await db.query("ROLLBACK");
        throw NewError("Gagal menambahkan saldo", 404);
      }

      const newBalance = Number(updateBalanceResult.rows[0].balance);

      const invoiceNumber = generateInvoiceNumber();
      const insertHistoryQuery = QueryAddTransaction();
      const insertHistoryValues = [
        invoiceNumber,
        request.user_id,
        TransactionType.TOP_UP,
        request.top_up_amount,
      ];

      await db.query(insertHistoryQuery, insertHistoryValues);

      await db.query("COMMIT");

      response.balance = newBalance;

      return response;
    } catch (err: any) {
      await db.query("ROLLBACK");
      throw NewError(err.message ?? "Internal server error", 500);
    } finally {
      db.release();
    }
  }

  async serviceTransaction(
    request: ServiceTransactionRequest,
  ): Promise<ServiceTransactionResponse> {
    const db = await pool.connect();

    const response: ServiceTransactionResponse = {
      invoice_number: "",
      service_code: "",
      service_name: "",
      transaction_type: "",
      total_amount: 0,
      created_on: "",
    };

    try {
      await db.query("BEGIN");

      const serviceRes = await db.query(QueryGetServiceByCode(), [
        request.service_code,
      ]);

      if (serviceRes.rowCount === 0) {
        throw NewError("Service atau Layanan tidak ditemukan", 400);
      }

      const service = serviceRes.rows[0];
      const price = Number(service.service_tariff);

      const balanceRes = await db.query(QueryLockUserBalance(), [
        request.user_id,
      ]);

      if (balanceRes.rowCount === 0) {
        throw NewError("Saldo tidak ditemukan", 404);
      }

      const oldBalance = Number(balanceRes.rows[0].balance);

      if (oldBalance < price) {
        throw NewError("Saldo tidak mencukupi", 400);
      }

      const deductRes = await db.query(QueryDeductBalance(), [
        price,
        request.user_id,
      ]);

      const newBalance = Number(deductRes.rows[0].balance);
      const invoice = generateInvoiceNumber();

      const insertTxRes = await db.query(QueryInsertServiceTransaction(), [
        invoice,
        request.user_id,
        service.service_code,
        TransactionType.PAYMENT,
        service.service_name,
        price,
      ]);

      const transactionId = insertTxRes.rows[0].id;

      await db.query(QueryInsertBalanceHistory(), [
        request.user_id,
        oldBalance,
        newBalance,
        -price,
        TransactionType.PAYMENT,
        transactionId,
      ]);

      await db.query("COMMIT");

      response.invoice_number = invoice;
      response.service_code = service.service_code;
      response.service_name = service.service_name;
      response.transaction_type = TransactionType.PAYMENT;
      response.total_amount = price;
      response.created_on = new Date().toISOString();

      return response;
    } catch (err: any) {
      await db.query("ROLLBACK");
      throw NewError(err.message ?? "Internal server error", 500);
    } finally {
      db.release();
    }
  }

  async getTransactionHistory(
    request: GetTransactionHistoryRequest,
  ): Promise<GetTransactionHistoryResponse> {
    const db = await pool.connect();

    const response: GetTransactionHistoryResponse = {
      limit: request.limit,
      offset: request.offset,
      records: [],
    };

    try {
      const query = QueryGetTransactionHistory();
      const values = [request.user_id, request.limit, request.offset];

      const result = await db.query(query, values);

      response.records = result.rows.map((row) => ({
        invoice_number: row.invoice_number,
        transaction_type: row.transaction_type,
        description: row.description ?? "",
        total_amount: Number(row.total_amount),
        created_at: row.created_on,
      }));

      return response;
    } catch (err: any) {
      throw NewError(err.message ?? "Internal server error", 500);
    } finally {
      db.release();
    }
  }
}

function generateInvoiceNumber() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 900) + 100;

  return `INV${y}${m}${d}-${rand}`;
}
