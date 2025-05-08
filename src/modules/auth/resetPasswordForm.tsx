import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

const ResetPasswordForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const hindeAndShowPassword = () => {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  };

  return (
    <form
      className="login-form w-full h-full p-2 lg:p-10  relative  flex flex-wrap justify-center items-center"
      action=""
      onSubmit={(e: React.FormEvent) => e.preventDefault()}
    >
      <div className="login-form-inner w-full  lg:w-1/4 relative p-5 lg:p-10 rounded-md ">
        <div className="w-full p-3 lg:p-10 bg-red-950 flex justify-center">
          <img
            src="images/logo-no-background.png"
            width={130}
            height={130}
            alt=""
          />
        </div>
        <div className="form-group py-2">
          <label htmlFor="email" className="w-full text-white">
            Email/Telephone*
          </label>
          <input
            type="text"
            id="email"
            autoFocus
            autoComplete="false"
            placeholder="Email or Telephone*"
            className="w-full outline-none rounded-lg"
          />
          <small className="w-full"></small>
        </div>
        <div className="form-group relative py-2">
          <label htmlFor="password" className="w-full text-white">
            Password*
          </label>
          <input
            type={`${showPassword ? "text" : "password"}`}
            id="password"
            autoComplete="false"
            placeholder="Password*"
            className="w-full outline-none rounded-lg"
          />
          <small className="w-full"></small>
          <div
            className="absolute right-0 top-1/2 text-blue-800 text-lg  px-2  mr-2 cursor-pointer"
            onClick={() => hindeAndShowPassword()}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </div>
        </div>
        <Link to="/" className="forgot-password pt-5 text-blue-300 text-lg">
          Login Instead?
        </Link>
        <div className="form-group flex flex-wrap justify-center py-10  text-gold">
          <button className="w-full bg-red-950 p-3 text-lg text-white hover:bg-red-800 active:translate-x-2">
            Reset Password
          </button>
          <p className="w-full pt-5 text-blue-300">
            Have no account?{" "}
            <Link to="/sign-up" className="text-xl text-blue-500">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
