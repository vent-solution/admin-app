import axios from "axios";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../app/store";
import { postData } from "../../global/api";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { GenderEnum } from "../../global/enums/genderEnum";
import { UserRoleEnum } from "../../global/enums/userRoleEnum";
import checkRequiredFormFields from "../../global/validation/checkRequiredFormFields";
import isValidEmail from "../../global/validation/emailValidation";
import markRequiredFormField from "../../global/validation/markRequiredFormField";
import isValidTelephone from "../../global/validation/telephoneValidation";
import AlertMessage from "../../other/alertMessage";
import { setAlert } from "../../other/alertSlice";
import { UserModel } from "../users/models/userModel";

const SignUpForm = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [GenderValues] = useState([
    GenderEnum.male,
    GenderEnum.female,
    GenderEnum.others,
  ]);
  const [user, setUser] = useState<UserModel>({
    firstName: "",
    lastName: "",
    otherNames: "",
    gender: "",
    userRole: UserRoleEnum.admin,
    userTelephone: "",
    userEmail: "",
    userPassword: "",
    addedBy: null,
    linkedTo: null,
  });

  const dispatch = useDispatch<AppDispatch>();

  const isValidGenderValue =
    user.gender === GenderEnum.female ||
    user.gender === GenderEnum.male ||
    user.gender === GenderEnum.others;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });
    markRequiredFormField(e.target);
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const signUp = async () => {
    const firstName = document.getElementById("firstName") as HTMLInputElement;
    const lastName = document.getElementById("lastName") as HTMLInputElement;
    const email = document.getElementById("userEmail") as HTMLInputElement;
    const telephone = document.getElementById(
      "userTelephone"
    ) as HTMLInputElement;
    const gender = document.getElementById("gender") as HTMLInputElement;
    const password = document.getElementById(
      "userPassword"
    ) as HTMLInputElement;

    // check if all the required form fields are filled
    if (
      !user.firstName ||
      user.firstName.trim().length < 1 ||
      !user.lastName ||
      user.lastName.trim().length < 1 ||
      !user.userEmail ||
      user.userEmail.trim().length < 1 ||
      !user.userTelephone ||
      user.userTelephone.trim().length < 1 ||
      !user.gender ||
      user.gender.trim().length < 1 ||
      !user.userPassword ||
      user.userPassword.trim().length < 1
    ) {
      checkRequiredFormFields([
        firstName,
        lastName,
        email,
        telephone,
        gender,
        password,
      ]);

      dispatch(
        setAlert({
          message: "Please fill in all the required form fields marked by (*)",
          type: AlertTypeEnum.danger,
          status: true,
        })
      );

      return;
    }

    // check if the gender value is valid (male, female, others)
    if (!isValidGenderValue) {
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          message: "Invalid gender value.",
          status: true,
        })
      );
      return;
    }

    // check if the emamil is valid
    if (!isValidEmail(user.userEmail)) {
      const parent: HTMLElement | null = email.parentElement;

      if (parent) {
        const small = parent.querySelector("small");
        parent.classList.add("required");
        small?.classList.add("visible");
      }

      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          message: "Invalid email.",
          status: true,
        })
      );
      return;
    }

    // check if the telephone number is valid
    if (!isValidTelephone(user.userTelephone)) {
      const parent: HTMLElement | null = telephone.parentElement;

      if (parent) {
        const small = parent.querySelector("small");
        parent.classList.add("required");
        small?.classList.add("visible");
      }

      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          message: "Invalid telephone number.",
          status: true,
        })
      );
      return;
    }

    // submit sign-up form if all conditions are fullfilled
    try {
      setLoading(true);
      const result = await postData("/sign-up", user);

      if (!result || result.data.status === 404) {
        dispatch(
          setAlert({
            type: AlertTypeEnum.danger,
            message: "ERROR OCCURRED PLEASE TRY AGAIN",
            status: true,
          })
        );

        return;
      }

      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            type: AlertTypeEnum.danger,
            message: result.data.message,
            status: true,
          })
        );

        return;
      }

      localStorage.setItem("dnap-user", JSON.stringify(result.data));
      navigate("/settings");
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("REQUEST CANCELLED: ", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="login-for relative  flex flex-wrap justify-center items-start bg-blue-950 text-sm min-h-svh"
      action=""
      onSubmit={(e: React.FormEvent) => e.preventDefault()}
    >
      <div className=" text-white w-full lg:w-1/3 p-3 lg:p-5  flex flex-wrap justify-center items-center lg:h-svh lg:sticky top-0 lg:py-32">
        <div className="w-full flex justify-start items-end">
          <img
            className="w-14 lg:w-20 h-14 lg:h-20"
            src={`${process.env.REACT_APP_LOGO_IMAGE}/logo-no-background.png`}
            alt=""
          />
          <h1 className="text-3xl lg:text-5xl font-extrabold">ENT</h1>
        </div>
        <div className="text-gray-400 h-3/4 flex flex-wrap items-center justify-center w-full text-start py-20 text-xl lg:text-3xl">
          <div className="h-fit capitalize font-extralight">
            <p className="w-full">welcome to vent.</p>
            <p className="w-full">
              the World's number one real-estate solution.
            </p>
          </div>
        </div>
        <h1 className="text-xs w-full text-start">&copy; vent solutions</h1>
      </div>

      <div className="login-form-inner w-full lg:w-1/2 relative px-5 rounded-md  bg-blue-700 flex flex-wrap bg-opacity-10 shadow-sm pb-10">
        <div className="w-full p-5 flex justify-center lg:sticky -top-32 bg-inherit">
          <h1 className="text-white text-2xl border-b-2 border-b-white w-full">
            Create a vent account{" "}
            {user.userRole && <span>({user.userRole})</span>}
          </h1>
        </div>

        <>
          {/* First name input field */}
          <div className="form-group py-2 w-full lg:w-1/2 px-5">
            <label htmlFor="firstName" className="w-full text-white">
              First name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              autoComplete="off"
              autoFocus
              placeholder="First name*"
              className="w-full outline-none rounded-lg border-2 bg-gray-200 py-2"
              value={user.firstName || ""}
              onChange={(e) => {
                handleChange(e);
                markRequiredFormField(e.target);
              }}
            />
            <small className="w-full text-red-300">
              First name is required.
            </small>
          </div>

          {/* Last name input field */}
          <div className="form-group py-2 w-full lg:w-1/2 px-5">
            <label htmlFor="lastName" className="w-full text-white">
              Last name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              autoComplete="off"
              placeholder="Last name*"
              className="w-full outline-none rounded-lg bg-gray-200 py-2"
              value={user.lastName || ""}
              onChange={(e) => {
                handleChange(e);
                markRequiredFormField(e.target);
              }}
            />
            <small className="w-full text-red-300">
              Last name is required.
            </small>
          </div>

          {/* Other names form field */}
          <div className="form-group py-2 w-full px-5">
            <label htmlFor="otherNames" className="w-full text-white">
              Other names
            </label>
            <input
              type="text"
              id="otherNames"
              autoComplete="off"
              placeholder="Other names"
              className="w-full outline-none rounded-lg bg-gray-200 py-2"
              value={user.otherNames || ""}
              onChange={handleChange}
            />
          </div>

          {/* Email input field */}
          <div className="form-group py-2 w-full lg:w-1/2 px-5">
            <label htmlFor="userEmail" className="w-full text-white">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="userEmail"
              autoComplete="off"
              placeholder="Email* Eg. example@domain.com"
              className="w-full outline-none rounded-lg bg-gray-200 py-2"
              value={user.userEmail || ""}
              onChange={(e) => {
                handleChange(e);
                markRequiredFormField(e.target);
              }}
            />
            <small className="w-full text-red-300">Email is required.</small>
          </div>

          {/* Telephone input field */}
          <div className="form-group py-2 w-full lg:w-1/2 px-5">
            <label htmlFor="userTelephone" className="w-full text-white">
              Telephone <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              id="userTelephone"
              autoComplete="off"
              placeholder="Telephone* Eg. +23578348990"
              className="w-full outline-none rounded-lg bg-gray-200 py-2"
              value={user.userTelephone || ""}
              onChange={(e) => {
                handleChange(e);
                markRequiredFormField(e.target);
              }}
            />

            <small className="w-full text-red-300">
              Telephone number is required
            </small>
          </div>

          {/* Gender form field */}
          <div className="form-group py-2 w-full lg:w-1/2 px-5">
            <label htmlFor="gender" className="w-full text-white">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              id="gender"
              className="w-full outline-none rounded-lg bg-gray-200 py-3"
              onChange={(e) => {
                handleChange(e);
                markRequiredFormField(e.target);
              }}
            >
              <option value="">SELECT GENDER</option>
              {GenderValues.map((gender, index) => (
                <option key={index} value={gender} className="capitalize">
                  {gender}
                </option>
              ))}
            </select>
            <small className="w-full text-red-300">Gender is required.</small>
          </div>

          {/* Password input field */}
          <div className="relative form-group py-2 w-full lg:w-1/2 px-5 text-black">
            <label htmlFor="userPassword" className="w-full text-white">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="userPassword"
              autoComplete="off"
              placeholder="Password*"
              className="w-full outline-none rounded-lg bg-gray-200 py-2"
              value={user.userPassword || ""}
              onChange={(e) => {
                handleChange(e);
                markRequiredFormField(e.target);
              }}
            />
            <small className="w-full text-red-300">Password is required.</small>
            <div
              className="absolute right-0 top-9 lg:top-10 text-blue-800 lg:hover:text-blue-500 text-2xl lg:text-xl px-3 mr-3 cursor-pointer"
              onClick={handleTogglePassword}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>

          {/* action buttons */}
          <div className="form-group w-full flex flex-wrap justify-around py-5 text-gold pl-5">
            <button
              className="w-1/3 bg-blue-600 p-2 text-lg text-white hover:bg-blue-400 active:translate-x-2"
              onClick={signUp}
              disabled={loading}
            >
              {loading ? "Saving..." : "Sign up"}
            </button>
          </div>
        </>
        <p className="w-full pt-5 text-blue-100 px-5">
          Have an account already?{" "}
          <Link to="/" className="text-xl text-blue-500 lg:hover:text-blue-300">
            Log In
          </Link>
        </p>
      </div>
      <AlertMessage />
    </form>
  );
};

export default SignUpForm;
