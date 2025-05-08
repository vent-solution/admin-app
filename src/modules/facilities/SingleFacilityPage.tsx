import React, { useEffect, useState } from "react";
import { MdDashboard, MdPayment } from "react-icons/md";
import { FaReceipt, FaUsers } from "react-icons/fa6";
import { ImOffice } from "react-icons/im";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { RxActivityLog } from "react-icons/rx";
import { IoDiamondSharp } from "react-icons/io5";
import SideBar from "../../sidebar/sideBar";
import { NavLinkModel } from "../users/models/navLinkModel";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import Preloader from "../../other/Preloader";
import { getNumberOfUsers } from "../users/usersSlice";
import { PiBuildingsFill } from "react-icons/pi";

import Details from "./Details";
import { FacilitiesModel } from "./FacilityModel";
import { findFacilityById } from "./FacilitiesSlice";
import Rent from "./Rent";
import Accommodations from "./Accommodations";
import Tenants from "./Tenants";
import Spaces from "./spaces/Spaces";
import Bids from "./Bids";
import ServiceFees from "./ServiceFees";
import Staff from "./Staff";
import Bookings from "./Bookings";
import Histories from "./History";
import Visits from "./Visits";
import Statistics from "./Statistics";
import { fetchSpaces, getSpaces } from "./spaces/SpacesSlice";
import { AppDispatch } from "../../app/store";
import { fetchFacilityBids } from "./bids/FacilityBidsSlice";
import { fetchAccommodationsByFacility } from "./accommodations/accommodationsSlice";
import { businessType } from "../../global/enums/businessTypeEnum";
import { fetchFacilityTenants } from "./tenants/TenantsSlice";
import { fetchFacilityServiceFees } from "./serviceFees/FacilityServiceFeesSlice";
import { fetchFacilityExpenses } from "./expenses/expenseSlice";
import Expenses from "./expenses/Expenses";
import { GiExpense } from "react-icons/gi";

const SingleFacilityPage: React.FC = () => {
  const numberOfUsers = useSelector(getNumberOfUsers);
  const spacesState = useSelector(getSpaces);
  const { spaces } = spacesState;

  // LOCAL STATES
  const [navLinks] = useState<NavLinkModel[]>([
    {
      icon: <MdDashboard />,
      name: "Dashboard",
      link: "/dashboard",
      active: false,
    },
    {
      icon: <FaUsers />,
      name: `Users ${numberOfUsers}`,
      link: "/users",
      active: false,
    },

    {
      icon: <IoDiamondSharp />,
      name: "Landlords",
      link: "/landlords",
      active: false,
    },
    {
      icon: <IoDiamondSharp />,
      name: "Our staff",
      link: "/staffs",
      active: false,
    },

    {
      icon: <PiBuildingsFill />,
      name: "Facilties",
      link: "/facilies",
      active: true,
    },

    {
      icon: <ImOffice />,
      name: "Our offices",
      link: "/offices",
      active: false,
    },
    {
      icon: <FaScrewdriverWrench />,
      name: "Settings",
      link: "/settings",
      active: false,
    },
    {
      icon: <MdPayment />,
      name: "Subscription fees",
      link: "/subscription",
      active: false,
    },
    {
      icon: <IoDiamondSharp />,
      name: "Broker fees",
      link: "/brokerFees",
      active: false,
    },
    {
      icon: <IoDiamondSharp />,
      name: "Bids",
      link: "/bids",
      active: false,
    },
    {
      icon: <FaReceipt />,
      name: "Receipts",
      link: "/receipts",
      active: false,
    },
    {
      icon: <RxActivityLog />,
      name: "Activity Logs",
      link: "/logs",
      active: false,
    },
  ]);

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const { facilityId } = useParams<{ facilityId: string }>();

  const facility = useSelector(findFacilityById(Number(facilityId)));

  // fetch facility spaces
  useEffect(() => {
    dispatch(
      fetchSpaces({
        facilityId: Number(facilityId),
        page: 0,
        size: 100,
      })
    );
  }, [dispatch, facilityId]);

  // fetch facility bids
  useEffect(() => {
    dispatch(
      fetchFacilityBids({
        facilityId: Number(facilityId),
        page: 0,
        size: 100,
      })
    );
  }, [dispatch, facilityId]);

  // fetch accommodations by facility
  useEffect(() => {
    dispatch(
      fetchAccommodationsByFacility({
        facilityId: Number(facilityId),
        page: 0,
        size: 100,
      })
    );
  }, [dispatch, facilityId]);

  // fetch tenants by facility
  useEffect(() => {
    dispatch(
      fetchFacilityTenants({
        facilityId: Number(facilityId),
        page: 0,
        size: 100,
      })
    );
  }, [dispatch, facilityId]);

  // fetch facility service fees
  useEffect(() => {
    dispatch(
      fetchFacilityServiceFees({
        facilityId: Number(facilityId),
        page: 0,
        size: 100,
      })
    );
  }, [dispatch, facilityId]);

  // fetch facility expenses
  useEffect(() => {
    dispatch(
      fetchFacilityExpenses({
        facilityId: Number(facilityId),
        page: 0,
        size: 25,
      })
    );
  }, [dispatch, facilityId]);

  // redirect page if user is not authenticated
  useEffect(() => {
    const currentUser = localStorage.getItem("dnap-user");
    if (!currentUser) {
      window.location.href = "/";
    }
  }, []);

  const [currentSection, setCurrentSection] = useState<string>("Details");

  // render section depending on the current active link
  const renderSection = (facility: FacilitiesModel) => {
    switch (currentSection) {
      case "Details":
        return <Details facility={facility} />;
      case "Rent":
        return <Rent facility={facility} />;
      case "Accommodations":
        return <Accommodations facility={facility} />;
      case "Tenants":
        return <Tenants facility={facility} />;
      case "Spaces":
        return <Spaces facility={facility} />;
      case "Bids":
        return <Bids facility={facility} />;
      case "ServiceFees":
        return <ServiceFees facility={facility} />;
      case "Staff":
        return <Staff facility={facility} />;
      case "Bookings":
        return <Bookings facility={facility} />;
      case "Histories":
        return <Histories facility={facility} />;
      case "Expenses":
        return <Expenses facilityId={facility.facilityId} />;
      case "Visits":
        return <Visits facility={facility} />;
      case "Statistics":
        return <Statistics facility={facility} />;
      default:
        return <Details facility={facility} />;
    }
  };

  // function for selecting facility section
  const selectSection = (li: HTMLLIElement) => {
    const { id } = li;
    const ul = li.parentElement;

    if (ul) {
      const lis = ul.querySelectorAll("li");
      lis.forEach((l) => {
        l !== li ? l.classList.remove("active") : l.classList.add("active");
      });
    }

    setCurrentSection(id);
  };

  if (!facility) {
    return <Preloader />; // or a loading spinner
  }

  return (
    <div className="main max-h-screen lg:overflow-hidden flex relative w-full">
      <div className="left lg:w-1/5 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar navLinks={navLinks} />
      </div>
      <div className="right lg:w-4/5 w-full z-0 mt-20 lg:mt-0 px-2 lg:px-0">
        <div className="w-full flex py-0 flex-wrap justify-center items-start bg-white shadow-lg">
          <div className="w-full lg:w-full py-2 lg:pb-0 flex justify-between lg:px-10 ">
            <button
              className="bg-blue-900 hover:bg-blue-800 text-sm text-white lg:flex items-center p-1 px-3 hidden "
              onClick={() => navigate(-1)}
            >
              <IoMdArrowRoundBack />
              Back
            </button>

            {facility.facilityName && (
              <h2 className="text-xl font-bold">
                {"FAC-" + facility.facilityId + ", " + facility.facilityName}
              </h2>
            )}
          </div>
          <ul className="w-full flex flex-wrap justify-end items-center text-xs lg:text-sm text-blue-900 uppercase p-0 pt-2">
            <li
              id="Details"
              className="active p-2 lg:px-5 lg:py-3 mt-2 font-bold border-b-2 hover:border-b-2 hover:border-red-600 cursor-pointer"
              onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                selectSection(e.currentTarget)
              }
            >
              Details
            </li>

            <li
              id="Accommodations"
              className="p-2 lg:px-5 lg:py-3 mt-2 font-bold border-b-2 hover:border-b-2 hover:border-red-600 cursor-pointer"
              onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                selectSection(e.currentTarget)
              }
            >
              Units
            </li>

            {facility.businessType !== businessType.sale && (
              <li
                id="Rent"
                className="p-2 lg:px-5 lg:py-3 mt-2 font-bold border-b-2 hover:border-b-2 hover:border-red-600 cursor-pointer"
                onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                  selectSection(e.currentTarget)
                }
              >
                Payments
              </li>
            )}

            {facility.businessType !== businessType.sale && (
              <li
                id="Tenants"
                className="p-2 lg:px-5 lg:py-3 mt-2 font-bold border-b-2 hover:border-b-2 hover:border-red-600 cursor-pointer"
                onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                  selectSection(e.currentTarget)
                }
              >
                Tenants
              </li>
            )}

            {spaces.length > 0 && (
              <li
                id="Spaces"
                className="p-2 lg:px-5 lg:py-3 mt-2 font-bold border-b-2 hover:border-b-2 hover:border-red-600 cursor-pointer"
                onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                  selectSection(e.currentTarget)
                }
              >
                Spaces
              </li>
            )}

            <li
              id="Bids"
              className="p-2 lg:px-5 lg:py-3 mt-2 font-bold border-b-2 hover:border-b-2 hover:border-red-600 cursor-pointer"
              onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                selectSection(e.currentTarget)
              }
            >
              Bids
            </li>

            <li
              id="ServiceFees"
              className="p-2 lg:px-5 lg:py-3 mt-2 font-bold border-b-2 hover:border-b-2 hover:border-red-600 cursor-pointer"
              onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                selectSection(e.currentTarget)
              }
            >
              Service Fees
            </li>

            {facility.businessType !== businessType.sale && (
              <li
                id="Staff"
                className="p-2 lg:px-5 lg:py-3 mt-2 font-bold border-b-2 hover:border-b-2 hover:border-red-600 cursor-pointer"
                onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                  selectSection(e.currentTarget)
                }
              >
                Staff
              </li>
            )}

            {facility.businessType !== businessType.sale &&
              facility.businessType !== businessType.rentWhole && (
                <li
                  id="Bookings"
                  className="p-2 lg:px-5 lg:py-3 mt-2 font-bold border-b-2 hover:border-b-2 hover:border-red-600 cursor-pointer"
                  onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                    selectSection(e.currentTarget)
                  }
                >
                  Bookings
                </li>
              )}

            <li
              id="Histories"
              className="p-2 lg:px-5 lg:py-3 mt-2 font-bold border-b-2 hover:border-b-2 hover:border-red-600 cursor-pointer"
              onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                selectSection(e.currentTarget)
              }
            >
              History
            </li>

            <li
              id="Expenses"
              className="p-2 lg:px-5 lg:py-3 mt-2 font-bold border-b-2 hover:border-b-2 hover:border-red-600 cursor-pointer flex flex-wrap justify-center items-center"
              onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                selectSection(e.currentTarget)
              }
            >
              <GiExpense className="text-xl" />
              <span className="w-full text-center">Expenses</span>
            </li>

            {/* <li
              id="Visits"
              className="p-2 lg:px-5 lg:py-3 mt-2 font-bold border-b-2 hover:border-b-2 hover:border-red-600 cursor-pointer"
              onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                selectSection(e.currentTarget)
              }
            >
              Visits
            </li> */}

            {facility.businessType !== businessType.sale && (
              <li
                id="Statistics"
                className="p-2 lg:px-5 lg:py-3 mt-2 font-bold border-b-2 hover:border-b-2 hover:border-red-600 cursor-pointer"
                onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                  selectSection(e.currentTarget)
                }
              >
                Statistics
              </li>
            )}
          </ul>
        </div>
        {renderSection(facility)}
      </div>
    </div>
  );
};

export default SingleFacilityPage;
