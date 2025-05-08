import React from "react";
import { parseISO, formatDistanceToNow, format } from "date-fns";
import { FacilitiesModel } from "./FacilityModel";
import { useNavigate } from "react-router-dom";
import { FormatMoney } from "../../global/actions/formatMoney";
import { useSelector } from "react-redux";
import { getSettings } from "../settings/SettingsSlice";
import {
  BUSINESS_TYPE_DATA,
  FACILITY_CATEGORY_DATA,
} from "../../global/PreDefinedData/PreDefinedData";

interface Props {
  facility: FacilitiesModel;
  facilityIndex: number;
}

const FacilityRow: React.FC<Props> = ({ facilityIndex, facility }) => {
  const registeredDate = facility.dateCreated
    ? parseISO(facility.dateCreated)
    : null;

  // const lastUpdated = facility.lastUpdated
  //   ? parseISO(facility.lastUpdated)
  //   : null;

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

  // const updated = lastUpdated
  //   ? Date.now() - lastUpdated.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  //     ? format(lastUpdated, "MMM d, yyyy") // Format as "Jan 1, 2022"
  //     : formatDistanceToNow(lastUpdated, { addSuffix: true })
  //         .replace("about ", "")
  //         .replace(" minute", " Min")
  //         .replace(" hour", " Hr")
  //         .replace(" day", " Day")
  //         .replace(" ago", " Ago")
  //         .replace("less than a Min Ago", "Just now")
  //   : // Use relative time
  //     "";

  const navigate = useNavigate();

  const adminFinancialSetting = useSelector(getSettings);

  const { settings } = adminFinancialSetting;

  return (
    <tr
      className="cursor-pointer text-sm text-center border-y-2 lg:hover:bg-gray-100"
      onClick={() => navigate(`/facilies/${facility.facilityId}`)}
    >
      <td
        className="py-5"
        onClick={() => navigate(`/facilies/${facility.facilityId}`)}
      >
        {facilityIndex + 1}
      </td>
      <td onClick={() => navigate(`/facilies/${facility.facilityId}`)}>
        {"FAC-" + facility.facilityId}
      </td>
      <td
        className=" cursor-pointer text-blue-700"
        onClick={() =>
          navigate(`/landlords/${facility.landlord?.user?.userId}`)
        }
      >
        {"LLD-" + facility.landlord?.landlordId}
      </td>
      <td onClick={() => navigate(`/facilies/${facility.facilityId}`)}>
        {
          BUSINESS_TYPE_DATA.find(
            (type) => type.value === facility.businessType
          )?.label
        }
      </td>
      <td onClick={() => navigate(`/facilies/${facility.facilityId}`)}>
        {
          FACILITY_CATEGORY_DATA.find(
            (category) => category.value === facility.facilityCategory
          )?.label
        }
      </td>
      <td onClick={() => navigate(`/facilies/${facility.facilityId}`)}>
        {facility.facilityName}
      </td>
      <td onClick={() => navigate(`/facilies/${facility.facilityId}`)}>
        {facility.facilityLocation.country}
      </td>
      <td onClick={() => navigate(`/facilies/${facility.facilityId}`)}>
        {facility.facilityLocation.city}
      </td>
      <td className="font-bold font-mono">
        {Number(facility.price) > 0 &&
          FormatMoney(Number(facility.price), 2, facility.preferedCurrency)}
      </td>
      <td className="font-bold font-mono">
        {Number(facility.bidAmount) > 0
          ? FormatMoney(
              facility.bidAmount ? facility.bidAmount : 0,
              2,
              settings[0].preferedCurrency
            )
          : ""}
      </td>
      <td>{registered}</td>
      {/* <td
        className="actions cursor-pointer h-full flex items-center justify-center"
        onClick={() => navigate(`/facilies/${facility.facilityId}`)}
      >
        <span className="text-2xl  ">
          <RiMoreFill />
        </span>
      </td> */}
    </tr>
  );
};

export default FacilityRow;
