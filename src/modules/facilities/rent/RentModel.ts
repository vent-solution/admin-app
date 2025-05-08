import { TenantModel } from "../../tenants/TenantModel";
import { AccommodationModel } from "../accommodations/AccommodationModel";
import { FacilitiesModel } from "../FacilityModel";

export interface RentModel {
  rentId?: number;
  amount: number;
  currency: string;
  paymentType: string;
  transactionDate: string;
  periods: number;
  balance: number;
  transactionStatus?: string;
  dateCreated?: string;
  lastUpdated?: string;
  tenant: TenantModel;
  accommodation: AccommodationModel;
}
