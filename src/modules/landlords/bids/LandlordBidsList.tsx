import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "../../../app/store";
import Preloader from "../../../other/Preloader";
import PaginationButtons from "../../../global/PaginationButtons";
import axios from "axios";
import { fetchData } from "../../../global/api";
import { FaSearch } from "react-icons/fa";
import { getLandlordBids, resetUserBids } from "./LandlordBidsSlice";
import { BidModel } from "../../bids/BidModel";
import LandlordBid from "./LandlordBid";

interface Props {
  userId: string | undefined;
}

const LandlordBidsList: React.FC<Props> = ({ userId }) => {
  const [searchString, setSearchString] = useState<string>("");
  const [filteredBids, setFilteredBids] = useState<BidModel[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const landlordBidsState = useSelector(getLandlordBids);
  const { userBids, status, error, page, size, totalElements, totalPages } =
    landlordBidsState;

  // searching for a landlord
  useEffect(() => {
    if (searchString.trim().length === 0) {
      setFilteredBids(userBids);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredBids(
        userBids.filter((userBid) => {
          const { bidId, facility, paymentType, dateCreated } = userBid;

          const bidNumber = "LOG-" + bidId;
          const facilityNumber = "FAC-" + facility.facilityId;

          const date = new Date(dateCreated).getDate();
          const month = new Date(dateCreated).getMonth() + 1;
          const year = new Date(dateCreated).getFullYear();

          const bidDate = date + "/" + month + "/" + year;
          return (
            (bidId && bidNumber.toLowerCase().includes(searchTerm)) ||
            (facility && facilityNumber.toLowerCase().includes(searchTerm)) ||
            (status && status.toLowerCase().includes(searchTerm)) ||
            (paymentType && paymentType.toLowerCase().includes(searchTerm)) ||
            (bidDate && bidDate.toLowerCase().includes(searchTerm))
          );
        })
      );
    }
  }, [searchString, userBids, status]);

  // on change of the search field
  const handleSearchLogs = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    []
  );

  // handle fetch next bids page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-bids-by-user/${Number(userId)}/${page + 1}/${size}`
      );
      dispatch(resetUserBids(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH LANDLORD BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching bids: ", error);
    }
  }, [dispatch, page, size, userId]);

  // handle fetch previous bids page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-bids-by-user/${Number(userId)}/${page - 1}/${size}`
      );
      dispatch(resetUserBids(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH LANDLORD BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching landlord bids: ", error);
    }
  }, [dispatch, page, size, userId]);

  if (status === "loading") return <Preloader />;

  if (status === "failed") return <p>Error loading facilities: {error}</p>;

  return (
    <div className="flex w-full mt-20 lg:mt-0 z-0 ">
      <div className="list w-full relative bg-gray-100 h-[calc(100vh-100px)] overflow-auto">
        <div className="bg-white w-full">
          <div className="w-full h-1/3 flex flex-wrap justify-end items-center px-10 py-2 bg-gray-00">
            <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center">
                <h1 className="text-xl text-blue-900">Bids</h1>
                <h1 className="text-lg">
                  {filteredBids.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-950 border-2 w-full lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-subscription"
                  placeholder="Search for log..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSearchLogs}
                />

                <button className="bg-blue-950 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:px-5 mb-12 overflow-auto pb-5 h-[calc(100vh-250px)]">
          {filteredBids.length > 0 ? (
            <table className="border-2 w-full bg-white shadow-xl">
              <thead className="sticky top-0 bg-blue-900 text-sm text-white">
                <tr className="">
                  <th className="px-2 py-2">#</th>
                  <th className="px-2">Bid number</th>
                  <th className="px-2">Facility number</th>
                  <th className="px-2">Facility nname</th>
                  <th className="px-2">Facility ncategory</th>
                  <th className="px-2">Facility location</th>
                  <th className="px-2">Amount(USD)</th>
                  <th className="px-2">Payment type</th>
                  <th className="px-2">Bid date</th>
                </tr>
              </thead>
              <tbody className="text-black font-light">
                {filteredBids.map((bid: BidModel, index: number) => (
                  <LandlordBid key={index} bid={bid} bidIndex={index} />
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

export default LandlordBidsList;
