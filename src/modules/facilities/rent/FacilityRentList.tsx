import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchfacilityRent,
  getFacilityRent,
  resetFacilityRent,
} from "./FacilityRentSlice";
import { AppDispatch } from "../../../app/store";
import Preloader from "../../../other/Preloader";
import { FaSearch } from "react-icons/fa";
import PaginationButtons from "../../../global/PaginationButtons";
import { RentModel } from "./RentModel";
import FacilityRentRow from "./FacilityRentRow";
import axios from "axios";
import { fetchData } from "../../../global/api";

interface Props {
  facilityId: number;
}
const FacilityRentList: React.FC<Props> = ({ facilityId }) => {
  const [filteredRent, setFilteredRent] = useState<RentModel[]>([]);
  const [searchString, setSearchString] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

  const rentState = useSelector(getFacilityRent);
  const { facilityRent, page, size, totalElements, totalPages, status, error } =
    rentState;

  // fetch rent if the status is idle
  useEffect(() => {
    dispatch(
      fetchfacilityRent({ facilityId: Number(facilityId), page: 0, size: 100 })
    );
  }, [dispatch, facilityId]);

  // filter facilities basing on various parameters
  useEffect(() => {
    if (searchString.trim().length === 0) {
      setFilteredRent(facilityRent);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredRent(
        facilityRent.filter((rent) => {
          const {
            rentId,
            tenant,
            amount,
            paymentType,
            dateCreated,
            accommodation,
          } = rent;

          const rentNumber = "RNT-" + rentId;
          const tenantNumber = "TNT-" + tenant.tenantId;

          const date = new Date(String(dateCreated)).getDate();
          const month = new Date(String(dateCreated)).getMonth() + 1;
          const year = new Date(String(dateCreated)).getFullYear();

          const rentDateAdded = date + "/" + month + "/" + year;

          const tenantName = tenant.companyName
            ? tenant.companyName
            : tenant.user.firstName + " " + tenant.user.lastName;

          return (
            (rentId && rentNumber.toLowerCase().includes(searchTerm)) ||
            (tenantNumber && tenantNumber.toLowerCase().includes(searchTerm)) ||
            (tenantName && tenantName.toLowerCase().includes(searchTerm)) ||
            (paymentType && paymentType.toLowerCase().includes(searchTerm)) ||
            (accommodation.floor &&
              accommodation.floor.toLowerCase().includes(searchTerm)) ||
            (accommodation.accommodationNumber &&
              accommodation.accommodationNumber
                .toLowerCase()
                .includes(searchTerm)) ||
            (rentDateAdded &&
              rentDateAdded.toLowerCase().includes(searchTerm)) ||
            (amount && Number(amount) === Number(searchTerm))
          );
        })
      );
    }
  }, [searchString, facilityRent]);

  // on change of the search field
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  }, []);

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-rent-by-facility/${Number(facilityId)}/${page + 1}/${size}`
      );
      dispatch(resetFacilityRent(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH RENT CANCELLED ", error.message);
      }
      console.error("Error fetching rent: ", error);
    }
  }, [dispatch, page, size, facilityId]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-rent-by-facility/${Number(facilityId)}/${page - 1}/${size}`
      );
      dispatch(resetFacilityRent(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH RENT CANCELLED ", error.message);
      }
      console.error("Error fetching rent: ", error);
    }
  }, [dispatch, page, size, facilityId]);

  if (status === "loading") return <Preloader />;

  if (status === "failed") return <p>Error loading rent: {error}</p>;

  return (
    <div className="users-list flex w-full  mt-2 lg:mt-0 z-0">
      <div className="list w-full relative overflow-auto bg-gray-100 h-[calc(100vh-90px)]">
        <div className="w-full">
          <div className="lower w-full h-1/3 flex flex-wrap justify-end items-center px-10 py-3">
            <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center">
                <h1 className="text-lg">
                  {filteredRent.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-950 border-2 w-full lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-users"
                  placeholder="Search for user..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleChange}
                />
                <button className="bg-blue-950 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:px-5 mb-12 overflow-auto pb-5 mt-1 h-[calc(100vh-250px)]">
          {filteredRent && filteredRent.length > 0 ? (
            <table className="border-2 w-full bg-white shadow-lg text-center">
              <thead className="bg-blue-900 text-white sticky top-0">
                <tr className="text-sm">
                  <th className="px-2 font-bold py-2">#</th>
                  <th className="px-2 font-bold">Tenant No.</th>
                  <th className="px-2 font-bold">Tenant Name</th>
                  <th className="px-2 font-bold">Accommodation</th>
                  <th className="px-2 font-bold">Floor</th>
                  <th className="px-2 font-bold">Payment Type</th>
                  <th className="px-2 font-bold">Amount</th>
                  <th className="px-2 font-bold">Paid</th>
                </tr>
              </thead>
              <tbody className="font-light">
                {filteredRent.map((rent, index) => (
                  <FacilityRentRow
                    key={index}
                    rentIndex={index + 1}
                    rent={rent}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="w-ull h-5/6 flex justify-center items-center">
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

export default FacilityRentList;
