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

export interface ITransactionController {
  getBalance(req: GetBalanceRequest): Promise<GetBalanceResponse>;
  addBalance(req: AddBalanceRequest): Promise<AddBalanceResponse>;
  serviceTransaction(
    req: ServiceTransactionRequest,
  ): Promise<ServiceTransactionResponse>;
  getTransactionHistory(
    req: GetTransactionHistoryRequest,
  ): Promise<GetTransactionHistoryResponse>;
}
