import { GetBannerResponse, GetServiceResponse } from "./types";

export interface IInformationController {
  getBannerList(): Promise<GetBannerResponse>;
  getServiceList(): Promise<GetServiceResponse>;
}
