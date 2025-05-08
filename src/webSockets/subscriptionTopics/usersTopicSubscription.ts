import { UserActivity } from "../../global/enums/userActivity";
import { UserRoleEnum } from "../../global/enums/userRoleEnum";
import { UserStatusEnum } from "../../global/enums/userStatusEnum";
import { updateLandlordStatus } from "../../modules/landlords/landlordSlice";
import { addUser, updateStatus } from "../../modules/users/usersSlice";
import { webSocketService } from "../socketService";

export const usersTopicSubscription = (dispatch: any) => {
  webSocketService.subscribe("/topic/users", (message) => {
    const content = JSON.parse(JSON.stringify(message.content));

    // check if the user activity is sign-up

    if (message.activity === UserActivity.signUp) {
      dispatch(addUser(content));
    }

    // check if user activity is login
    if (message.activity === UserActivity.login) {
      dispatch(
        updateStatus({
          userId: Number(message.userId),
          userStatus: UserStatusEnum.online,
        })
      );

      if (message.userRole === UserRoleEnum.landlord) {
        dispatch(
          updateLandlordStatus({
            userId: Number(message.userId),
            userStatus: UserStatusEnum.online,
          })
        );
      }

      return;
    }

    // check if user activity is logout
    if (message.activity === UserActivity.logout) {
      dispatch(
        updateStatus({
          userId: Number(message.userId),
          userStatus: UserStatusEnum.offline,
        })
      );

      if (message.userRole === UserRoleEnum.landlord) {
        dispatch(
          updateLandlordStatus({
            userId: Number(message.userId),
            userStatus: UserStatusEnum.offline,
          })
        );
      }

      return;
    }

    // check if user activity is block user
    if (message.activity === UserActivity.blockUser) {
      dispatch(
        updateStatus({
          userId: Number(content.userId),
          userStatus: UserStatusEnum.blocked,
        })
      );

      if (message.userRole === UserRoleEnum.landlord) {
        dispatch(
          updateLandlordStatus({
            userId: Number(content.userId),
            userStatus: UserStatusEnum.blocked,
          })
        );
      }

      return;
    }
  });
};
