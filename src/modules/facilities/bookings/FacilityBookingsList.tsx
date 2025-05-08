import React, { useCallback, useEffect, useState } from "react";
import { FacilitiesModel } from "../FacilityModel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import {
  fetchFacilityBookings,
  getFacilityBookings,
  resetFacilityBookings,
} from "./bookingsSlice";
import FacilityBookingRow from "./FacilityBookingRow";
import { BookingModel } from "./BookingModel";
import { FaSearch } from "react-icons/fa";
import PaginationButtons from "../../../global/PaginationButtons";
import axios from "axios";
import { fetchData } from "../../../global/api";
import Preloader from "../../../other/Preloader";

interface Props {
  facility: FacilitiesModel;
}

let FacilityBookingsList: React.FC<Props> = ({ facility }) => {
  const [filteredBookings, setFilteredBookings] = useState<BookingModel[]>([]);
  const [searchString, setSearchString] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

  const facilityBookingsState = useSelector(getFacilityBookings);
  const {
    facilityBookings,
    page,
    size,
    totalElements,
    totalPages,
    status,
    error,
  } = facilityBookingsState;

  // fetch facility bookings
  useEffect(() => {
    dispatch(
      fetchFacilityBookings({
        facilityId: Number(facility.facilityId),
        page: 0,
        size: 18,
      })
    );
  }, [facility.facilityId, dispatch]);

  // filter facility bookings
  useEffect(() => {
    const originalBookings: BookingModel[] = facilityBookings;
    if (searchString.trim().length < 1) {
      setFilteredBookings(originalBookings);
    } else {
      setFilteredBookings(
        originalBookings.filter((booking) => {
          const tenantNumber: string = "TNT" + booking.tenant.tenantId;
          const date = new Date(String(booking.dateCreated)).getDate();
          const month = new Date(String(booking.dateCreated)).getMonth() + 1;
          const year = new Date(String(booking.dateCreated)).getFullYear();

          const bookingDate = date + "/" + month + "/" + year;

          const { amount, paymentType, tenant, checkIn } = booking;

          return (
            tenantNumber.toLocaleLowerCase().trim().includes(searchString) ||
            bookingDate.toLocaleLowerCase().trim().includes(searchString) ||
            (tenant.user.firstName &&
              tenant.user.firstName
                .toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (tenant.user.lastName &&
              tenant.user.lastName
                .toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (tenant.user.userEmail &&
              tenant.user.userEmail
                .toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (tenant.companyName &&
              tenant.companyName
                .toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (checkIn &&
              checkIn.toLocaleLowerCase().trim().includes(searchString)) ||
            (paymentType &&
              paymentType.toLocaleLowerCase().trim().includes(searchString)) ||
            (booking.accommodation?.accommodationType &&
              booking.accommodation?.accommodationType
                .toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            Number(amount) === Number(searchString)
          );
        })
      );
    }
  }, [facilityBookings, searchString]);

  // handle search for booking
  const handleSearchBooking = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    []
  );

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-bookings-by-facility/${Number(facility.facilityId)}/${
          page + 1
        }/${size}`
      );
      dispatch(resetFacilityBookings(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching bids: ", error);
    }
  }, [dispatch, page, size, facility.facilityId]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-bookings-by-facility/${Number(facility.facilityId)}/${
          page - 1
        }/${size}`
      );
      console.log(result);
      dispatch(resetFacilityBookings(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching bids: ", error);
    }
  }, [dispatch, page, size, facility.facilityId]);

  if (status === "loading") return <Preloader />;
  if (error !== null) return <h1>{error}</h1>;

  return (
    <div className="users-list flex w-full py-2 mt-0 lg:mt-0 z-0">
      <div className="list w-full relative h-[calc(100vh-100px)]">
        <div className="bg-white w-full">
          <div className="w-full h-1/3 flex flex-wrap justify-end items-center px-10 py-3">
            <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center font-bold">
                <h1 className="text-lg">
                  {facilityBookings.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-950 border-2 w-full lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-subscription"
                  placeholder="Search for booking..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSearchBooking}
                />

                <button className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:px-5 mb-12 overflow-auto pb-5 h-[calc(100vh-250px)]">
          {filteredBookings.length > 0 ? (
            <table className="border-2 w-full bg-white shadow-lg text-center">
              <thead className="sticky top-0 bg-blue-900 text-base text-white">
                <tr>
                  <th className="px-2">No.</th>
                  <th className="px-2">Accommodation</th>
                  <th className="px-2">Tenant</th>
                  <th className="px-2">Name</th>
                  <th className="px-2">Tel</th>
                  <th className="px-2">Email</th>
                  <th className="px-2">Amount</th>
                  <th className="px-2">Payment type</th>
                  <th className="px-2">Checkin</th>
                  <th className="px-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {facilityBookings.map((booking, index) => (
                  <FacilityBookingRow key={index} booking={booking} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="w-ull h-full flex justify-center items-center">
              <div
                className="w-80 h-80"
                style={{
                  background: "URL('/images/Ghost.gif')",
                  backgroundSize: "cover",
                }}
              ></div>
            </div>
          )}
        </div>
        <PaginationButtons
          page={page}
          totalPages={totalPages}
          handleFetchNextPage={handleFetchNextPage}
          handleFetchPreviousPage={handleFetchPreviousPage}
        />
      </div>
    </div>
  );
};

FacilityBookingsList = React.memo(FacilityBookingsList);

export default FacilityBookingsList;
