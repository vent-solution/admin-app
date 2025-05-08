import React from "react";
import ResetPasswordForm from "./resetPasswordForm";

const ResetPasswordPage: React.FC = () => {
  return (
    <div
      className="m-0 p-o w-svw h-svh"
      style={{
        backgroundImage: `URL('images/login-bg-2.jpg')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordPage;
