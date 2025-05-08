import React from "react";
import { BrokerFeeModel } from "./BrokerFeeModel";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { FormatMoney } from "../../global/actions/formatMoney";
import { PAYMENT_TYPE_DATA } from "../../global/PreDefinedData/PreDefinedData";

interface Props {
  brokerFee: BrokerFeeModel;
  brokerFeeIndex: number;
}

const BrokerFeeRow: React.FC<Props> = ({ brokerFee, brokerFeeIndex }) => {
  const createdDate = brokerFee.dateCreated
    ? parseISO(brokerFee.dateCreated)
    : null;

  // formating the date and time Subscription created
  const created = createdDate
    ? Date.now() - createdDate.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(createdDate, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(createdDate, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago")
          .replace("less than a Min Ago", "Just now")
    : "";

  return (
    <tr className="cursor-pointer text-sm text-center border-y-2 hover:bg-gray-100">
      <td className="px-2 py-5">{brokerFeeIndex + 1}</td>
      <td className="px-2">{"BKF-" + brokerFee.brokerFeeId}</td>
      <td className="px-2">{"TNT-" + brokerFee.tenant.tenantId}</td>
      <td className="px-2">{brokerFee.tenant.user.firstName}</td>
      <td className="px-2">{brokerFee.tenant.user.lastName}</td>
      <td className="px-2 font-bold font-mono">
        {FormatMoney(brokerFee.amount, 2, brokerFee.currency)}
      </td>
      <td className="px-2">
        {
          PAYMENT_TYPE_DATA.find((type) => type.value === brokerFee.paymentType)
            ?.label
        }
      </td>
      <td className="px-2">{created}</td>
    </tr>
  );
};

export default BrokerFeeRow;
