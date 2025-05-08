import { FacilitiesModel } from "../facilities/FacilityModel";
import { UserModel } from "../users/models/userModel";

export interface ServiceFeeModel {
  serviceFeeId?: number;
  amount: number;
  currency: string;
  paymentType: string;
  dateCreated?: string;
  facility: FacilitiesModel;
  paidBy: UserModel;
}
