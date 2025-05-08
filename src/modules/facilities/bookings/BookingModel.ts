import { TenantModel } from "../../tenants/TenantModel";
import { AccommodationModel } from "../accommodations/AccommodationModel";
import { FacilitiesModel } from "../FacilityModel";

export interface BookingModel {
  bookingId?: number;
  amount: number;
  currency: string;
  paymentType: string;
  checkIn?: string;
  transactionDate: string;
  transactionStatus: string;
  dateCreated?: string;
  lastUpdated?: string;
  tenant: TenantModel;
  accommodation?: AccommodationModel;
}
