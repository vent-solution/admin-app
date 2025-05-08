import React, { useState } from "react";
import { NavLinkModel } from "../modules/users/models/navLinkModel";
import NavItem from "./navItem";
import { MdNotifications } from "react-icons/md";
import { FaBars } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { ImProfile } from "react-icons/im";
import { RiLogoutCircleLine } from "react-icons/ri";
import { postData } from "../global/api";
import { CurrentUserModel } from "../modules/users/models/currentUserModel";
import axios from "axios";
import { AlertTypeEnum } from "../global/enums/alertTypeEnum";
import AlertMessage from "../other/alertMessage";
import ConfirmMessage from "../other/ConfirmMessage";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { setConfirm } from "../other/ConfirmSlice";
import { setAlert } from "../other/alertSlice";
import { setUserAction } from "../global/actions/actionSlice";
interface Props {
  navLinks: NavLinkModel[];
}
let SideBar: React.FC<Props> = ({ navLinks }) => {
  const [showProfileButtons, setShowProfileButtons] = useState<boolean>(false);

  const [showLinks, setShowLinks] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  // handle log out function
  const handelLogOut = async () => {
    try {
      setLoading(true);
      const current_user: CurrentUserModel = JSON.parse(
        localStorage.getItem("dnap-user") as string
      );

      const result = await postData(`/log-out/${current_user.userId}`, {});
      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            type: AlertTypeEnum.danger,
            message: result.data.message,
            status: true,
          })
        );
      }
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("REQUEST CANCELLED: ", error.message);
      }
    } finally {
      setLoading(false);
      window.location.href = "/";
      localStorage.removeItem("dnap-user");
    }
  };

  const toggleShowProfileButtons = () => {
    return setShowProfileButtons(!showProfileButtons);
  };

  return (
    <div
      className={`sideBar transition-all ease-in delay-150 ${
        !showLinks ? "h-30" : "h-dvh"
      } lg:h-dvh bg-blue-950 px-1 w-full  overflow-hidden`}
    >
      {/* SIDEBAR SECTION UPPER PART */}
      <div className="w-full h-1/6 flex items-center justify-around py-3 px-2 lg:px-10 text-center border-gray-400 border-b-2">
        <div className="logo  w-fit lg:w-1/3 font-bold">
          <img
            className="w-20 h-14"
            src="/images/logo-no-background.png"
            alt=""
          />
        </div>
        <div className="notifications w-1/3 text-3xl flex items-center justify-center relative">
          <div className="notification-inner p-1 w-fit h-fit hover:bg-blue-800 cursor-pointer rounded-full border-2 border-white">
            <MdNotifications />
            <span className="text-xs font-bold p-1 line-h text-white bg-red-700 py-0 rounded-full absolute top-0 right-11 lg:right-4 md:right-28 ">
              9+
            </span>
          </div>
        </div>
        <div className="profile w-10  transition-all ease-in-out delay-150">
          <div
            className="profile-image w-10 h-10 rounded-full hover:h-9 hover:w-9 cursor-pointer relative"
            style={{
              background: "url('/images/Anatoli-profile-pic.jpeg')",
              backgroundSize: "cover",
            }}
            onClick={toggleShowProfileButtons}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 absolute bottom-0 right-0"></span>
          </div>
        </div>
        <div className="bars text-white text-3xl font-extrabold px-5 lg:hidden">
          {!showLinks ? (
            <FaBars onClick={() => setShowLinks(true)} />
          ) : (
            <RxCross1 onClick={() => setShowLinks(false)} />
          )}
        </div>
      </div>

      <div
        className={`py-5 w-full   items-center justify-center ${
          showProfileButtons ? "flex" : "hidden"
        }`}
      >
        <button className=" hover:bg-blue-900 text-lg font-bold text-left px-5 text-white flex items-center my-1">
          <span className="p-2">
            <ImProfile />
          </span>
          Profile
        </button>
        <button
          className=" hover:bg-blue-900 text-lg font-bold text-left px-5 text-white flex items-center my-1"
          onClick={() => {
            dispatch(
              setConfirm({
                message: "Are you sure you want to log out?",
                status: true,
              })
            );

            dispatch(setUserAction({ userAction: handelLogOut }));
          }}
        >
          <span className="p-2">
            <RiLogoutCircleLine />
          </span>
          {loading ? "Wait..." : "Log out"}
        </button>
      </div>

      {/* SIDEBAR SECTION FOR NAV LINKS */}
      <div
        className={`links bg-blue-950 lg:flex w-full ${
          !showLinks ? "hidden" : ""
        } h-3/4 flex-wrap   overflow-auto text-gray-400 text-lg pl-5`}
      >
        <div className="py-2 w-full">
          {navLinks.map((navLink, index) => (
            <NavItem key={index} navLink={navLink} />
          ))}
        </div>
      </div>

      <AlertMessage />

      <ConfirmMessage />
    </div>
  );
};

SideBar = React.memo(SideBar);

export default SideBar;
