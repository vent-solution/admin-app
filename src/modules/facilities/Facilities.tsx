import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { fetchData } from "../../global/api";
import PaginationButtons from "../../global/PaginationButtons";
import Preloader from "../../other/Preloader";
import FacilityRow from "./FacilityRow";

import { FacilitiesModel } from "./FacilityModel";
import { getFacilities, resetFacilities } from "./FacilitiesSlice";
import { FaSearch } from "react-icons/fa";

interface Props {}

const Facilities: React.FC<Props> = () => {
  const [searchString, setSearchString] = useState<string>("");
  const [filteredFacilities, setFilteredFacilities] = useState<
    FacilitiesModel[]
  >([]);

  const dispatch = useDispatch<AppDispatch>();
  const facilitiesState = useSelector(getFacilities);
  const {
    otherFacilities,
    status,
    error,
    page,
    size,
    totalElements,
    totalPages,
  } = facilitiesState;

  // filter facilities basing on various parameters
  useEffect(() => {
    if (searchString.trim().length === 0) {
      setFilteredFacilities(otherFacilities);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredFacilities(
        otherFacilities.filter((facility) => {
          const {
            facilityId,
            facilityName,
            facilityCategory,
            dateCreated,
            contact: { telephone1, telephone2, email },
            facilityLocation: { country, city },
          } = facility;

          const facilityNumber = "FAC-" + facilityId;

          const date = new Date(String(dateCreated)).getDate();
          const month = new Date(String(dateCreated)).getMonth() + 1;
          const year = new Date(String(dateCreated)).getFullYear();

          const facilityDateAdded = date + "/" + month + "/" + year;

          return (
            (facilityId && facilityNumber.toLowerCase().includes(searchTerm)) ||
            (facilityName && facilityName.toLowerCase().includes(searchTerm)) ||
            (facilityCategory &&
              facilityCategory.toLowerCase().includes(searchTerm)) ||
            (country && country.toLowerCase().includes(searchTerm)) ||
            (city && city.toLowerCase().includes(searchTerm)) ||
            (telephone1 && telephone1.toLowerCase().includes(searchTerm)) ||
            (telephone2 && telephone2.toLowerCase().includes(searchTerm)) ||
            (email && email.toLowerCase().includes(searchTerm)) ||
            (facilityDateAdded &&
              facilityDateAdded.toLowerCase().includes(searchTerm))
          );
        })
      );
    }
  }, [searchString, otherFacilities]);

  // on change of the search field
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  }, []);

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(`/fetch-facilities/${page + 1}/${size}`);
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetFacilities(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching admins: ", error);
    }
  }, [dispatch, page, size]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(`/fetch-facilities/${page - 1}/${size}`);
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetFacilities(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH ADMINS CANCELLED ", error.message);
      }
      console.error("Error fetching admins: ", error);
    }
  }, [dispatch, page, size]);

  if (status === "loading") return <Preloader />;

  if (status === "failed") return <p>Error loading facilities: {error}</p>;

  return (
    <div className="flex w-full mt-2 lg:mt-0 z-0">
      <div className="list w-full relative bg-gray-100 h-[calc(100vh-10px)] overflow-auto">
        <div className="bg-white w-full">
          {/* <div className="upper bg-yellow-400 w-full h-2/3"></div> */}
          <div className="lower w-full h-1/3 flex flex-wrap justify-end items-center px-10 py-3 bg-white shadow-lg">
            <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center">
                <h1 className="text-xl text-blue-900">Facilities</h1>
                <h1 className="text-lg">
                  {filteredFacilities.length + "/" + totalElements}
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
                <button className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:px-5 mb-12 overflow-auto pb-5 mt-2 h-[calc(100vh-180px)]">
          {filteredFacilities && filteredFacilities.length > 0 ? (
            <table className="border-2 w-full bg-white shadow-lg text-center">
              <thead className="bg-blue-900 text-white sticky top-0">
                <tr className="text-sm">
                  <th className="px-2 font-bold py-2">#</th>
                  <th className="px-2 font-bold">No.</th>
                  <th className="px-2 font-bold">Landlord</th>
                  <th className="px-2 font-bold">Business</th>
                  <th className="px-2 font-bold">Category</th>
                  <th className="px-2 font-bold">Name</th>
                  <th className="px-2 font-bold">Country</th>
                  <th className="px-2 font-bold">City</th>
                  <th className="px-2 font-bold">Price</th>
                  <th className="px-2 font-bold">Monthly Bid</th>
                  <th className="px-2 font-bold">Registered</th>
                </tr>
              </thead>
              <tbody className="font-light">
                {filteredFacilities.map((facility, index) => (
                  <FacilityRow
                    key={index}
                    facilityIndex={index}
                    facility={facility}
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
          <PaginationButtons
            page={page}
            totalPages={totalPages}
            handleFetchNextPage={handleFetchNextPage}
            handleFetchPreviousPage={handleFetchPreviousPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Facilities;
