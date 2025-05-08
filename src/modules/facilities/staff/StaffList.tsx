import React, { useEffect, useState } from "react";
import { ManagerModel } from "../ManagerModel";
import { FaSearch } from "react-icons/fa";

interface Props {
  manager: ManagerModel;
}

const StaffList: React.FC<Props> = ({ manager }) => {
  const [staffData] = useState<ManagerModel[]>([manager]);
  const [filteredStaff, setFilteredStaff] = useState<ManagerModel[]>();
  const [searchString, setSearchString] = useState<string>("");

  // handle search staff
  const handleSearchStaff = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  useEffect(() => {
    const originalStaffData = staffData;
    if (searchString.trim().length < 1) {
      setFilteredStaff(originalStaffData);
    } else {
      setFilteredStaff(
        originalStaffData.filter((staff) => {
          return (
            staff.user?.firstName
              ?.trim()
              .toLocaleLowerCase()
              .includes(searchString) ||
            staff.user?.lastName
              ?.trim()
              .toLocaleLowerCase()
              .includes(searchString)
          );
        })
      );
    }
  }, [searchString, staffData]);

  return (
    <div className="users-list flex w-full h-svh lg:h-dvh mt-20 lg:mt-0 z-0">
      <div className="list w-full">
        <div className="bg-white w-full">
          <div className="w-full h-1/3 flex flex-wrap justify-between items-center px-10 py-3 bg-blue-200">
            <div className="w-full lg:w-1/4">
              <h1 className="text-blue-950 text-2xl font-bold font-mono ">
                Vent
              </h1>
            </div>

            <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center">
                <h1 className="text-xl text-blue-900 font-bold">Bids</h1>
                <h1 className="text-lg font-bold">
                  {filteredStaff?.length + "/" + staffData.length}
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
                  onChange={handleSearchStaff}
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
          style={{ height: "calc(100vh - 70px)" }}
        >
          {filteredStaff && filteredStaff?.length > 0 ? (
            <table className="border-2 w-full bg-cyan-50 bordered mt-2">
              <thead className="sticky top-0 bg-blue-950 text-base text-white">
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
                {filteredStaff.map((staff: ManagerModel, index: number) => (
                  <h1>{staff.user?.firstName}</h1>
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
          {/* <PaginationButtons
            page={page}
            totalPages={totalPages}
            handleFetchNextPage={handleFetchNextPage}
            handleFetchPreviousPage={handleFetchPreviousPage}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default StaffList;
