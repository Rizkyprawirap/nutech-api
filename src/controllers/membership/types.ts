export type RegisterRequest = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

export type RegisterResponse = {};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type UpdateProfileMembershipRequest = {
  first_name: string;
  last_name: string;
  email: string;
};

export type UpdateProfileMembershipResponse = {
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string;
};

export type GetProfileMembershipRequest = {
  email: string;
};

export type GetProfileMembershipResponse = {
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string;
};

export type UpdateProfileImageMembershipRequest = {
  email: string;
  file?: Express.Multer.File | null;
};

export type UpdateProfileImageMembershipResponse = {
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string;
};
