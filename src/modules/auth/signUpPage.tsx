import React from "react";
import SignUpForm from "./signUpForm";

interface Props {}

const SignUpPage: React.FC<Props> = () => {
  return (
    <div
      className="w-full h-vh bg-red-600 relative"
      style={{
        backgroundImage: `URL('images/login-bg-2.jpg')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
