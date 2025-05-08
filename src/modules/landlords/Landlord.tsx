import React, { useEffect, useState } from "react";
import { LandlordModel } from "./models/LandlordModel";
import { fetchData } from "../../global/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { UserStatusEnum } from "../../global/enums/userStatusEnum";

interface Props {
  landlord: LandlordModel;
  userIndex: number;
}
const Landlord: React.FC<Props> = ({ landlord, userIndex }) => {
  const [numberOfFacilities, setNumberOfFacilities] = useState<number>(0);

  const joinedDate = landlord.user?.createdDate
    ? parseISO(landlord.user.createdDate)
    : null;

  // formating the date and time user joined
  const joined = joinedDate
    ? Date.now() - joinedDate.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(joinedDate, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(joinedDate, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago")
          .replace("less than a Min Ago", "Just now")
    : "";

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacilities = async (endpoint: string) => {
      try {
        const result = await fetchData(endpoint);

        setNumberOfFacilities(result.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("REQUEST CANCELLED: ", error.message);
        }
      }
    };

    fetchFacilities(
      `/fetchNumberOfFacilitiesByLandlord/${landlord.landlordId}`
    );
  }, [landlord.landlordId]);

  return (
    <tr
      className="cursor-pointer text-sm text-center border-y-2   hover:bg-gray-100 relative"
      onClick={() => navigate(`/landlords/${landlord.user?.userId}`)}
    >
      <td
        className={`px-2 rounded-full p-2 h-8 w-8 absolute top-[calc(20%)] text-white  ${
          landlord.user?.userStatus === UserStatusEnum.disabled
            ? "bg-black"
            : landlord.user?.userStatus === UserStatusEnum.enabled
            ? "bg-blue-600"
            : landlord.user?.userStatus === UserStatusEnum.online
            ? "bg-green-600"
            : landlord.user?.userStatus === UserStatusEnum.offline
            ? "bg-gray-500"
            : landlord.user?.userStatus === UserStatusEnum.blocked
            ? "bg-red-600"
            : ""
        } `}
      >
        {userIndex}
      </td>
      <td className="px-2">{"LLD-" + landlord.landlordId}</td>
      <td className="px-2">{landlord.user?.firstName}</td>
      <td className="px-2">{landlord.user?.lastName}</td>
      <td className="px-2">{landlord.user?.gender}</td>
      <td className="px-2">{landlord.user?.userTelephone}</td>
      <td className="px-2">{landlord.user?.userEmail}</td>
      <td className="px-2">{landlord.address?.country}</td>
      <td className="px-2">{landlord.address?.city}</td>
      <td className="px-2">{numberOfFacilities}</td>
      <td className="px-2">{joined}</td>
    </tr>
  );
};

export default Landlord;
