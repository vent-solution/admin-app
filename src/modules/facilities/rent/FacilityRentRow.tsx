import React, { useEffect, useState } from "react";
import { RentModel } from "./RentModel";
import { FormatMoney } from "../../../global/actions/formatMoney";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { PAYMENT_TYPE_DATA } from "../../../global/PreDefinedData/PreDefinedData";

interface Props {
  rent: RentModel;
  rentIndex: number;
}

const FacilityRentRow: React.FC<Props> = ({ rent, rentIndex }) => {
  const [dateString, setDateString] = useState<string>("");

  // set the time rent was added every after 1sec interval
  useEffect(() => {
    const interval = setInterval(() => {
      const registeredDate = rent.dateCreated
        ? parseISO(rent.dateCreated)
        : null;

      const registered = registeredDate
        ? Date.now() - registeredDate.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
          ? format(registeredDate, "MMM d, yyyy") // Format as "Jan 1, 2022"
          : formatDistanceToNow(registeredDate, { addSuffix: true })
              .replace("about ", "")
              .replace(" minute", " Min")
              .replace(" hour", " Hr")
              .replace(" day", " Day")
              .replace(" ago", " Ago")
              .replace("less than a Min Ago", "Just now")
        : // Use relative time
          "";

      setDateString(registered);
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <tr className="cursor-pointer text-sm text-center border-y-2 hover:bg-gray-100">
      <td className="py-5">{rentIndex}</td>
      <td>{"TNT-" + rent.tenant.tenantId}</td>
      {!rent.tenant.companyName && (
        <td>{rent.tenant.user.firstName + " " + rent.tenant.user.lastName}</td>
      )}
      {rent.tenant.companyName && <td>{rent.tenant.companyName}</td>}

      <td>{rent.accommodation.accommodationNumber}</td>
      <td>{rent.accommodation.floor}</td>
      <td>
        {
          PAYMENT_TYPE_DATA.find((type) => type.value === rent.paymentType)
            ?.label
        }
      </td>
      <td className="font-bold font-mono">
        {FormatMoney(rent.amount, 2, rent.currency)}
      </td>
      <td>{dateString}</td>
    </tr>
  );
};

export default FacilityRentRow;
