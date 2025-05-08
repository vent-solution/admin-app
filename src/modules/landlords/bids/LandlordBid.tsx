import React from "react";
import { parseISO, formatDistanceToNow, format } from "date-fns";
import { BidModel } from "../../bids/BidModel";
import { useSelector } from "react-redux";
import { getSettings } from "../../settings/SettingsSlice";
import { FormatMoney } from "../../../global/actions/formatMoney";
import {
  FACILITY_CATEGORY_DATA,
  PAYMENT_TYPE_DATA,
} from "../../../global/PreDefinedData/PreDefinedData";

interface Props {
  bid: BidModel;
  bidIndex: number;
}

const LandlordBid: React.FC<Props> = ({ bid, bidIndex }) => {
  const settings = useSelector(getSettings);

  console.log(settings);

  const registeredDate = bid.dateCreated ? parseISO(bid.dateCreated) : null;

  const created = registeredDate
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

  return (
    <tr className="cursor-pointer text-sm text-center border-y-2 hover:bg-gray-100">
      <td className="px-2 py-5">{bidIndex + 1}</td>
      <td className="px-2">{"BID-" + bid.bidId}</td>
      <td className="px-2">{"FAC-" + bid.facility.facilityId}</td>
      <td className="px-2">{bid.facility.facilityName}</td>
      <td className="px-2">
        {
          FACILITY_CATEGORY_DATA.find(
            (category) => category.value === bid.facility.facilityCategory
          )?.label
        }
      </td>
      <td className="px-2">
        {bid.facility.facilityLocation.city +
          ", " +
          bid.facility.facilityLocation.country}
      </td>
      <td className="px-2 font-bold font-mono">
        {FormatMoney(bid.bidAmount, 2, bid.currency)}
      </td>
      <td className="px-2">
        {
          PAYMENT_TYPE_DATA.find((type) => type.value === bid.paymentType)
            ?.label
        }
      </td>

      <td className="px-2">{created}</td>
    </tr>
  );
};

export default LandlordBid;
