import { pool } from "../../pkg/database";
import { IInformationController } from "./interface";
import { NewError } from "../../pkg/tools/error";
import {
  QueryGetInformationBanner,
  QueryGetInformationService,
} from "../../models/information/information";
import { GetBannerResponse, GetServiceResponse } from "./types";

export default class InformationController implements IInformationController {
  async getBannerList(): Promise<GetBannerResponse> {
    const db = await pool.connect();
    const response: GetBannerResponse = {
      data: [],
    };

    try {
      const query = QueryGetInformationBanner();
      const values = [10];

      const result = await db.query(query, values);

      if (result.rowCount === 0) {
        throw NewError("Gagal mendapatkan banners", 500);
      }

      response.data = result.rows.map((row) => ({
        banner_name: row.banner_name,
        banner_image: row.banner_image,
        description: row.description,
      }));

      return response;
    } catch (err: any) {
      throw NewError(err.message ?? "Internal server error", 500);
    } finally {
      db.release();
    }
  }

  async getServiceList(): Promise<GetServiceResponse> {
    const db = await pool.connect();

    const response: GetServiceResponse = {
      data: [],
    };

    //TODO: On the contract Should have page & limit request
    try {
      const query = QueryGetInformationService();
      const values = [10];

      const result = await db.query(query, values);

      if (result.rowCount === 0) {
        throw NewError("Gagal mendapatkan banners", 500);
      }

      response.data = result.rows.map((row) => ({
        service_code: row.service_code,
        service_name: row.service_name,
        service_icon: row.service_icon,
        service_tariff: row.service_tariff,
      }));

      return response;
    } catch (err: any) {
      throw NewError(err.message ?? "Internal server error", 500);
    } finally {
      db.release();
    }
  }
}
