import React, { useCallback } from "react";
import { parseISO, formatDistanceToNow, format } from "date-fns";
import { SubscriptionModel } from "./SubscriptionModel";
import { TransactionStatusEnum } from "../../global/enums/transactionStatusEnum";
import axios from "axios";
import { putData } from "../../global/api";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { setAlert } from "../../other/alertSlice";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { setConfirm } from "../../other/ConfirmSlice";
import { setUserAction } from "../../global/actions/actionSlice";
import { Link } from "react-router-dom";
import { updateSubscription } from "./SubscriptionSlice";
import { FormatMoney } from "../../global/actions/formatMoney";
import { PAYMENT_TYPE_DATA } from "../../global/PreDefinedData/PreDefinedData";

interface Props {
  subscription: SubscriptionModel;
  subscriptionIndex: number;
}

const Subscription: React.FC<Props> = ({ subscription }) => {
  const dispatch = useDispatch<AppDispatch>();

  const createdDate = subscription.dateCreated
    ? parseISO(subscription.dateCreated)
    : null;

  const updatedDate = subscription.lastUpdated
    ? parseISO(subscription.lastUpdated)
    : null;

  // formating the date and time Subscription created
  const created = createdDate
    ? Date.now() - createdDate.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(createdDate, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(createdDate, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago")
          .replace("less than a Min Ago", "Just now")
    : "";

  // formating the date and time for Subscription's update
  const updated = updatedDate
    ? Date.now() - updatedDate.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(updatedDate, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(updatedDate, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago")
          .replace("less than a Min Ago", "Just now")
    : "";

  // handle approve subscription
  const handleApproveSubscription = useCallback(async () => {
    try {
      const result = await putData(
        `/approve-subscription/${Number(subscription.subscriptionId)}`,
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
            message: "Subscription has been approved successfully.",
            type: AlertTypeEnum.success,
            status: true,
          })
        );

        dispatch(
          updateSubscription({
            id: subscription.subscriptionId,
            changes: result.data,
          })
        );
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("APPROVE SUBSCRIPTION CANCELLED ", error.message);
      }
    } finally {
      dispatch(setConfirm({ message: "", status: false }));
    }
  }, [dispatch, subscription.subscriptionId]);

  // handle cancel subscription approval
  const handleCancelSubscriptionApproval = useCallback(async () => {
    try {
      const result = await putData(
        `/cancel-subscription-approval/${Number(subscription.subscriptionId)}`,
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
            message: "Subscription approval has been cancelled successfully.",
            type: AlertTypeEnum.success,
            status: true,
          })
        );

        dispatch(
          updateSubscription({
            id: subscription.subscriptionId,
            changes: result.data,
          })
        );
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("CANCEL APPROVE SUBSCRIPTION CANCELLED ", error.message);
      }
    } finally {
      dispatch(setConfirm({ message: "", status: false }));
    }
  }, [dispatch, subscription.subscriptionId]);

  return (
    <tr className="cursor-pointer text-sm text-center border-y-2 hover:bg-gray-100">
      <td className={`flex justify-center items-center`}>
        <span
          className={` w-24 px-2  text-white rounded-full text-xs flex items-center justify-center ${
            subscription.transactionStatus === TransactionStatusEnum.pending
              ? "bg-black"
              : subscription.transactionStatus === TransactionStatusEnum.aproved
              ? "bg-green-600"
              : subscription.transactionStatus ===
                TransactionStatusEnum.cancelled
              ? "bg-red-600"
              : ""
          } `}
        >
          {subscription.transactionStatus}
        </span>
      </td>
      <td className="px-2">{"USR-" + subscription.user.userId}</td>
      <td className="px-2">
        <Link to={`/landlords/${subscription.user.userId}`}>
          {subscription.user.firstName + " " + subscription.user.lastName}
        </Link>
      </td>

      <td className="px-2">{subscription.transactionNumber}</td>
      <td className="px-2 font-bold font-mono">
        {FormatMoney(subscription.amount, 2, subscription.currency)}
      </td>
      <td className="px-2">
        {
          PAYMENT_TYPE_DATA.find(
            (type) => type.value === subscription.paymentType
          )?.label
        }
      </td>
      <td className="px-2">{subscription.transactionDate}</td>
      <td className="px-2">{created}</td>
      <td className="px-2">{updated}</td>

      <td className="actions cursor-pointer h-full flex items-center justify-center">
        {subscription.transactionStatus === TransactionStatusEnum.pending ? (
          <button
            className="p-1 bg-gray-600 hover:bg-gray-400"
            onClick={() => {
              dispatch(
                setConfirm({
                  message: `Are you sure you want to approve this transaction No. ${subscription.transactionNumber} and Amount USD. ${subscription.amount}?`,
                  status: true,
                })
              );

              dispatch(
                setUserAction({ userAction: handleApproveSubscription })
              );
            }}
          >
            Approve
          </button>
        ) : (
          <button
            className="p-1 bg-red-600 hover:bg-red-400"
            onClick={() => {
              dispatch(
                setConfirm({
                  message: `Are you sure you want to cancel approval of this transaction No. ${subscription.transactionNumber} and Amount USD. ${subscription.amount}?`,
                  status: true,
                })
              );

              dispatch(
                setUserAction({ userAction: handleCancelSubscriptionApproval })
              );
            }}
          >
            Cancel approval
          </button>
        )}
      </td>

      <div className="absolute top-1/2 flex bg-red-800 w-54"></div>
    </tr>
  );
};

export default Subscription;
