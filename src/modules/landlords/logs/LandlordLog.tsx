import React from "react";
import { parseISO, formatDistanceToNow, format } from "date-fns";
import { LogModel } from "../../logs/LogModel";

interface Props {
  log: LogModel;
  logIndex: number;
}

const LandlordLog: React.FC<Props> = ({ log, logIndex }) => {
  const registeredDate = log.dateCreated ? parseISO(log.dateCreated) : null;

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
      <td className="px-2">{logIndex + 1}</td>
      <td className="px-2">{"LOG-" + log.logId}</td>
      <td className="px-2">{log.user?.userId && "USR-" + log.user?.userId}</td>
      <td className="px-2">
        {log.user?.firstName && log.user?.firstName + " " + log.user?.lastName}
      </td>
      <td className="px-2">{log.activity}</td>
      <td className="px-2 w-1/4 py-5">{log.description}</td>
      <td
        className={`px-2 text-lg ${
          log.status === "failed" ? "text-red-500" : "text-green-500"
        }`}
      >
        {log.status}
      </td>

      <td className="px-2">{created}</td>
    </tr>
  );
};

export default LandlordLog;
