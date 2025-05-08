import { TenantModel } from "../../tenants/TenantModel";
import { AccommodationModel } from "../accommodations/AccommodationModel";
import { FacilitiesModel } from "../FacilityModel";

export interface HistoryModel {
  historyId?: number;
  tenant: TenantModel;
  facility: FacilitiesModel;
  accommodation: AccommodationModel;
  checkIn?: string;
  checkOut?: string;
  status?: string;
}
