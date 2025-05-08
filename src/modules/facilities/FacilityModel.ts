import { LandlordModel } from "../landlords/models/LandlordModel";
import { TenantModel } from "../tenants/TenantModel";
import { AmenitiesModel } from "./AmenitiesModel";
import { ManagerModel } from "./ManagerModel";

export interface FacilitiesModel {
  facilityId: number;
  facilityCategory: string;
  facilityName: string;
  facilityLocation: {
    country: string;
    state: string;
    city: string;
    county: string;
    division: string;
    parish: string;
    zone: string;
    street: string;
    plotNumber: string;
    latitude: string;
    longitude: string;
    distance: string;
  };
  contact: {
    telephone1: string;
    telephone2: string | null;
    email: string;
    fax: string | null;
  };
  genderRestriction: string;
  businessType: string;
  dateCreated: string;
  lastUpdated: string;
  landlord?: LandlordModel;
  facilityAmenities: AmenitiesModel;
  facilityImages: [];
  manager: ManagerModel;
  preferedCurrency: string;
  price?: number;
  bidAmount?: number;
  tenants: TenantModel[];
}
