import { AddressModel } from "../../../global/models/AddressModel";
import { ContactModel } from "../../../global/models/ContactModel";
import { UserModel } from "../../users/models/userModel";

export interface LandlordModel {
  landlordId?: number;
  companyName?: string;
  idType: string;
  nationalId: string;
  contactType?: string;
  contact?: ContactModel;
  addressType?: string;
  address?: AddressModel;
  dateCreated?: string;
  lastUpdated?: string;
  user?: UserModel;
}
