import React from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { SpaceModel } from "./SpaceModel";
import { FormatMoney } from "../../../global/actions/formatMoney";

interface Props {
  space: SpaceModel;
  spaceIndex: number;
  preferedCurrency: string;
}

let Space: React.FC<Props> = ({ space, spaceIndex, preferedCurrency }) => {
  const createdDate = space.dateCreated ? parseISO(space.dateCreated) : null;
  const updatedDate = space.lastUpdated ? parseISO(space.lastUpdated) : null;

  // formating the date and time created
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

  // formating the date and time last updated
  const updated = updatedDate
    ? Date.now() - updatedDate.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(updatedDate, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(updatedDate, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago")
          .replace("less than a Min Ago", "Just now")
    : "";

  const { spaceId, spaceNumber, spaceCategory, capacity, availability, price } =
    space;

  return (
    <tr className="cursor-pointer text-sm text-center border-y-2 hover:bg-gradient-to-b  hover:from-white hover:via-white hover:to-white  bg-gradient-to-b from-white via-cyan-100 to-white">
      <td
        className="px-2
      "
      >
        {spaceIndex + 1}
      </td>
      <td
        className="px-2
      "
      >
        {"SPC-" + spaceId}
      </td>
      <td
        className="px-2
      "
      >
        {spaceNumber}
      </td>
      <td
        className="px-2
      "
      >
        {spaceCategory}
      </td>
      <td
        className="px-2
      "
      >
        {capacity}
      </td>
      <td
        className={`px-2
           ${
             availability === "available"
               ? "text-green-700"
               : availability === "booked"
               ? "text-orange-700"
               : "text-red-700"
           }`}
      >
        {availability}
      </td>
      <td
        className="px-2 font-bold
       font-mono"
      >
        {FormatMoney(price, 2, preferedCurrency)}
      </td>
      <td
        className="px-2
      "
      >
        {created}
      </td>
      <td
        className="px-2
      "
      >
        {updated}
      </td>
    </tr>
  );
};

Space = React.memo(Space);

export default Space;
