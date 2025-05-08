import { UserModel } from "../users/models/userModel";

export interface SubscriptionModel {
  subscriptionId: string;
  transactionNumber: string;
  amount: number;
  currency: string;
  paymentType: string;
  transactionDate: string;
  transactionStatus: string;
  dateCreated: string;
  lastUpdated: string;
  user: UserModel;
}
