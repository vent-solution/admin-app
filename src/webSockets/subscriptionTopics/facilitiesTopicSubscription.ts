import { UserActivity } from "../../global/enums/userActivity";
import { addNewExpense } from "../../modules/facilities/expenses/expenseSlice";
import { webSocketService } from "../socketService";

export const facilitiesTopicSubscription = (dispatch: any) => {
  // const currentUser: UserModel = JSON.parse(
  //   localStorage.getItem("dnap-user") as string
  // );

  webSocketService.subscribe("/topic/facilities", (message) => {
    const content = JSON.parse(JSON.stringify(message.content));

    if (message.activity === UserActivity.addFacilityExpense) {
      dispatch(addNewExpense(content));
    }
  });
};
