import React, { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import User from "./user";
import { UserModel } from "./models/userModel";
import { getAllUsers, resetUsers } from "./usersSlice";
import { FaSearch } from "react-icons/fa";
import AlertMessage from "../../other/alertMessage";
import { UserRoleEnum } from "../../global/enums/userRoleEnum";
import Preloader from "../../other/Preloader";
import { AppDispatch } from "../../app/store";
import axios from "axios";
import { fetchData } from "../../global/api";
import { setAlert } from "../../other/alertSlice";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import PaginationButtons from "../../global/PaginationButtons";

interface Props {}
const UserList: React.FC<Props> = () => {
  // local state variabes
  const [isShowSearch, setIsShowSearch] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<UserModel[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const usersState = useSelector(getAllUsers);
  const { users, status, error, page, size, totalElements, totalPages } =
    usersState;

  useEffect(() => {
    const originalUsers =
      users.length > 0
        ? [...users]
            .sort((a, b) => {
              const aUserId = a.userId ? parseInt(a.userId, 10) : 0;
              const bUserId = b.userId ? parseInt(b.userId, 10) : 0;
              return bUserId - aUserId;
            })
            .filter((u) => u.userRole !== UserRoleEnum.admin)
        : [];
    if (searchString.trim().length === 0) {
      setFilteredUsers(originalUsers);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredUsers(
        originalUsers.filter((user) => {
          const {
            userId,
            firstName,
            lastName,
            gender,
            userEmail,
            userTelephone,
            userRole,
            createdDate,
          } = user;

          const userNumber = "USR-" + userId;
          const date = new Date(String(createdDate)).getDate();
          const month = new Date(String(createdDate)).getMonth() + 1;
          const year = new Date(String(createdDate)).getFullYear();

          const accountCreated = date + "/" + month + "/" + year;

          return (
            (userNumber && userNumber.toLowerCase().includes(searchTerm)) ||
            (firstName && firstName.toLowerCase().includes(searchTerm)) ||
            (lastName && lastName.toLowerCase().includes(searchTerm)) ||
            (gender && gender.toLowerCase().includes(searchTerm)) ||
            (userEmail && userEmail.toLowerCase().includes(searchTerm)) ||
            (userTelephone &&
              userTelephone.toLowerCase().includes(searchTerm)) ||
            (accountCreated &&
              accountCreated.toLowerCase().includes(searchTerm)) ||
            (userRole && userRole.toLowerCase().includes(searchTerm))
          );
        })
      );
    }
  }, [searchString, users]);

  // handle search event
  const handleSerchUser = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    []
  );

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(`/fetchUsers/${page + 1}/${size}`);
      console.log(result.data);
      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            message: result.data.message,
            type: AlertTypeEnum.danger,
            status: true,
          })
        );

        return;
      }
      dispatch(resetUsers(result.data));
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
      const result = await fetchData(`/fetchUsers/${page - 1}/${size}`);

      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            message: result.data.message,
            type: AlertTypeEnum.danger,
            status: true,
          })
        );

        return;
      }
      dispatch(resetUsers(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching bids: ", error);
    }
  }, [dispatch, page, size]);

  if (status === "loading") return <Preloader />;
  if (error !== null) return <h1>{"error"}</h1>;

  return (
    <div className="users-list flex w-full h-svh lg:h-dvh mt-20 lg:mt-0 z-0">
      <div className="list w-full relative bg-gray-100">
        <div className="bg-white w-full shadow-lg mb-5">
          {/* <div className="upper bg-yellow-400 w-full h-2/3"></div> */}
          <div className="lower w-full h-1/3 flex flex-wrap justify-end items-center px-10 py-3 bg-white">
            <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center">
                <h1 className="text-xl text-blue-900">Users</h1>
                <h1 className="text-lg">
                  {filteredUsers.length + "/" + totalElements}
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
                  onChange={handleSerchUser}
                />
                <button
                  className="bg-blue-950 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border "
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

        <div className="lg:px-5 mb-12 overflow-auto pb-5 mt-2 h-[calc(100vh-180px)]">
          {filteredUsers.length > 0 ? (
            <table className="border-2 w-full bg-white shadow-lg">
              <thead className="sticky top-0 bg-blue-900 text-base text-white py-5 z-10">
                <tr className="rounded-full">
                  <th className="px-2">#</th>
                  {/* <th className="px-2">Status</th> */}
                  <th className="px-2">User number</th>
                  <th className="px-2">FirstName</th>
                  <th className="px-2">LastName</th>
                  <th className="px-2">Gender</th>
                  <th className="px-2">Role</th>
                  <th className="px-2">Telephone</th>
                  <th className="px-2">Email</th>
                  <th className="px-2">Joined</th>
                  <th className="px-2">Last updated</th>
                </tr>
              </thead>
              <tbody className="text-black font-light">
                {filteredUsers.map((user: UserModel, index: number) => (
                  <User key={index} user={user} userIndex={index + 1} />
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
      <AlertMessage />
    </div>
  );
};

export default UserList;
