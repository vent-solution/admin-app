import React, { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { FaSearch } from "react-icons/fa";
import { UserModel } from "../users/models/userModel";
import Preloader from "../../other/Preloader";
import Staff from "./Staff";
import { useNavigate } from "react-router-dom";
import { getAdminUsers, resetAdmins } from "./AdminStaffSlice";
import axios from "axios";
import { fetchData } from "../../global/api";
import { AppDispatch } from "../../app/store";
import PaginationButtons from "../../global/PaginationButtons";
import AddUserForm from "../users/addUserForm";

interface Props {}
let StaffsList: React.FC<Props> = () => {
  const navigate = useNavigate();
  // LOCAL STATES
  const [showUserForm, setShowUserForm] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>("");
  const [filteredAdmins, setFilteredAdmins] = useState<UserModel[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const staffsState = useSelector(getAdminUsers);
  const { users, status, error, page, size, totalElements, totalPages } =
    staffsState;

  // filter admin staff
  useEffect(() => {
    const originalAdmins =
      users.length > 0
        ? [...users]
            .sort((a, b) => {
              const aUserId = a.userId ? parseInt(a.userId, 10) : 0;
              const bUserId = b.userId ? parseInt(b.userId, 10) : 0;
              return bUserId - aUserId;
            })
            .filter((staffUsers) => staffUsers.userRole === "user")
        : [];
    if (searchString.trim().length === 0) {
      setFilteredAdmins(originalAdmins);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredAdmins(
        originalAdmins.filter((admins) => {
          const {
            userId,
            firstName,
            lastName,
            gender,
            userEmail,
            userTelephone,
            userStatus,
            createdDate,
          } = admins;

          const userNumber = "USR-" + userId;

          const date = new Date(String(createdDate)).getDate();
          const month = new Date(String(createdDate)).getMonth() + 1;
          const year = new Date(String(createdDate)).getFullYear();

          const staffDateCreated = date + "/" + month + "/" + year;

          return (
            (userNumber && userNumber.toLowerCase().includes(searchTerm)) ||
            (userStatus && userStatus.toLowerCase().includes(searchTerm)) ||
            (userStatus && userStatus.toLowerCase().includes(searchTerm)) ||
            (firstName && firstName.toLowerCase().includes(searchTerm)) ||
            (lastName && lastName.toLowerCase().includes(searchTerm)) ||
            (gender && gender.toLowerCase().includes(searchTerm)) ||
            (userEmail && userEmail.toLowerCase().includes(searchTerm)) ||
            (userTelephone &&
              userTelephone.toLowerCase().includes(searchTerm)) ||
            (staffDateCreated &&
              staffDateCreated.toLowerCase().includes(searchTerm))
          );
        })
      );
    }
  }, [searchString, users]);

  // handle the change event for searching user serach field
  const handleSearchStaff = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    []
  );

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(`/fetch-admin-users/${page + 1}/${size}`);
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetAdmins(result.data));
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
      const result = await fetchData(`/fetch-admin-users/${page - 1}/${size}`);
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetAdmins(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH ADMINS CANCELLED ", error.message);
      }
      console.error("Error fetching admins: ", error);
    }
  }, [dispatch, page, size]);

  // render a preloader screen if the users status is loading
  if (status === "loading") return <Preloader />;
  if (error !== null) return <h1>{error}</h1>;

  return (
    <div className="users-list flex w-full h-svh lg:h-dvh mt-20 lg:mt-0 z-0">
      <div
        className={`form py-10 flex flex-wrap items-center absolute text-teal-50 transition-transform duration-1000 ease-in-out h-full bg-slate-700 ${
          showUserForm ? "w-full md:w-full lg:w-1/3" : "overflow-hidden"
        } `}
      >
        <AddUserForm
          showUserForm={showUserForm}
          setShowUserForm={setShowUserForm}
        />
      </div>
      <div className="list w-full relative bg-gray-100">
        <div className="bg-white w-full">
          <div className="lower w-full h-1/3 flex flex-wrap justify-end items-center px-10 py-5 bg-white shadow-lg">
            <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center">
                <h1 className="text-xl text-blue-900">All staffs</h1>
                <h1 className="text-lg">
                  {filteredAdmins.length + "/" + totalElements}
                </h1>
                <button
                  className="bg-blue-900 text-white px-5 rounded-md text-lg hover:bg-blue-700 active:scale-95"
                  onClick={() => {
                    setShowUserForm(true);
                    navigate("/staffs");
                  }}
                >
                  Add user
                </button>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-900 border-2 w-full lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-users"
                  placeholder="Search for staff..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSearchStaff}
                />
                <button className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:px-5 mb-12 overflow-auto pb-5 relative mt-1 h-[calc(100vh-100px)]">
          {filteredAdmins.length > 0 ? (
            <table className="border-2 w-full bg-white shadow-lg">
              <thead className="sticky top-0 bg-blue-900 text-base text-white">
                <tr>
                  <th className="px-2">Status</th>
                  <th className="px-2">User ID</th>
                  <th className="px-2">FirstName</th>
                  <th className="px-2">LastName</th>
                  <th className="px-2">Gender</th>
                  <th className="px-2">Role</th>
                  <th className="px-2">Telephone</th>
                  <th className="px-2">Email</th>
                  <th className="px-2">Added</th>
                  <th className="px-2">Last updated</th>
                  <th className="px-2">Action</th>
                </tr>
              </thead>
              <tbody className="text-black font-light">
                {filteredAdmins.map((staff: UserModel, index: number) => (
                  <Staff
                    key={index}
                    user={staff}
                    userIndex={index}
                    setShowUserForm={setShowUserForm}
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

StaffsList = React.memo(StaffsList);

export default StaffsList;
