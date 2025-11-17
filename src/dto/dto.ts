export type User = {
  email: string;
  first_name: string;
  last_name: string;
  created_at: Date;
  updated_at: Date;
};

export type Banner = {
  banner_name: string;
  banner_image: string;
  description: string;
};

export type Services = {
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tariff: number;
};
