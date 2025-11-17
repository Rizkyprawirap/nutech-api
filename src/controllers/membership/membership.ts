import bcrypt from "bcryptjs";
import { v7 } from "uuid";
import { pool } from "../../pkg/database";
import {
  GetProfileMembershipRequest,
  GetProfileMembershipResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateProfileImageMembershipRequest,
  UpdateProfileImageMembershipResponse,
  UpdateProfileMembershipRequest,
  UpdateProfileMembershipResponse,
} from "./types";
import { IMembershipController } from "./interface";
import { Jwt } from "../../pkg/jwt/jwt";
import {
  QueryGetMembershipByEmail,
  QueryGetMembershipWithProfileImageByID,
  QueryInsertMembership,
  QueryInsertMembershipBalance,
  QueryUpdateMembershipProfile,
  QueryUpdateMembershipProfileImage,
} from "../../models/membership/membership";
import { NewError } from "../../pkg/tools/error";

export default class MembershipController implements IMembershipController {
  async registerMembership(
    request: RegisterRequest,
  ): Promise<RegisterResponse> {
    const db = await pool.connect();
    const hashedPassword = await bcrypt.hash(request.password, 8);
    const response: RegisterResponse = {};
    try {
      await db.query("BEGIN");
      const id = v7();
      const insertUserQuery = QueryInsertMembership();
      const userValues = [
        id,
        request.email,
        hashedPassword,
        request.first_name,
        request.last_name,
      ];
      const result = await db.query(insertUserQuery, userValues);

      if (result.rowCount === 0) {
        throw NewError("Gagal membuat user", 500);
      }

      const insertBalanceQuery = QueryInsertMembershipBalance();
      const balanceValues = [id, 0];
      const balanceResult = await db.query(insertBalanceQuery, balanceValues);

      if (balanceResult.rowCount === 0) {
        throw NewError("Gagal membuat saldo user", 500);
      }

      await db.query("COMMIT");

      return response;
    } catch (err: any) {
      await db.query("ROLLBACK");
      throw NewError(err.message ?? "Internal server error", 500);
    } finally {
      db.release();
    }
  }

  async loginMembership(request: LoginRequest): Promise<LoginResponse> {
    const response: LoginResponse = {
      token: "",
    };

    try {
      const query = QueryGetMembershipByEmail();
      const values = [request.email];
      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        throw NewError("Email atau password salah", 401);
      }

      const user = result.rows[0];

      const isValid = await bcrypt.compare(request.password, user.password);
      if (!isValid) {
        throw NewError("Email atau password salah", 401);
      }

      const token = Jwt.generateAccessToken({
        user_id: user.id,
        email: user.email,
      });

      response.token = token;

      return response;
    } catch (err: any) {
      throw NewError(err.message ?? "Internal server error", 500);
    }
  }

  async updateProfileMembership(
    request: UpdateProfileMembershipRequest,
  ): Promise<UpdateProfileMembershipResponse> {
    const response: UpdateProfileMembershipResponse = {
      email: "",
      first_name: "",
      last_name: "",
      profile_image: "",
    };
    try {
      const fields: string[] = [];
      const values: any[] = [];

      if (request.first_name) {
        fields.push("first_name");
        values.push(request.first_name);
      }

      if (request.last_name) {
        fields.push("last_name");
        values.push(request.last_name);
      }

      if (fields.length === 0) {
        throw NewError("Tidak ada field untuk di update", 400);
      }

      values.push(request.email);

      const updateQuery = QueryUpdateMembershipProfile(fields);
      const updateQueryResult = await pool.query(updateQuery, values);

      if (updateQueryResult.rowCount === 0) {
        throw NewError("User tidak ditemukan", 404);
      }

      const profileQuery = QueryGetMembershipWithProfileImageByID();
      const profileQueryResult = await pool.query(profileQuery, [
        request.email,
      ]);

      const user = profileQueryResult.rows[0];

      response.email = user.email;
      response.first_name = user.first_name;
      response.last_name = user.last_name;
      response.profile_image = user.profile_image;

      return response;
    } catch (err: any) {
      throw NewError(err.message ?? "Internal server error", 500);
    }
  }

  async getProfileMembership(
    request: GetProfileMembershipRequest,
  ): Promise<GetProfileMembershipResponse> {
    const response: GetProfileMembershipResponse = {
      email: "",
      first_name: "",
      last_name: "",
      profile_image: "",
    };
    try {
      const query = QueryGetMembershipWithProfileImageByID();
      const values = [request.email];
      const result = await pool.query(query, values);
      const user = result.rows[0];

      response.email = user.email;
      response.first_name = user.first_name;
      response.last_name = user.last_name;
      response.profile_image = user.profile_image;

      return response;
    } catch (err: any) {
      throw NewError(err.message ?? "Internal server error", 500);
    }
  }

  async updateProfileImageMembership(
    request: UpdateProfileImageMembershipRequest,
  ): Promise<UpdateProfileImageMembershipResponse> {
    const response: UpdateProfileImageMembershipResponse = {
      email: "",
      first_name: "",
      last_name: "",
      profile_image: "",
    };
    try {
      if (!request.file) {
        throw NewError("File tidak ditemukan", 400);
      }

      const url = `https://yoururlapi.com/${request.file.originalname}`;

      const queryUpdate = QueryUpdateMembershipProfileImage();
      const updateResult = await pool.query(queryUpdate, [url, request.email]);

      if (updateResult.rowCount === 0) {
        throw NewError("User tidak ditemukan", 404);
      }

      const profileRes = await pool.query(
        QueryGetMembershipWithProfileImageByID(),
        [request.email],
      );

      const user = profileRes.rows[0];

      response.email = user.email;
      response.first_name = user.first_name;
      response.last_name = user.last_name;
      response.profile_image = user.profile_image;

      return response;
    } catch (err: any) {
      throw NewError(err.message ?? "Internal server error", 500);
    }
  }
}
