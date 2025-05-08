import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserStatusEnum } from "../../global/enums/userStatusEnum";
import Preloader from "../../other/Preloader";
import { UserModel } from "../users/models/userModel";
import { getUserById } from "../users/usersSlice";
import LoginForm from "./loginForm";

interface Props {}

const LoginPage: React.FC<Props> = () => {
  const [isPageLoading, setIspageLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<number | undefined>(0);

  const user = useSelector(getUserById(Number(userId)));

  // create some delay 3sec and check if the user is authenticated already
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIspageLoading(false);

      const currentUser = localStorage.getItem("dnap-user");

      if (currentUser) {
        const current_user: UserModel = JSON.parse(currentUser as string);
        setUserId(Number(current_user.userId));
      }

      if (user?.userStatus === UserStatusEnum.online) {
        window.location.href = "/dashboard";
      }
    }, 3000);
    return () => clearTimeout(timeOut);
  }, [user?.userStatus]);

  // render preloader screen if the page is still loading
  if (isPageLoading) {
    return <Preloader />;
  }

  return (
    <div
      className="m-0 p-0 w-svw h-svh"
      style={{
        backgroundImage: `URL('images/login-bg-2.jpg')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <LoginForm />
    </div>
  );
};

export default LoginPage;
