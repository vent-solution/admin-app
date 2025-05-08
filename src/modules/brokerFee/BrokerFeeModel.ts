import { TenantModel } from "../tenants/TenantModel";

export interface BrokerFeeModel {
  brokerFeeId?: string;
  amount: number;
  currency: string;
  tenant: TenantModel;
  paymentType: string;
  dateCreated?: string;
  lastUpdated?: string;
}
