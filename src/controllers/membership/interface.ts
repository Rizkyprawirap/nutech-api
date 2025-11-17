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

export interface IMembershipController {
  registerMembership(req: RegisterRequest): Promise<RegisterResponse>;
  loginMembership(req: LoginRequest): Promise<LoginResponse>;
  updateProfileMembership(
    req: UpdateProfileMembershipRequest,
  ): Promise<UpdateProfileMembershipResponse>;
  getProfileMembership(
    req: GetProfileMembershipRequest,
  ): Promise<GetProfileMembershipResponse>;
  updateProfileImageMembership(
    req: UpdateProfileImageMembershipRequest,
  ): Promise<UpdateProfileImageMembershipResponse>;
}
