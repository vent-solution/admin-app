import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { fetchData } from "../../../global/api";
import PaginationButtons from "../../../global/PaginationButtons";
import { AccommodationModel } from "./AccommodationModel";
import {
  getFacilityAccommodations,
  resetFacilityAccommodations,
} from "./accommodationsSlice";
import { FacilitiesModel } from "../FacilityModel";
import Accommodation from "./Accommodation";
import AccommodationDetails from "./AccommodationDetails";

interface Props {
  facility: FacilitiesModel;
}

const Accommodations: React.FC<Props> = ({ facility }) => {
  // local state variabes
  const [searchString, setSearchString] = useState<string>("");
  const [filteredFacilityAccommodations, setFilteredFacilityAccommodations] =
    useState<AccommodationModel[]>([]);

  const [showAccommodationDetails, setShowAccommodationDetails] =
    useState<boolean>(false);
  const [currentAccommodation, setCurrentAccommodation] =
    useState<AccommodationModel>();

  const dispatch = useDispatch<AppDispatch>();
  const accommodationState = useSelector(getFacilityAccommodations);
  const { facilityAccommodations, totalElements, totalPages, page, size } =
    accommodationState;

  // filter facility bids
  useEffect(() => {
    const originalFacilityAccommodations =
      facilityAccommodations.length > 0
        ? [...facilityAccommodations].sort((a, b) => {
            const aAccommodationId = a.accommodationId
              ? parseInt(String(a.accommodationId), 10)
              : 0;
            const bBidId = b.accommodationId
              ? parseInt(String(b.accommodationId), 10)
              : 0;
            return bBidId - aAccommodationId;
          })
        : [];
    if (searchString.trim().length === 0) {
      setFilteredFacilityAccommodations(originalFacilityAccommodations);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredFacilityAccommodations(
        originalFacilityAccommodations.filter((facilityAccommodation) => {
          const {
            price,
            accommodationNumber,
            floor,
            dateCreated,
            accommodationType,
            availability,
          } = facilityAccommodation;

          const accommodationYear = new Date(`${dateCreated}`).getFullYear();
          const accommodationMonth = new Date(`${dateCreated}`).getMonth() + 1;
          const accommodationDay = new Date(`${dateCreated}`).getDate();
          const accommodationDate =
            accommodationDay +
            "/" +
            accommodationMonth +
            "/" +
            accommodationYear;
          return (
            (accommodationDate &&
              accommodationDate.toLowerCase().includes(searchTerm)) ||
            (accommodationNumber &&
              accommodationNumber.toLowerCase().includes(searchTerm)) ||
            (floor && floor.toLowerCase().includes(searchTerm)) ||
            (accommodationType &&
              accommodationType.toLowerCase().includes(searchTerm)) ||
            (availability && availability.toLowerCase().includes(searchTerm)) ||
            (price && Number(price) === Number(searchTerm))
          );
        })
      );
    }
  }, [searchString, facilityAccommodations]);

  // handle search event
  const handleSearchAccommodation = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    []
  );

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-accommodations-by-facility/${Number(facility.facilityId)}/${
          page + 1
        }/${size}`
      );
      dispatch(resetFacilityAccommodations(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH ACCOMMODATIONS CANCELLED ", error.message);
      }
      console.error("Error fetching accommodations: ", error);
    }
  }, [dispatch, page, size, facility.facilityId]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-accommodations-by-facility/${Number(facility.facilityId)}/${
          page - 1
        }/${size}`
      );
      console.log(result);
      dispatch(resetFacilityAccommodations(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH ACCOMMODATIONS CANCELLED ", error.message);
      }
      console.error("Error fetching accommodations: ", error);
    }
  }, [dispatch, page, size, facility.facilityId]);

  // show and hide accommodation details
  const toggleShowAccommodationDetails = () => {
    setShowAccommodationDetails(!showAccommodationDetails);
    console.log(showAccommodationDetails);
  };

  return (
    <div className="users-list flex w-full py-2 h-svh lg:h-dvh mt-0 lg:mt-0 z-0">
      {!showAccommodationDetails && (
        <div className="w-full relative bg-gray-100 h-[calc(100vh-100px)]">
          <div className="w-full">
            <div className="w-full h-1/3 flex flex-wrap justify-end items-center px-10 py-3">
              <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
                <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center font-bold">
                  <h1 className="text-lg">
                    {facilityAccommodations.length + "/" + totalElements}
                  </h1>
                </div>
                <div
                  className={` rounded-full  bg-white flex justify-between border-blue-950 border-2 w-full lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
                >
                  <input
                    type="text"
                    name=""
                    id="search-subscription"
                    placeholder="Search for unit..."
                    className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                    onChange={handleSearchAccommodation}
                  />

                  <button className="bg-blue-950 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                    {<FaSearch />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:px-5 mb-12 overflow-auto pb-5 h-[calc(100vh-170px)">
            {filteredFacilityAccommodations.length > 0 ? (
              <table className="border-2 w-full bg-white shadow-lg">
                <thead className="sticky top-0 bg-blue-900 text-base text-white">
                  <tr>
                    <th className="px-2">#</th>
                    <th className="px-2">ID</th>
                    <th className="px-2">Number</th>
                    <th className="px-2">Floor</th>
                    <th className="px-2">Type</th>
                    <th className="px-2">Capacty</th>
                    <th className="px-2">Price</th>
                    <th className="px-2">Status</th>
                    <th className="px-2">Tenants</th>
                    <th className="px-2">Created</th>
                    <th className="px-2">Updated</th>
                  </tr>
                </thead>
                <tbody className="text-black font-light">
                  {filteredFacilityAccommodations.map(
                    (accommodation: AccommodationModel, index: number) => (
                      <Accommodation
                        key={index}
                        accommodation={accommodation}
                        accommodationIndex={index}
                        facility={facility}
                        onClick={() => {
                          setCurrentAccommodation(accommodation);
                          toggleShowAccommodationDetails();
                          console.log(accommodation);
                        }}
                      />
                    )
                  )}
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
      )}

      {showAccommodationDetails && (
        <div
          className="lg:px-5 mb-12 overflow-auto pb-5 w-full"
          style={{ height: "calc(100vh - 100px)" }}
        >
          <AccommodationDetails
            accommodation={currentAccommodation}
            toggleShowAccommodationDetails={toggleShowAccommodationDetails}
          />
        </div>
      )}
    </div>
  );
};

export default Accommodations;
