import React from "react";
import { useSelector } from "react-redux";
import { getAllLandlords } from "../landlords/landlordSlice";
import { getAllUsers } from "../users/usersSlice";

interface Props {}

let NumberOfUsers: React.FC<Props> = () => {
  const usersState = useSelector(getAllUsers);
  const landlordsState = useSelector(getAllLandlords);
  const tenants = usersState.users.filter((user) => user.userRole === "tenant");
  const otherUsers = usersState.users.filter(
    (user) => user.userRole !== "landlord" && user.userRole !== "tenant"
  );

  return (
    <div className="w-full flex flex-wrap justify-between items-center text-center  uppercase my-10">
      <div className="mt-2 w-1/2 lg:w-1/5 py-5 shadow-lg bg-gradient-to-t from-blue-100 via-blue-200 to-blue-300">
        <h4 className="text-sm font-light text-gray-600">All Users</h4>
        <h1 className="text-3xl text-black font-light">
          {usersState.totalElements.toLocaleString()}
          <sup>+</sup>
        </h1>
      </div>

      <div className="mt-2 w-1/2 lg:w-1/5 py-5 shadow-lg bg-gradient-to-t from-orange-100 via-orange-200 to-orange-300">
        <h4 className="text-sm font-light text-gray-600">landlords</h4>
        <h1 className="text-3xl text-black font-light">
          {landlordsState.totalElements}
        </h1>
      </div>

      <div className="mt-2 w-1/2 lg:w-1/5 py-5 shadow-lg bg-gradient-to-t from-green-100 via-green-200 to-green-300">
        <h4 className="text-sm font-light text-gray-600">tenants</h4>
        <h1 className="text-3xl text-black font-light">
          {tenants.length.toLocaleString()}
        </h1>
      </div>

      <div className="mt-2 w-1/2 lg:w-1/5 py-5 shadow-lg bg-gradient-to-t from-red-100 via-red-200 to-red-300">
        <h4 className="text-sm font-light text-gray-600">other Users</h4>
        <h1 className="text-3xl text-black font-light">
          {otherUsers.length.toLocaleString()}
        </h1>
      </div>
    </div>
  );
};

NumberOfUsers = React.memo(NumberOfUsers);

export default NumberOfUsers;
