import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import Preloader from "../../other/Preloader";
import { getBids, resetBids } from "./BidsSlice";
import { BidModel } from "./BidModel";
import Bid from "./Bid";
import { AppDispatch } from "../../app/store";
import axios from "axios";
import { fetchData } from "../../global/api";
import PaginationButtons from "../../global/PaginationButtons";
import { FormatMoney } from "../../global/actions/formatMoney";
import { getSettings } from "../settings/SettingsSlice";

interface Props {}
let BidsList: React.FC<Props> = () => {
  // local state variabes
  const [searchString, setSearchString] = useState<string>("");
  const [filteredBids, setFilteredBids] = useState<BidModel[]>([]);
  const [totalBidAmount, setTotalBidAmount] = useState<number>(0);

  const dispatch = useDispatch<AppDispatch>();
  const bidsState = useSelector(getBids);
  const { bids, status, error, page, size, totalElements, totalPages } =
    bidsState;

  const settingsState = useSelector(getSettings);
  const { settings } = settingsState;

  // filter bids
  useEffect(() => {
    const originalBids =
      bids.length > 0
        ? [...bids].sort((a, b) => {
            const aBidId = a.bidId ? parseInt(a.bidId, 10) : 0;
            const bBidId = b.bidId ? parseInt(b.bidId, 10) : 0;
            return bBidId - aBidId;
          })
        : [];
    if (searchString.trim().length === 0) {
      setFilteredBids(originalBids);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredBids(
        originalBids.filter((bid) => {
          const { facility } = bid;

          const bidNumber = "BID-" + bid.bidId;
          const facilityNumber = "FAC-" + bid.facility.facilityId;
          const bidYear = new Date(`${bid.dateCreated}`).getFullYear();
          const bidMonth = new Date(`${bid.dateCreated}`).getMonth() + 1;
          const bidDay = new Date(`${bid.dateCreated}`).getDate();
          const bidDate = bidDay + "/" + bidMonth + "/" + bidYear;
          return (
            (bidDate && bidDate.toLowerCase().includes(searchTerm)) ||
            (bid.bidId && bidNumber.toLowerCase().includes(searchTerm)) ||
            (bid.facility.facilityId &&
              facilityNumber.toLowerCase().includes(searchTerm)) ||
            (facility.facilityName &&
              facility.facilityName.toLowerCase().includes(searchTerm)) ||
            (facility.landlord?.companyName &&
              facility.landlord?.companyName
                .toLowerCase()
                .includes(searchTerm)) ||
            (facility.landlord?.user?.firstName &&
              facility.landlord?.user.firstName
                .toLowerCase()
                .includes(searchTerm)) ||
            (facility.landlord?.user?.lastName &&
              facility.landlord?.user.lastName
                .toLowerCase()
                .includes(searchTerm)) ||
            (facility.facilityCategory &&
              facility.facilityCategory.toLowerCase().includes(searchTerm)) ||
            (
              facility.facilityLocation.country &&
              facility.facilityLocation.country
            )
              .toLowerCase()
              .includes(searchTerm) ||
            (facility.facilityLocation.city && facility.facilityLocation.city)
              .toLowerCase()
              .includes(searchTerm)
          );
        })
      );
    }
  }, [searchString, bids]);

  // handle search event
  const handleSearchBids = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    []
  );

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(`/fetch-all-bids/${page + 1}/${size}`);
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetBids(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching bids: ", error);
    }
  }, [dispatch, page, size]);

  // handle fetch next page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(`/fetch-all-bids/${page - 1}/${size}`);
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetBids(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching bids: ", error);
    }
  }, [dispatch, page, size]);

  // get total bid amount
  useEffect(() => {
    setTotalBidAmount(
      filteredBids.map((fb) => fb.bidAmount).reduce((cal, add) => cal + add, 0)
    );
  }, [filteredBids]);

  if (status === "loading") return <Preloader />;
  if (error !== null) return <h1>{error}</h1>;

  return (
    <div className="flex w-full mt-20 lg:mt-0 z-0">
      <div className="w-full relative bg-gray-100 h-[calc(100vh)] ">
        <div className="w-full">
          <div className="w-full h-1/3 flex flex-wrap justify-end items-center px-10 py-3 bg-white shadow-lg mb-5">
            <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center">
                <h1 className="text-xl text-blue-950 font-mono font-bold">
                  {FormatMoney(totalBidAmount, 2, settings[0].preferedCurrency)}
                </h1>
                <h1 className="text-xl text-blue-950 font-bold">Bids</h1>
                <h1 className="text-lg font-bold">
                  {filteredBids.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-900 border-2 w-full lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-subscription"
                  placeholder="Search for bid..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSearchBids}
                />

                <button className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="lg:px-5 mb-12 overflow-auto pb-5 h-[calc(100vh-170px)] "
          style={{ height: "" }}
        >
          {filteredBids.length > 0 ? (
            <table className="border-2 w-full bg-white shadow-lg mt-2">
              <thead className="sticky top-0 bg-blue-900 text-base text-white">
                <tr>
                  <th className="px-2">#</th>
                  <th className="px-2">Bid number</th>
                  <th className="px-2">Facility number</th>
                  <th className="px-2">Facility name</th>
                  <th className="px-2">Country</th>
                  <th className="px-2">City</th>
                  <th className="px-2">Landlord</th>
                  <th className="px-2">Amount</th>
                  <th className="px-2">Payment type</th>
                  <th className="px-2">Payment date</th>
                </tr>
              </thead>
              <tbody className="text-black font-light">
                {filteredBids.map((bid: BidModel, index: number) => (
                  <Bid key={index} bid={bid} bidIndex={index} />
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

BidsList = React.memo(BidsList);
export default BidsList;
