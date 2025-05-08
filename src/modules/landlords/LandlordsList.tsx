import React, { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { FaSearch } from "react-icons/fa";
import AlertMessage from "../../other/alertMessage";
import { LandlordModel } from "./models/LandlordModel";
import Landlord from "./Landlord";
import { getAllLandlords, resetLandlords } from "./landlordSlice";
import Preloader from "../../other/Preloader";
import axios from "axios";
import { fetchData } from "../../global/api";
import { AppDispatch } from "../../app/store";
import PaginationButtons from "../../global/PaginationButtons";

interface Props {}
const LandlordsList: React.FC<Props> = () => {
  // LOCAL STATES
  const [isShowSearch, setIsShowSearch] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>("");
  const [filteresLandlords, setFilteredLandlords] = useState<LandlordModel[]>(
    []
  );

  const dispatch = useDispatch<AppDispatch>();
  const landlordsState = useSelector(getAllLandlords);
  const { landlords, status, error, page, size, totalElements, totalPages } =
    landlordsState;

  // filter landlords
  useEffect(() => {
    const originalLandlords =
      landlords.length > 0
        ? [...landlords].sort((a, b) => {
            const aUserId = a.user?.userId ? parseInt(a.user?.userId, 10) : 0;
            const bUserId = b.user?.userId ? parseInt(b.user?.userId, 10) : 0;
            return bUserId - aUserId;
          })
        : [];

    if (searchString.trim().length < 1) {
      setFilteredLandlords(originalLandlords);
    } else {
      const searchTerm = searchString.toLocaleLowerCase();
      setFilteredLandlords(
        originalLandlords.filter((landlord) => {
          const { landlordId, user, contact, address, dateCreated } = landlord;

          const landlordNumber = "LLD-" + landlordId;

          const date = new Date(String(dateCreated)).getDate();
          const month = new Date(String(dateCreated)).getMonth() + 1;
          const year = new Date(String(dateCreated)).getFullYear();

          const landlordDateCreated = date + "/" + month + "/" + year;

          return (
            (user?.firstName &&
              user?.firstName.toLowerCase().includes(searchTerm)) ||
            (contact?.email &&
              contact?.email.toLowerCase().includes(searchTerm)) ||
            (contact?.telephone1 &&
              contact?.telephone1.toLowerCase().includes(searchTerm)) ||
            (address?.country &&
              address?.country.toLowerCase().includes(searchTerm)) ||
            (address?.city &&
              address?.city.toLowerCase().includes(searchTerm)) ||
            (user?.userStatus &&
              user?.userStatus.toLowerCase().includes(searchTerm)) ||
            (landlordNumber &&
              landlordNumber.toLowerCase().includes(searchTerm)) ||
            (landlordDateCreated &&
              landlordDateCreated.toLowerCase().includes(searchTerm))
          );
        })
      );
    }
  }, [landlords, searchString]);

  // handle search landlord
  const handleSearchLandlord = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(`/fetchLandlords/${page + 1}/${size}`);
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetLandlords(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching admins: ", error);
    }
  }, [dispatch, page, size]);

  // handle fetch next page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(`/fetchLandlords/${page - 1}/${size}`);
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetLandlords(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH ADMINS CANCELLED ", error.message);
      }
      console.error("Error fetching admins: ", error);
    }
  }, [dispatch, page, size]);

  if (status === "idle") return <Preloader />;
  if (error !== null) return <h1>{error}</h1>;

  return (
    <div className="users-list flex w-full h-svh lg:h-dvh mt-20 lg:mt-0 z-0">
      <div className="list w-full relative bg-gray-100">
        <div className=" w-full shadow-lg mb-5">
          <div className="lower w-full h-1/3 flex flex-wrap justify-end items-center px-10 bg-white  py-5">
            <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center">
                <h1 className="text-xl text-blue-900">All Landlords</h1>
                <h1 className="text-lg">
                  {filteresLandlords.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-950 border-2 w-full lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-users"
                  placeholder="Search..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSearchLandlord}
                />
                <button
                  className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border "
                  onClick={() =>
                    isShowSearch
                      ? setIsShowSearch(false)
                      : setIsShowSearch(true)
                  }
                >
                  {!isShowSearch ? <FaSearch /> : <FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:px-5 mb-12 overflow-auto pb-5 relative mt-1 h-[calc(100vh-100px)]">
          {filteresLandlords.length > 0 ? (
            <table className="border-2 w-full bg-white shadow-lg">
              <thead className="sticky top-0 bg-blue-900 text-base text-white">
                <tr>
                  <th className="px-2">#</th>
                  {/* <th className="px-2">Status</th> */}
                  <th className="px-2">Landlord number</th>
                  <th className="px-2">FirstName</th>
                  <th className="px-2">LastName</th>
                  <th className="px-2">Gender</th>
                  <th className="px-2">Telephone</th>
                  <th className="px-2">Email</th>
                  <th className="px-2">Country</th>
                  <th className="px-2">City</th>
                  <th className="px-2">Facilities</th>
                  <th className="px-2">Joined</th>
                </tr>
              </thead>
              <tbody className="text-black font-light">
                {filteresLandlords.map(
                  (landlord: LandlordModel, index: number) => (
                    <Landlord
                      key={index}
                      landlord={landlord}
                      userIndex={index + 1}
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
      <AlertMessage />
    </div>
  );
};

export default LandlordsList;
