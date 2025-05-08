import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AppDispatch } from "../../app/store";
import { postData, putData } from "../../global/api";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { GenderEnum } from "../../global/enums/genderEnum";
import { UserRoleEnum } from "../../global/enums/userRoleEnum";
import isValidEmail from "../../global/validation/emailValidation";
import markRequiredFormField from "../../global/validation/markRequiredFormField";
import isValidTelephone from "../../global/validation/telephoneValidation";
import AlertMessage from "../../other/alertMessage";
import { setAlert } from "../../other/alertSlice";
import {
  getAdminUsersById,
  addAdmin,
  updateAdmin,
} from "../admins/AdminStaffSlice";
import { UserModel } from "./models/userModel";
import { getUsersStatus, setUsersStatus } from "./usersSlice";

// function props
interface Props {
  showUserForm: boolean;
  setShowUserForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddUserForm: React.FC<Props> = ({ showUserForm, setShowUserForm }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // LOCAL STATE VARIABLES
  const [user, setUser] = useState<UserModel>({
    firstName: "",
    lastName: "",
    otherNames: "",
    gender: "",
    userRole: UserRoleEnum.user,
    userTelephone: "",
    userEmail: "",
    userPassword: "",
    addedBy: null,
    linkedTo: null,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [GenderValues] = useState([
    GenderEnum.male,
    GenderEnum.female,
    GenderEnum.others,
  ]);

  const dispatch = useDispatch<AppDispatch>();
  const selectedUser = useSelector(getAdminUsersById(Number(userId)));
  const usersStatus = useSelector(getUsersStatus);

  const firstNameRef = useRef<HTMLInputElement>(null);

  // VALIDATE GENDER VALUES
  const isValidGender =
    user.gender === GenderEnum.male ||
    user.gender === GenderEnum.female ||
    user.gender === GenderEnum.others;

  // CHECK IF REQUIRED FIELDS ARE PROVIDED TO AUTHORIZE SAVING NEW USER
  const canSave =
    Boolean(user.firstName) &&
    Boolean(user.lastName) &&
    Boolean(user.gender) &&
    Boolean(user.userRole) &&
    Boolean(user.userTelephone) &&
    Boolean(user.userPassword) &&
    Boolean(user.userEmail);

  // Update form when editing a user
  useEffect(() => {
    if (userId && selectedUser) {
      setUser((previousUser) => ({
        ...previousUser,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        otherNames: selectedUser.otherNames,
        gender: selectedUser.gender,
        userTelephone: selectedUser.userTelephone,
        userEmail: selectedUser.userEmail,
      }));
    } else {
      setUser({
        firstName: "",
        lastName: "",
        otherNames: "",
        gender: "",
        userRole: UserRoleEnum.user,
        userTelephone: "",
        userEmail: "",
        userPassword: "",
        addedBy: null,
        linkedTo: null,
      });
    }
  }, [userId, selectedUser]);

  // handle change of form field values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });

    const parent = e.target.parentElement;
    const label = parent?.querySelector("label");
    const span = label?.querySelector("span");

    if (value.trim().length < 1) {
      markRequiredFormField(e.target);
      label?.classList.remove("text-white");
      label?.classList.add("text-slate-700");
      span?.classList.remove("text-red-600");
      span?.classList.add("text-slate-700");
    } else {
      label?.classList.add("text-white");
      label?.classList.remove("text-slate-700");
      span?.classList.add("text-red-600");
      span?.classList.remove("text-slate-700");
    }
  };

  // CLEAR USER FORM
  const clearUserForm = () => {
    // clear form fields
    setUser({
      firstName: "",
      lastName: "",
      otherNames: "",
      gender: "",
      userRole: UserRoleEnum.user,
      userTelephone: "",
      userEmail: "",
      userPassword: "",
      addedBy: null,
      linkedTo: null,
    });
  };

  // handle save user button
  const onSaveUserClicked = async () => {
    // check for any empty required form field
    if (!canSave) {
      dispatch(
        setAlert({
          message: "Please fill in all the required fields marked by (*)",
          type: AlertTypeEnum.danger,
          status: true,
        })
      );
      return;
    }

    // validate telephone number
    if (!isValidTelephone(user.userTelephone)) {
      dispatch(
        setAlert({
          message: "Invalid phone number",
          type: AlertTypeEnum.danger,
          status: true,
        })
      );
      return;
    }

    // validate email
    if (!isValidEmail(user.userEmail)) {
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          message: "Invalid email.",
          status: true,
        })
      );
      return;
    }

    // validate gender
    if (!isValidGender) {
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          message: "Invalid gender.",
          status: true,
        })
      );
      return;
    }

    // save the user
    try {
      dispatch(setUsersStatus("loading"));

      const result = await postData("/saveUser", user);

      // check if the user was not saved successfully and set an error alert
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

      // set a success alert if the user was saved successfully
      dispatch(
        setAlert({
          message: "User saved successfully.",
          type: AlertTypeEnum.success,
          status: true,
        })
      );

      // clear form fields after successfully saving the user
      // clearUserForm();

      // add the saved user to the list if user was saved successfully
      dispatch(addAdmin(result.data));
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("REQUEST CANCELLED: ", error.message);
      }
      dispatch(setUsersStatus("error"));
    } finally {
      dispatch(setUsersStatus("succeeded"));

      // check the cursor focus to go back to the firstName field
      firstNameRef.current?.focus();
    }
  };

  // updating user
  const onUpdateUserClicked = async () => {
    try {
      const result = await putData(`editUser/${userId}`, user);
      console.log(result.data);
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
            message: "User info has been updated successfully.",
            type: AlertTypeEnum.success,
            status: true,
          })
        );

        if (location.pathname.includes("staff")) {
          navigate("/staffs");
        } else {
          navigate("/users");
        }
        setShowUserForm(false);
        dispatch(updateAdmin({ id: userId, changes: result.data }));
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("REQUEST CANCELLED ", error.message);
      }
    }
  };

  // hide and show password
  const handleTogglePassword = () => setShowPassword(!showPassword);

  // set the cursor focus to the firstName field on form rendering
  useEffect(() => firstNameRef.current?.focus(), [showUserForm]);

  return (
    <form
      action=""
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
      className="w-full absolute h-full bg-slate-700 p-10 bottom-0 overflow-auto z-10"
    >
      <h1 className="text-3xl w-full text-center mb-3">
        {!userId ? "Add new user" : "Edit user"}
      </h1>

      {/* FIRST NAME FORM FIELD */}
      <div className="py-2 lg:py-3">
        <label
          htmlFor="firstName"
          className={`w-full transition ease-in-out text-slate-700
          `}
        >
          First Name
          <span className={"text-slate-700"}>*</span>
        </label>
        <input
          autoFocus
          type="text"
          id="firstName"
          value={user.firstName}
          onChange={handleChange}
          autoComplete="true"
          ref={firstNameRef}
          placeholder="First name*"
          className="w-full p-1 px-3 rounded-md outline-none text-gray-300  bg-slate-700 border-b-2 focus:border-blue-400"
        />
        <small className="text-red-100 hidden">First name is required.</small>
      </div>

      {/* LAST NAME FORM FIELD */}
      <div className="py-2 lg:py-3">
        <label
          htmlFor="lastName"
          className={`w-full transition ease-in-out text-slate-700`}
        >
          Last Name
          <span className={"text-slate-700"}>*</span>
        </label>
        <input
          type="text"
          id="lastName"
          value={user.lastName}
          onChange={handleChange}
          autoComplete="true"
          placeholder="Last name*"
          className="w-full p-1 px-3 rounded-md outline-none text-gray-300  bg-slate-700 border-b-2 focus:border-blue-400"
        />
        <small className="text-red-100 hidden">Last name is required</small>
      </div>

      {/* other names form field */}
      <div className="py-2 lg:py-3">
        <label
          htmlFor="otherNames"
          className={`w-full transition ease-in-out text-slate-700`}
        >
          Other names
          <span className={"text-slate-700"}></span>
        </label>
        <input
          type="text"
          id="otherNames"
          value={user.otherNames}
          onChange={handleChange}
          autoComplete="true"
          placeholder="Other names"
          className="w-full p-1 px-3 rounded-md outline-none text-gray-300  bg-slate-700 border-b-2 focus:border-blue-400"
        />
        <small className="text-red-100 hidden"></small>
      </div>

      {/* gender form field */}
      <div className="py-2 lg:py-3">
        <label
          htmlFor="gender"
          className={`w-full transition ease-in-out text-slate-700`}
        >
          Gender
          <span className={"text-slate-700"}>*</span>
        </label>
        <input
          type="text"
          id="gender"
          name="gender"
          list="genderList"
          value={user.gender}
          placeholder="Gender*"
          onChange={handleChange}
          className="w-full p-1 px-3 rounded-md outline-none text-gray-300  bg-slate-700 border-b-2 focus:border-blue-400"
        />
        <datalist id="genderList" className="w-full">
          {GenderValues.map((gender, index) => (
            <option key={index} value={gender} />
          ))}
        </datalist>
        <small className="text-red-100 hidden">Gender is required</small>
      </div>

      {/* TELEPHONE FORM FIELD */}
      <div className="py-2 lg:py-3">
        <label
          htmlFor="userTelephone"
          className={`w-full transition ease-in-out text-slate-700`}
        >
          Telephone
          <span className={"text-slate-700"}>*</span>
        </label>
        <input
          type="tel"
          id="userTelephone"
          value={user.userTelephone}
          onChange={handleChange}
          placeholder="Telephone*"
          autoComplete="true"
          className="w-full p-1 px-3 rounded-md outline-none text-gray-300  bg-slate-700 border-b-2 focus:border-blue-400"
        />
        <small className="text-red-100 hidden">Telephone is required.</small>
      </div>

      {/* EMAIL FORM FIELD */}
      <div className="py-2 lg:py-3">
        <label
          htmlFor="userEmail"
          className={`w-full transition ease-in-out text-slate-700`}
        >
          Email
          <span className={"text-slate-700"}>*</span>
        </label>
        <input
          type="text"
          id="userEmail"
          value={user.userEmail}
          onChange={handleChange}
          placeholder="Email*"
          autoComplete="true"
          className="w-full p-1 px-3 rounded-md outline-none text-gray-300  bg-slate-700 border-b-2 focus:border-blue-400"
        />
        <small className="text-red-100 hidden">Email is required.</small>
      </div>

      {/* PASSWORD FORM FIELD */}
      <div className="py-2 lg:py-5 relative">
        <label
          htmlFor="userPassword"
          className={`w-full transition ease-in-out text-slate-700`}
        >
          Password
          <span className={"text-slate-700"}>*</span>
        </label>
        <input
          type={`${!showPassword ? "password" : "text"}`}
          id="userPassword"
          value={user.userPassword}
          onChange={handleChange}
          placeholder="Password*"
          autoComplete="true"
          className="w-full p-1 px-3 rounded-md outline-none text-gray-300  bg-slate-700 border-b-2 focus:border-blue-400"
        />
        <small className="text-red-100 hidden">Password is required.</small>
        <div
          title={`${showPassword ? "Hide password" : "Show password"}`}
          className="absolute right-0 top-1/2 w-fit text-xl cursor-pointer p-1 hover:bg-gray-500 "
          onClick={handleTogglePassword}
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </div>
      </div>

      {/* FORM ACTION BUTTONS  */}
      <div className="flex justify-around py-10">
        {!userId ? (
          <button
            className={`bg-blue-700 hover:bg-blue-500 cursor-pointer p-5 py-2 w-1/3 text-lg  active:scale-100`}
            onClick={onSaveUserClicked}
          >
            {usersStatus === "loading" ? "Wait..." : "Add"}
          </button>
        ) : (
          <button
            className={`bg-blue-700 hover:bg-blue-500 cursor-pointer p-5 py-2 w-1/3 text-lg  active:scale-100`}
            onClick={onUpdateUserClicked}
          >
            {usersStatus === "loading" ? "Wait..." : "Update"}
          </button>
        )}

        {/* CANCEL BUTTON */}
        <button
          className="bg-gray-900 p-5 py-2 w-1/3 text-lg hover:bg-gray-800"
          onClick={() => {
            setShowUserForm(false);
            clearUserForm();
          }}
        >
          Cancel
        </button>
      </div>
      <AlertMessage />
    </form>
  );
};

export default React.memo(AddUserForm);
