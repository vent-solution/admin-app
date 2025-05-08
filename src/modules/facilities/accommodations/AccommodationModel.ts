import { TenantModel } from "../../tenants/TenantModel";
import { FacilitiesModel } from "../FacilityModel";

export interface AccommodationModel {
  accommodationId?: number;
  accommodationNumber: string;
  floor?: string;
  price: number;
  bedrooms?: number;
  fullyFurnished?: boolean;
  selfContained?: boolean;
  accommodationCategory: string;
  accommodationType: string;
  genderRestriction: string;
  capacity?: number;
  availability: string;
  paymentPartten: string;
  numberOfBedRooms?: number;
  roomLocation?: string;
  numberOfwashRooms?: number;
  dateCreated?: string;
  lastUpdated?: string;
  facility: FacilitiesModel;
  tenants?: TenantModel[];
}
