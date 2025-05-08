import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLandlordFacilities,
  getAllLandlordFacilities,
  resetLandlordFacilities,
} from "./LandlordFacilitiesSlice";
import { AppDispatch } from "../../../app/store";
import FacilityRow from "../../facilities/FacilityRow";
import Preloader from "../../../other/Preloader";
import PaginationButtons from "../../../global/PaginationButtons";
import axios from "axios";
import { fetchData } from "../../../global/api";
import { FacilitiesModel } from "../../facilities/FacilityModel";
import { FaSearch } from "react-icons/fa";
import { LandlordModel } from "../models/LandlordModel";

interface Props {
  landlord: LandlordModel;
}

const LandlordFacilities: React.FC<Props> = ({ landlord }) => {
  const [searchString, setSearchString] = useState<string>("");
  const [filteredFacilities, setFilteredFacilities] = useState<
    FacilitiesModel[]
  >([]);

  const dispatch = useDispatch<AppDispatch>();
  const facilitiesState = useSelector(getAllLandlordFacilities);
  const { facilities, status, error, page, size, totalElements, totalPages } =
    facilitiesState;

  // fetch a list of facilities that belong to the landlord
  useEffect(() => {
    if (
      landlord.user?.userId !== undefined &&
      !isNaN(Number(landlord.user?.userId))
    ) {
      dispatch(
        fetchLandlordFacilities({
          page: 0,
          size: 15,
          userId: Number(landlord.user?.userId),
        })
      );
    }
  }, [landlord, dispatch]);

  // searching for a landlord
  useEffect(() => {
    if (searchString.trim().length === 0) {
      setFilteredFacilities(facilities);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredFacilities(
        facilities.filter((facility) => {
          const {
            facilityId,
            facilityName,
            facilityCategory,
            facilityLocation: { country, city },
          } = facility;

          const facilityNumber = "FAC-" + facilityId;
          return (
            (facilityId && facilityNumber.toLowerCase().includes(searchTerm)) ||
            (facilityName && facilityName.toLowerCase().includes(searchTerm)) ||
            (facilityCategory &&
              facilityCategory.toLowerCase().includes(searchTerm)) ||
            (country && country.toLowerCase().includes(searchTerm)) ||
            (city && city.toLowerCase().includes(searchTerm))
          );
        })
      );
    }
  }, [searchString, facilities]);

  // on change of the search field
  const handleSearchFacility = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    []
  );

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-facilities-by-landlord/${Number(landlord.user?.userId)}/${
          page + 1
        }/${size}`
      );
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetLandlordFacilities(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching admins: ", error);
    }
  }, [dispatch, page, size, landlord]);

  // handle fetch next page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-facilities-by-landlord/${Number(landlord.user?.userId)}/${
          page - 1
        }/${size}`
      );
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetLandlordFacilities(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH ADMINS CANCELLED ", error.message);
      }
      console.error("Error fetching admins: ", error);
    }
  }, [dispatch, page, size, landlord]);

  if (status === "loading") return <Preloader />;

  if (status === "failed") return <p>Error loading facilities: {error}</p>;

  return (
    <div className="w-full h-[calc(100vh-100px)] relative bg-gray-100">
      <div className="w-full px-10 flex flex-wrap justify-end items-center pt-5 lg:pt-1">
        <h1 className="px-10 text-lg font-bold">Facilities</h1>
        <h1 className="px-10 text-lg font-bold">
          {filteredFacilities.length + "/" + totalElements}
        </h1>
        <div
          className={` rounded-full  bg-white flex justify-between border-blue-900 border-2 w-full lg:w-1/3 h-3/4 mt-5 lg:mt-0`}
        >
          <input
            type="text"
            name=""
            id="search-users"
            placeholder="Search for user..."
            className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
            onChange={handleSearchFacility}
          />
          <button className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
            {<FaSearch />}
          </button>
        </div>
      </div>

      <div className="overflow-auto h-[calc(100vh-230px)] p-0">
        {filteredFacilities && filteredFacilities.length > 0 ? (
          <table className="w-full text-center bg-white shadow-lg">
            <thead className="bg-blue-900 text-white sticky top-0">
              <tr className="text-sm">
                <th className="px-2 font-bold">#</th>
                <th className="px-2 font-bold">Facility number</th>
                <th className="px-2 font-bold">Landlord</th>
                <th className="px-2 font-bold">Business</th>
                <th className="px-2 font-bold">Category</th>
                <th className="px-2 font-bold">Name</th>
                <th className="px-2 font-bold">Country</th>
                <th className="px-2 font-bold">City</th>
                <th className="px-2 font-bold">Price</th>
                <th className="px-2 font-bold">Bid</th>
                <th className="px-2 font-bold">Registered</th>
              </tr>
            </thead>
            <tbody>
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
      </div>
      <PaginationButtons
        page={page}
        totalPages={totalPages}
        handleFetchNextPage={handleFetchNextPage}
        handleFetchPreviousPage={handleFetchPreviousPage}
      />
    </div>
  );
};

export default LandlordFacilities;
