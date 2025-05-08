import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "../../../app/store";
import Preloader from "../../../other/Preloader";
import PaginationButtons from "../../../global/PaginationButtons";
import axios from "axios";
import { fetchData } from "../../../global/api";
import { getLandlordLogs, resetUserLogs } from "./LandlordLogsSlice";
import { LogModel } from "../../logs/LogModel";
import { FaSearch } from "react-icons/fa";
import LandlordLog from "./LandlordLog";

interface Props {
  userId: string | undefined;
}

const LandlordLogs: React.FC<Props> = ({ userId }) => {
  const [searchString, setSearchString] = useState<string>("");
  const [filteredLogs, setFilteredLogs] = useState<LogModel[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const landlordLogsState = useSelector(getLandlordLogs);
  const { userLogs, status, error, page, size, totalElements, totalPages } =
    landlordLogsState;

  // searching for a landlord
  useEffect(() => {
    if (searchString.trim().length === 0) {
      setFilteredLogs(userLogs);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredLogs(
        userLogs.filter((userLog) => {
          const { logId, activity, description, status, dateCreated } = userLog;

          const logNumber = "LOG-" + logId;
          const date = new Date(dateCreated).getDate();
          const month = new Date(dateCreated).getMonth() + 1;
          const year = new Date(dateCreated).getFullYear();

          const logDate = date + "/" + month + "/" + year;
          return (
            (logId && logNumber.toLowerCase().includes(searchTerm)) ||
            (activity && activity.toLowerCase().includes(searchTerm)) ||
            (description && description.toLowerCase().includes(searchTerm)) ||
            (status && status.toLowerCase().includes(searchTerm)) ||
            (logDate && logDate.toLowerCase().includes(searchTerm))
          );
        })
      );
    }
  }, [searchString, userLogs]);

  // on change of the search field
  const handleSearchLogs = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    []
  );

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-logs-by-user/${Number(userId)}/${page + 1}/${size}`
      );
      dispatch(resetUserLogs(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH LANDLORD LOGS CANCELLED ", error.message);
      }
      console.error("Error fetching Logs: ", error);
    }
  }, [dispatch, page, size, userId]);

  // handle fetch next page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-logs-by-user/${Number(userId)}/${page - 1}/${size}`
      );
      dispatch(resetUserLogs(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH LANDLORD LOGS CANCELLED ", error.message);
      }
      console.error("Error fetching landlord logs: ", error);
    }
  }, [dispatch, page, size, userId]);

  if (status === "loading") return <Preloader />;

  if (status === "failed") return <p>Error loading facilities: {error}</p>;

  return (
    <div className="flex w-full mt-20 lg:mt-0 z-0">
      <div className="list w-full relative  bg-gray-100 h-[calc(100vh-100px)] overflow-auto">
        <div className="bg-white w-full shadow-lg">
          <div className="w-full h-1/3 flex flex-wrap justify-end items-center px-10 py-1 bg-gray-00">
            <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center">
                <h1 className="text-xl text-blue-900">logs</h1>
                <h1 className="text-lg">
                  {filteredLogs.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-900 border-2 w-full lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-subscription"
                  placeholder="Search for log..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSearchLogs}
                />

                <button className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className=" overflow-auto pb-5 relative h-[calc(100vh-230px)]">
          {filteredLogs.length > 0 ? (
            <table className="w-full bg-white shadow-lg">
              <thead className="sticky top-0 bg-blue-900 text-sm text-white">
                <tr>
                  <th className="px-2 py-3">#</th>
                  <th className="px-2">Log number</th>
                  <th className="px-2">User number</th>
                  <th className="px-2">User full name</th>
                  <th className="px-2">Activity</th>
                  <th className="px-2">Description</th>
                  <th className="px-2">Status</th>
                  <th className="px-2">Log date</th>
                </tr>
              </thead>
              <tbody className="text-black font-light">
                {filteredLogs.map((log: LogModel, index: number) => (
                  <LandlordLog key={index} log={log} logIndex={index} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="w-ull h-full flex justify-center items-center">
              <div
                className="w-80 h-80"
                style={{
                  background: "URL('/images/Ghost.gif')",
                  backgroundSize: "cover",
                }}
              ></div>
            </div>
          )}
        </div>
        <PaginationButtons
          page={page}
          totalPages={totalPages}
          handleFetchNextPage={handleFetchNextPage}
          handleFetchPreviousPage={handleFetchPreviousPage}
        />
      </div>
    </div>
  );
};

export default LandlordLogs;
