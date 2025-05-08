import React, { useCallback, useEffect, useState } from "react";
import { LandlordModel } from "./models/LandlordModel";
import { UserStatusEnum } from "../../global/enums/userStatusEnum";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { useDispatch } from "react-redux";
import { deleteData, fetchData, putData } from "../../global/api";
import axios from "axios";
import { setAlert } from "../../other/alertSlice";
import { setConfirm } from "../../other/ConfirmSlice";
import { setUserAction } from "../../global/actions/actionSlice";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { deleteLandlord, updateLandlord } from "./landlordSlice";
import { useNavigate } from "react-router-dom";
import { deleteSubscriptionByLandlord } from "../subscription/SubscriptionSlice";
import { UserModel } from "../users/models/userModel";
import { SubscriptionModel } from "../subscription/SubscriptionModel";
import { FormatMoney } from "../../global/actions/formatMoney";
import { SocketMessageModel } from "../../webSockets/SocketMessageModel";
import { UserActivity } from "../../global/enums/userActivity";
import { webSocketService } from "../../webSockets/socketService";

interface Props {
  landlord: LandlordModel;
}

let LandlordProfile: React.FC<Props> = ({ landlord }) => {
  const [subscription, setSubscription] = useState<SubscriptionModel | null>(
    null
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // formating the time that landlord joined the system
  const joinedDate = landlord.user?.createdDate
    ? parseISO(landlord.user.createdDate)
    : null;

  const joined = joinedDate
    ? Date.now() - joinedDate.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(joinedDate, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(joinedDate, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago") // Use relative time
    : "";

  // formating the time that landlord last visited the system
  const lastUpdateDate = landlord.user?.lastUpdated
    ? parseISO(landlord.user.lastUpdated)
    : null;

  const updated = lastUpdateDate
    ? Date.now() - lastUpdateDate.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(lastUpdateDate, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(lastUpdateDate, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago") // Use relative time
    : "";

  // function for blocking the landlord user
  const handleBlockUser = useCallback(async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    try {
      const result = await putData(
        `/block-user/${Number(landlord.user?.userId)}/${currentUser.userId}`,
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
            message: "User account has been blocked successfully.",
            type: AlertTypeEnum.success,
            status: true,
          })
        );
        dispatch(
          updateLandlord({
            id: landlord.user?.userId,
            changes: result.data,
          })
        );
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("BLOCKING USER WAS NOT SUCCESSfULL ", error.message);
      }
    } finally {
      dispatch(
        setConfirm({
          message: "",
          status: false,
        })
      );
    }

    const socketMessage: SocketMessageModel = {
      userId: Number(currentUser.userId),
      userRole: String(currentUser.userRole),
      content: JSON.stringify(landlord.user),
      activity: UserActivity.blockUser,
    };

    webSocketService.sendMessage("/app/block-user", socketMessage);
  }, [dispatch, landlord.user]);

  // function for un blocking the landlord user
  const handleUnBlockUser = useCallback(async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    try {
      const result = await putData(
        `/unblock-user/${landlord.user?.userId}/${currentUser.userId}`,
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
        return;
      }

      dispatch(
        setAlert({
          message: "User account has been unblocked successfully.",
          type: AlertTypeEnum.success,
          status: true,
        })
      );
      dispatch(
        updateLandlord({
          id: landlord.user?.userId,
          changes: result.data,
        })
      );
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("BLOCKING USER WAS NOT SUCCESSfULL ", error.message);
      }
    } finally {
      dispatch(
        setConfirm({
          message: "",
          status: false,
        })
      );
    }
  }, [dispatch, landlord.user]);

  // function for deleting the landlord user
  const handleDeleteLandlord = useCallback(async () => {
    try {
      const result = await deleteData(
        `/deleteLandlordById/${Number(landlord.landlordId)}`
      );
      if (
        (result.data.status && result.data.status !== "OK") ||
        result.status !== 200
      ) {
        window.alert(JSON.stringify(result));
        dispatch(
          setAlert({
            message: result.data.message + result.request.message,
            type: AlertTypeEnum.danger,
            status: true,
          })
        );
      } else {
        dispatch(
          setAlert({
            message: "Land lord account has been deleted successfully.",
            type: AlertTypeEnum.success,
            status: true,
          })
        );
        dispatch(deleteLandlord(landlord.user?.userId));
        dispatch(deleteSubscriptionByLandlord(String(landlord.landlordId)));
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("BLOCKING USER WAS NOT SUCCESSfULL ", error.message);
      }
    } finally {
      dispatch(
        setConfirm({
          message: "",
          status: false,
        })
      );
      navigate("/landlords");
    }
  }, [dispatch, landlord.landlordId, landlord.user?.userId, navigate]);

  // fetch the landlord's subscription
  useEffect(() => {
    const fetchSubscription = async (landlordId: number) => {
      try {
        const result = fetchData(
          `/fetch-subscription-by-landlord/${landlordId}`
        );

        setSubscription((await result).data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("FETCH LANDLORD SUBSCRIPTION CANCELLED: ", error.message);
        }
      }
    };

    fetchSubscription(Number(landlord.landlordId));
  }, [landlord.landlordId]);

  return (
    <div className="w-full h-[calc(100vh-120px)]  overflow-y-auto flex justify-center items-start pt-10 pb-20 px-5 relative">
      <div className="w-full lg:w-1/2">
        <div
          className="profile-picture border-2 border-blue-400 w-60 h-60 "
          style={{
            backgroundImage: "URL(/images/Anatoli-profile-pic.jpeg)",
            backgroundSize: "cover",
          }}
        ></div>
        <h1 className="text-lg lg:text-3xl font-bold relative">
          {landlord.user?.firstName + " " + landlord.user?.lastName}

          <span
            className={`w-3 h-3 rounded-full absolute top-2 ${
              landlord.user?.userStatus === UserStatusEnum.online
                ? "bg-green-500"
                : landlord.user?.userStatus === UserStatusEnum.blocked
                ? "bg-red-600"
                : "bg-gray-400"
            }`}
          ></span>
        </h1>
        <h2 className="text-lg uppercase italic pb-5">
          {landlord.user?.gender}
        </h2>

        {/* landlord subscription*/}
        <div className="p-2 bg-blue-900 bottom-0 mb-5  lg:top-1/4 right-5 lg:right-1/4 text-white">
          <div className="border-white border-2 p-3 flex justify-between items-center">
            <div className="">
              <h1 className="text-sm font-bold">Subscription</h1>
              {subscription?.dateCreated && (
                <p className="text-sm">
                  {parseISO(String(subscription?.dateCreated)).toDateString()}
                </p>
              )}
            </div>
            <div className="">
              {subscription?.dateCreated && (
                <h3 className="text-lg">
                  {FormatMoney(Number(subscription?.amount), 2, "usd")}
                </h3>
              )}
            </div>
          </div>
        </div>

        <div className="nationality w-full py-5">
          <h3 className="text-lg tracking-widest text-gray-800 border-b-2 border-gray-200">
            Nationality
          </h3>
          <h5 className="text-sm font-bold">
            Coutnry:{" "}
            <span className="italic font-normal">
              {landlord.address?.country}
            </span>
          </h5>
          <h5 className="text-sm font-bold">
            National ID:{" "}
            <span className="italic font-normal">{landlord.nationalId}</span>
          </h5>
          <h5 className="text-sm font-bold">
            ID Type:{" "}
            <span className="italic font-normal">{landlord.idType}</span>
          </h5>
        </div>

        <div className="contact w-full py-5">
          <h3 className="pt-5 text-lg tracking-widest text-gray-800 border-b-2 border-gray-200">
            Contact
          </h3>
          <h5 className="text-sm font-bold">
            Email:{" "}
            <span className="italic font-normal">
              {landlord.user?.userEmail}
            </span>
          </h5>
          <h5 className="text-sm font-bold">
            Primary telephone:{" "}
            <span className="italic font-normal">
              {landlord.user?.userTelephone}
            </span>
          </h5>
        </div>

        <div className="contact w-full py-5">
          <h3 className="pt-5 text-lg tracking-widest text-gray-800 border-b-2 border-gray-200">
            Address
          </h3>
          <h5 className="text-sm font-bold">
            State:{" "}
            <span className="italic font-normal">
              {landlord.address?.state}
            </span>
          </h5>
          <h5 className="text-sm font-bold">
            City:{" "}
            <span className="italic font-normal">{landlord.address?.city}</span>
          </h5>
          <h5 className="text-sm font-bold">
            County:{" "}
            <span className="italic font-normal">
              {landlord.address?.county}
            </span>
          </h5>
          <h5 className="text-sm font-bold">
            Division:{" "}
            <span className="italic font-normal">
              {landlord.address?.division}
            </span>
          </h5>
          <h5 className="text-sm font-bold">
            Parish:{" "}
            <span className="italic font-normal">
              {landlord.address?.parish}
            </span>
          </h5>
          <h5 className="text-sm font-bold">
            Zone:{" "}
            <span className="italic font-normal">{landlord.address?.zone}</span>
          </h5>
          <h5 className="text-sm font-bold">
            Street:{" "}
            <span className="italic font-normal">
              {landlord.address?.street}
            </span>
          </h5>
          <h5 className="text-sm font-bold">
            Plot:{" "}
            <span className="italic font-normal">
              {landlord.address?.plotNumber}
            </span>
          </h5>
        </div>

        <div className="contact w-full py-5">
          <h3 className="pt-5 text-lg tracking-widest text-gray-800 border-b-2 border-gray-200">
            Timelines
          </h3>
          <h5 className="text-sm font-bold">
            Joined: <span className="italic font-normal">{`${joined}`}</span>
          </h5>
          <h5 className="text-sm font-bold">
            Last activity: <span className="italic font-normal">{updated}</span>
          </h5>
        </div>
        <div className="p-10 w-full flex flex-wrap justify-center items-center">
          <div className="w-full lg:w-1/2 flex flex-wrap justify-around items-center">
            {landlord.user?.userStatus !== UserStatusEnum.blocked ? (
              <button
                className="p-3 text-lg bg-gray-500 hover:bg-gray-700 text-white"
                onClick={() => {
                  dispatch(
                    setConfirm({
                      message:
                        "Are you sure you want to block " +
                        landlord.user?.firstName,
                      status: true,
                    })
                  );

                  dispatch(setUserAction({ userAction: handleBlockUser }));
                }}
              >
                BLOCK
              </button>
            ) : (
              <button
                className="p-3 text-lg bg-gray-500 hover:bg-gray-700 text-white"
                onClick={() => {
                  dispatch(
                    setConfirm({
                      message:
                        "Are you sure you want to un block " +
                        landlord.user?.firstName,
                      status: true,
                    })
                  );

                  dispatch(setUserAction({ userAction: handleUnBlockUser }));
                }}
              >
                UN BLOCK
              </button>
            )}
            <button
              className="p-3 text-lg bg-red-800 hover:bg-red-600 text-white"
              onClick={() => {
                dispatch(
                  setConfirm({
                    message:
                      "Are you sure you want to delete user " +
                      landlord.user?.firstName,
                    status: true,
                  })
                );

                dispatch(setUserAction({ userAction: handleDeleteLandlord }));
              }}
            >
              DELETE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

LandlordProfile = React.memo(LandlordProfile);
export default LandlordProfile;
