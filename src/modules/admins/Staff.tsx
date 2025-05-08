import React, { useCallback } from "react";
import { UserStatusEnum } from "../../global/enums/userStatusEnum";
import { parseISO, formatDistanceToNow, format } from "date-fns";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ImBlocked } from "react-icons/im";
import { GrEdit } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../users/models/userModel";
import axios from "axios";
import { deleteData, putData } from "../../global/api";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { setAlert } from "../../other/alertSlice";
import { setConfirm } from "../../other/ConfirmSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { setUserAction } from "../../global/actions/actionSlice";
import { deleteAdmin, updateAdmin } from "./AdminStaffSlice";

interface Props {
  user: UserModel;
  userIndex: number;
  setShowUserForm: React.Dispatch<React.SetStateAction<boolean>>;
}
let Staff: React.FC<Props> = ({ user, setShowUserForm }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const joinedDate = user.createdDate ? parseISO(user.createdDate) : null;
  const lastActivity = user.lastUpdated ? parseISO(user.lastUpdated) : null;

  // formating the date and time user joined
  const joined = joinedDate
    ? Date.now() - joinedDate.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(joinedDate, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(joinedDate, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago")
          .replace("less than a Min Ago", "Just now")
    : "";

  // formating the date and time user's last activity
  const updated = lastActivity
    ? Date.now() - lastActivity.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(lastActivity, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(lastActivity, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago")
          .replace("less than a Min Ago", "Just now")
    : "";

  // blocking a user
  const handleBlockUser = useCallback(async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    try {
      const result = await putData(
        `/block-user/${Number(user.userId)}/${Number(currentUser.userId)}`,
        {}
      );
      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            message: result.data.message,
            type: AlertTypeEnum.danger,
            status: true,
          })
        );
      } else {
        dispatch(
          setAlert({
            message: "User has been blocked successfully.",
            type: AlertTypeEnum.success,
            status: true,
          })
        );

        dispatch(updateAdmin({ id: user.userId, changes: result.data }));
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("REQUEST CANCELLED ", error.message);
      }
    } finally {
      dispatch(setConfirm({ message: "", status: false }));
    }
  }, [dispatch, user.userId]);

  // blocking a user
  const handleUnBlockUser = useCallback(async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    try {
      const result = await putData(
        `/unblock-user/${Number(user.userId)}/${Number(currentUser.userId)}`,
        {}
      );
      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            message: result.data.message,
            type: AlertTypeEnum.danger,
            status: true,
          })
        );
      } else {
        dispatch(
          setAlert({
            message: "User Unblocked successfully.",
            type: AlertTypeEnum.success,
            status: true,
          })
        );
        dispatch(updateAdmin({ id: user.userId, changes: result.data }));
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("REQUEST CANCELLED ", error.message);
      }
    } finally {
      dispatch(setConfirm({ message: "", status: false }));
    }
  }, [dispatch, user.userId]);

  // handle deleting a  user
  const handleDeleteUser = useCallback(async () => {
    try {
      const result = await deleteData(`/deleteUser/${user.userId}`);
      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            message: result.data.message,
            type: AlertTypeEnum.danger,
            status: true,
          })
        );
      } else {
        dispatch(
          setAlert({
            message: result.data.message,
            type: AlertTypeEnum.success,
            status: true,
          })
        );

        dispatch(deleteAdmin(Number(user.userId)));
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("DELETING USER CANCELLED ", error.message);
      }
    } finally {
      dispatch(setConfirm({ message: "", status: false }));
    }
  }, [dispatch, user.userId]);

  return (
    <tr className="cursor-pointer text-sm text-center border-y-2 hover:bg-gray-100">
      <td className={`flex justify-center items-center`}>
        <span
          className={` w-24 px-2  text-white rounded-full text-xs flex items-center justify-center ${
            user.userStatus === UserStatusEnum.disabled
              ? "bg-black"
              : user.userStatus === UserStatusEnum.enabled
              ? "bg-blue-600"
              : user.userStatus === UserStatusEnum.online
              ? "bg-green-600"
              : user.userStatus === UserStatusEnum.offline
              ? "bg-gray-500"
              : user.userStatus === UserStatusEnum.blocked
              ? "bg-red-600"
              : ""
          } `}
        >
          {user.userStatus}
        </span>
      </td>
      <td className="px-2 py-5">{"USR-" + user.userId}</td>
      <td className="px-2">{user.firstName}</td>
      <td className="px-2">{user.lastName}</td>
      <td className="px-2">{user.gender}</td>
      <td className="px-2">{user.userRole}</td>
      <td className="px-2">{user.userTelephone}</td>
      <td className="px-2">{user.userEmail}</td>
      <td className="px-2">{joined}</td>
      <td className="px-2">{updated}</td>
      <td className="actions cursor-pointer h-full flex items-center justify-center">
        {user.userRole === "user" ? (
          <>
            <button
              className="px-2 text-xl w-1/2 flex justify-center hover:bg-blue-800"
              onClick={() => {
                navigate(`/staffs/${user.userId}`);
                setShowUserForm(true);
              }}
            >
              <GrEdit />
            </button>
            <button
              className="px-2 text-xl w-1/2 flex justify-center hover:bg-black"
              onClick={() => {
                dispatch(
                  setUserAction({
                    userAction:
                      user.userStatus !== UserStatusEnum.blocked
                        ? handleBlockUser
                        : handleUnBlockUser,
                  })
                );
                dispatch(
                  setConfirm({
                    message:
                      user.userStatus !== UserStatusEnum.blocked
                        ? "Are you sure you want to block this user?"
                        : "Are you sure you want to unblock this user?",
                    status: true,
                  })
                );
              }}
            >
              <ImBlocked />
            </button>
            <button
              className="px-2 text-xl w-1/2 flex justify-center hover:bg-red-500"
              onClick={() => {
                dispatch(
                  setConfirm({
                    message: "Are you sure you want to delete this staff ?",
                    status: true,
                  })
                );
                dispatch(setUserAction({ userAction: handleDeleteUser }));
              }}
            >
              <RiDeleteBin6Line />
            </button>
          </>
        ) : null}
      </td>

      <div className="absolute top-1/2 flex bg-red-800 w-54"></div>
    </tr>
  );
};
Staff = React.memo(Staff);
export default Staff;
