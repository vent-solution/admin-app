import React, { useCallback, useEffect, useState } from "react";
import { TenantModel } from "../../tenants/TenantModel";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { getAccommodationByTenant } from "../accommodations/accommodationsSlice";
import { FaSearch } from "react-icons/fa";
import { FormatMoney } from "../../../global/actions/formatMoney";
import PaginationButtons from "../../../global/PaginationButtons";
import { getCurrencyExchange } from "../../../other/apis/CurrencyExchangeSlice";
import { AppDispatch } from "../../../app/store";
import {
  fetchRentByTenantAndAccommodation,
  getTenantRent,
  resetTenantRent,
} from "./TenantRentSlice";
import { RentModel } from "../rent/RentModel";
import axios from "axios";
import { fetchData } from "../../../global/api";
import Preloader from "../../../other/Preloader";
import TenantRentRow from "./TenantRentRow";

interface Props {
  tenant?: TenantModel;
  toggleShowTenantDetails: () => void;
}

const TenantDetails: React.FC<Props> = ({
  tenant,
  toggleShowTenantDetails,
}) => {
  const [currencyNames, setCurrencyNames] = useState<string[]>([]);
  const [desiredCurrency, setDesiredCurrency] = useState<string>("");
  const [convertedPrice, setConvertedPrice] = useState<number>(0);
  const [filteredAccommodationRent, setFilteredAccommodationRent] = useState<
    RentModel[]
  >([]);

  const [searchString, setSearchString] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const tenantAccommodation = useSelector(
    getAccommodationByTenant(Number(tenant && tenant.tenantId))
  );

  const currencyState = useSelector(getCurrencyExchange);

  const tenantRentState = useSelector(getTenantRent);
  const { tenantRent, totalElements, totalPages, page, size, status } =
    tenantRentState;

  // set a list of currency names
  useEffect(() => {
    const currencyName = Object.keys(currencyState);
    setCurrencyNames(currencyName);
  }, [currencyState]);

  // set the converted money
  useEffect(() => {
    const fac = String(tenantAccommodation?.facility.preferedCurrency);
    setConvertedPrice(
      (Number(currencyState[desiredCurrency]) / Number(currencyState[fac])) *
        Number(tenantAccommodation?.price)
    );
  }, [
    currencyState,
    desiredCurrency,
    tenantAccommodation?.facility.preferedCurrency,
    tenantAccommodation?.price,
  ]);

  // fetch tenant rent for the current accommodation

  useEffect(() => {
    dispatch(
      fetchRentByTenantAndAccommodation({
        tenantId: Number(tenant && tenant.tenantId),
        accommodationId: Number(tenantAccommodation?.accommodationId),
        page: 0,
        size: 100,
      })
    );
  }, [dispatch, tenantAccommodation?.accommodationId, tenant]);

  // filter tenant rent records
  useEffect(() => {
    const originalAccommodationRent =
      tenantRent.length > 0
        ? [...tenantRent].sort((a, b) => {
            const aRentId = a.rentId ? parseInt(String(a.rentId), 10) : 0;
            const bRentId = b.rentId ? parseInt(String(b.rentId), 10) : 0;
            return bRentId - aRentId;
          })
        : [];
    if (searchString.trim().length === 0) {
      setFilteredAccommodationRent(originalAccommodationRent);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredAccommodationRent(
        originalAccommodationRent.filter((rent) => {
          const {
            amount,
            tenant: {
              tenantId,
              user: { firstName, lastName },
            },
            paymentType,
            dateCreated,
          } = rent;

          const tenantNumber = "TNT-" + tenantId;

          const rentYear = new Date(`${dateCreated}`).getFullYear();
          const rentMonth = new Date(`${dateCreated}`).getMonth() + 1;
          const rentDay = new Date(`${dateCreated}`).getDate();
          const rentDate = rentDay + "/" + rentMonth + "/" + rentYear;
          return (
            (rentDate && rentDate.toLowerCase().includes(searchTerm)) ||
            (firstName && firstName.toLowerCase().includes(searchTerm)) ||
            (lastName && lastName.toLowerCase().includes(searchTerm)) ||
            (tenantNumber && tenantNumber.toLowerCase().includes(searchTerm)) ||
            (paymentType && paymentType.toLowerCase().includes(searchTerm)) ||
            (amount && Number(amount) === Number(searchTerm))
          );
        })
      );
    }
  }, [searchString, tenantRent]);

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-rent-by-tenant-and-accommodation/${Number(
          tenant && tenant.tenantId
        )}/${tenantAccommodation?.accommodationId}/${page + 1}/${size}`
      );
      dispatch(resetTenantRent(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH RENT CANCELLED ", error.message);
      }
      console.error("Error fetching rent: ", error);
    }
  }, [dispatch, page, size, tenantAccommodation?.accommodationId, tenant]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-rent-by-tenant-and-accommodation/${Number(
          tenant && tenant.tenantId
        )}/${tenantAccommodation?.accommodationId}/${page - 1}/${size}`
      );
      dispatch(resetTenantRent(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH RENT CANCELLED ", error.message);
      }
      console.error("Error fetching rent: ", error);
    }
  }, [dispatch, page, size, tenantAccommodation?.accommodationId, tenant]);

  if (status === "loading") return <Preloader />;

  return (
    <div className="w-full h-fit py-2">
      <div className="w-full lg:w-5/6 m-auto h-full shadow-xl">
        <div className="w-full p-2 flex justify-between items-center sticky top-0  shadow-lg z-10 bg-white">
          <h1 className="text-lg font-bold">
            {"TNT-" + (tenant && tenant.tenantId)}
          </h1>
          <div className="price flex">
            <select
              name="currency"
              id="currency"
              className="bg-gray-200 rounded-lg p-1 mx-1 uppercase border-none outline-none"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setDesiredCurrency(e.target.value)
              }
            >
              <option
                value={tenantAccommodation?.facility.preferedCurrency}
                className="bg-gray-200"
              >
                {tenantAccommodation?.facility.preferedCurrency}
              </option>
              {currencyNames.map((crn) => (
                <option value={crn} className="bg-gray-200">
                  {crn}
                </option>
              ))}
            </select>
            <h1 className="text-lg font-bold font-mono text-black">
              {FormatMoney(
                !desiredCurrency
                  ? Number(tenantAccommodation?.price)
                  : Number(convertedPrice),
                2,
                !desiredCurrency
                  ? String(tenantAccommodation?.facility.preferedCurrency)
                  : desiredCurrency
              )}
            </h1>
          </div>
          <RxCross2
            title="close"
            className="p-1 hover:bg-gray-200 text-3xl rounded-sm cursor-pointer"
            onClick={() => toggleShowTenantDetails()}
          />
        </div>
        <div className="w-full h-full flex flex-wrap justify-between items-start">
          <div className="w-full lg:w-1/3">
            {/* accommodation details*/}
            <div className="p-4 w-full">
              <h2 className="text-xl font-bold">Accommodation</h2>
              <div className="p-2 flex justify-start items-center w-full">
                <p className="text-sm flex flex-wrap shadow-lg px-3">
                  <span className="w-full">
                    <b>ID: </b>
                    <span>{"ACC-" + tenantAccommodation?.accommodationId}</span>
                  </span>
                  <span className="w-full">
                    <b>Number: </b>
                    <span>{tenantAccommodation?.accommodationNumber}</span>
                  </span>
                  <span className="w-full">
                    <b>Floor: </b>
                    <span>{tenantAccommodation?.floor}</span>
                  </span>
                  <span className="w-full">
                    <b>Type: </b>
                    <span>{tenantAccommodation?.accommodationType}</span>
                  </span>

                  {tenantAccommodation?.accommodationCategory && (
                    <span className="w-full">
                      <b>Category: </b>
                      <span>{tenantAccommodation?.accommodationCategory}</span>
                    </span>
                  )}
                  <span className="w-full">
                    <b>Capacity: </b>
                    <span>{tenantAccommodation?.capacity}</span>
                  </span>
                  <span className="w-full">
                    <b>Price: </b>
                    <span className="font-mono">
                      {FormatMoney(
                        !desiredCurrency
                          ? Number(tenantAccommodation?.price)
                          : Number(convertedPrice),
                        2,
                        !desiredCurrency
                          ? String(
                              tenantAccommodation?.facility.preferedCurrency
                            )
                          : desiredCurrency
                      )}
                    </span>
                  </span>
                  <span className="w-full">
                    <b>Status: </b>
                    <span>{tenantAccommodation?.availability}</span>
                  </span>
                </p>
              </div>
            </div>

            {/* tenant details*/}
            <div className="p-4 w-full">
              <h2 className="text-xl font-bold">Tenant</h2>
              <div className="p-2 flex justify-start items-center w-full shadow-md my-2">
                <p className="text-sm flex flex-wrap">
                  <span className="w-full">
                    <b>No: </b>
                    <span>{"TNT-" + (tenant && tenant.tenantId)}</span>
                  </span>
                  <span className="w-full">
                    <b>Name: </b>
                    {tenant && !tenant.companyName && (
                      <span>
                        {tenant &&
                          tenant.user.firstName + " " + tenant.user.lastName}
                      </span>
                    )}
                    {tenant && tenant.companyName && (
                      <span>{tenant && tenant.companyName}</span>
                    )}
                  </span>
                  <span className="w-full">
                    <b>Tel: </b>
                    <span>{tenant && tenant.user.userTelephone}</span>
                  </span>

                  <span className="w-full">
                    <b>Email: </b>
                    <span>{tenant && tenant.user.userEmail}</span>
                  </span>
                  <span className="w-full">
                    <b>ID: </b>
                    <span>{tenant && tenant.nationalId}</span>
                  </span>
                  <span className="w-full">
                    <b>ID Type: </b>
                    <span>{tenant && tenant.idType}</span>
                  </span>
                </p>
              </div>
            </div>

            {/* next of kin details*/}
            <div className="p-4 w-full">
              <h2 className="text-xl font-bold">Next of kin</h2>
              <div className="p-2 flex justify-start items-center w-full shadow-md my-2">
                <p className="text-sm flex flex-wrap">
                  <span className="w-full">
                    <b>Name: </b>

                    <span>{tenant && tenant.nextOfKin?.nokName}</span>
                  </span>
                  {tenant && tenant.nextOfKin?.nokEmail && (
                    <span className="w-full">
                      <b>Email: </b>
                      <span>{tenant && tenant.nextOfKin?.nokEmail}</span>
                    </span>
                  )}

                  <span className="w-full">
                    <b>Tel: </b>
                    <span>{tenant && tenant.nextOfKin?.nokTelephone}</span>
                  </span>
                  <span className="w-full">
                    <b>National ID: </b>
                    <span>{tenant && tenant.nextOfKin?.nokNationalId}</span>
                  </span>
                  <span className="w-full">
                    <b>ID Type: </b>
                    <span>{tenant && tenant.nextOfKin?.nokIdType}</span>
                  </span>
                  <span className="w-full">
                    <b>Address: </b>
                    <span>
                      {tenant &&
                        tenant.nextOfKin?.address.city +
                          ", " +
                          tenant.nextOfKin?.address.country}
                    </span>
                  </span>

                  <span className="w-full">
                    <b>Address Type: </b>
                    <span>{tenant && tenant.nextOfKin?.addressType}</span>
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* payment records */}
          <div className="w-full lg:w-2/3 p-0 lg:py-5 relative h-[calc(100vh-150px)]">
            <h2 className="w-full text-center font-bold text-xl">
              Rent records
            </h2>
            <div className="flex w-full items-center justify-end px-10 py-2">
              <h3 className="px-10 text-sm font-bold">
                {filteredAccommodationRent.length + "/" + totalElements}
              </h3>
              <div
                className={` rounded-full  bg-white flex justify-between border-gray-400 border-2 w-3/4 lg:w-2/4 h-3/4 mt-0 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-rent"
                  placeholder="Search for rent record..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchString(e.target.value)
                  }
                />

                <button className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-sm text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
            <div className="h-[calc(100vh-350px)] overflow-auto">
              <table className="w-full px-1 text-center text-sm bg-cyan-50">
                <thead className="bg-blue-900 text-white sticky top-0">
                  <tr className="border-y-blue-500">
                    <th className="text-white">Tenant.</th>
                    <th>Accommodation</th>
                    <th>Amount</th>
                    <th>Payment type</th>
                    <th>Added</th>
                  </tr>
                </thead>
                <tbody className="">
                  {filteredAccommodationRent.map((fr, index) => (
                    <TenantRentRow key={index} rent={fr} />
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationButtons
              handleFetchNextPage={handleFetchNextPage}
              handleFetchPreviousPage={handleFetchPreviousPage}
              page={page}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDetails;
