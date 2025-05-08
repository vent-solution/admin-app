import React, { useCallback, useEffect, useState } from "react";
import { FacilitiesModel } from "../FacilityModel";
import { FaSearch } from "react-icons/fa";
import AlertMessage from "../../../other/alertMessage";
import { SpaceModel } from "./SpaceModel";
import Space from "./Space";
import { useDispatch, useSelector } from "react-redux";
import { getSpaces, resetSpaces } from "./SpacesSlice";
import PaginationButtons from "../../../global/PaginationButtons";
import axios from "axios";
import { fetchData } from "../../../global/api";
import { AppDispatch } from "../../../app/store";

interface Props {
  facility: FacilitiesModel;
}

const Spaces: React.FC<Props> = ({ facility }) => {
  // local state variabes
  const [searchString, setSearchString] = useState<string>("");
  const [filteredSpaces, setFilteredSpaces] = useState<SpaceModel[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const spacesState = useSelector(getSpaces);
  const { spaces, totalElements, totalPages, page, size } = spacesState;

  useEffect(() => {
    const originalSpaces =
      spaces.length > 0
        ? [...spaces].sort((a, b) => {
            const aSpaceId = a.spaceId ? parseInt(String(a.spaceId), 10) : 0;
            const bSpaceId = b.spaceId ? parseInt(String(b.spaceId), 10) : 0;
            return bSpaceId - aSpaceId;
          })
        : [];
    if (searchString.trim().length === 0) {
      setFilteredSpaces(originalSpaces);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredSpaces(
        originalSpaces.filter((space) => {
          const { spaceNumber, spaceCategory, availability, dateCreated } =
            space;

          const spaceYear = new Date(`${dateCreated}`).getFullYear();
          const spaceMonth = new Date(`${dateCreated}`).getMonth() + 1;
          const spaceDay = new Date(`${dateCreated}`).getDate();
          const spaceDate = spaceDay + "/" + spaceMonth + "/" + spaceYear;
          return (
            (spaceDate && spaceDate.toLowerCase().includes(searchTerm)) ||
            (spaceNumber && spaceNumber.toLowerCase().includes(searchTerm)) ||
            (spaceCategory &&
              spaceCategory.toLowerCase().includes(searchTerm)) ||
            (availability && availability.toLowerCase().includes(searchTerm))
          );
        })
      );
    }
  }, [searchString, spaces]);

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
      const result = await fetchData(
        `/fetch-spaces-by-facility/${Number(facility.facilityId)}/${
          page + 1
        }/${size}`
      );
      dispatch(resetSpaces(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH SPACES CANCELLED ", error.message);
      }
      console.error("Error fetching spaces: ", error);
    }
  }, [dispatch, page, size, facility.facilityId]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-spaces-by-facility/${Number(facility.facilityId)}/${
          page - 1
        }/${size}`
      );
      console.log(result);
      dispatch(resetSpaces(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH SPACES CANCELLED ", error.message);
      }
      console.error("Error fetching spaces: ", error);
    }
  }, [dispatch, page, size, facility.facilityId]);

  return (
    <div className="users-list flex w-full py-2 h-svh lg:h-dvh mt-0 lg:mt-0 z-0">
      <div className="list w-full">
        <div className="bg-white w-full">
          <div className="w-full h-1/3 flex flex-wrap justify-end items-center px-10 py-3">
            <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center">
                <h1 className="text-lg">
                  {spaces.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-950 border-2 w-full lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-subscription"
                  placeholder="Search for bid..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSearchBids}
                />

                <button className="bg-blue-950 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="lg:px-5 mb-12 overflow-auto pb-5 relative"
          style={{ height: "calc(100vh - 170px)" }}
        >
          {filteredSpaces.length > 0 ? (
            <table className="border-2 w-full bg-cyan-50 bordered">
              <thead className="sticky top-0 bg-blue-950 text-base text-white">
                <tr>
                  <th className="px-2">#</th>
                  <th className="px-2">ID</th>
                  <th className="px-2">Number</th>
                  <th className="px-2">Category</th>
                  <th className="px-2">Capacity</th>
                  <th className="px-2">Status</th>
                  <th className="px-2">Price</th>
                  <th className="px-2">Added</th>
                  <th className="px-2">Updated</th>
                </tr>
              </thead>
              <tbody className="text-black font-light">
                {filteredSpaces.map((space: SpaceModel, index: number) => (
                  <Space
                    key={index}
                    space={space}
                    spaceIndex={index}
                    preferedCurrency={facility.preferedCurrency}
                  />
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
          <PaginationButtons
            page={page}
            totalPages={totalPages}
            handleFetchNextPage={handleFetchNextPage}
            handleFetchPreviousPage={handleFetchPreviousPage}
          />
        </div>
      </div>
      <AlertMessage />
    </div>
  );
};

export default Spaces;
