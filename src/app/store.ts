import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../modules/users/usersSlice";
import alertReducer from "../other/alertSlice";
import landlordsReducer from "../modules/landlords/landlordSlice";
import confirmReducer from "../other/ConfirmSlice";
import actionReducer from "../global/actions/actionSlice";
import landlordFacilitiesReducer from "../modules/landlords/facilities/LandlordFacilitiesSlice";
import settingsReducer from "../modules/settings/SettingsSlice";
import subscriptionsReducer from "../modules/subscription/SubscriptionSlice";
import brokerFeesReducer from "../modules/brokerFee/BrokerFeesSlice";
import bidsReducer from "../modules/bids/BidsSlice";
import officesReducer from "../modules/offices/OfficesSlice";
import adminsReducer from "../modules/admins/AdminStaffSlice";
import logsReduser from "../modules/logs/LogsSlice";
import landlordUsersReducer from "../modules/landlords/users/LandlordsUsersSlice";
import userLogsReducer from "../modules/landlords/logs/LandlordLogsSlice";
import userBidsReducer from "../modules/landlords/bids/LandlordBidsSlice";
import facilitiesReducer from "../modules/facilities/FacilitiesSlice";
import currencyExchangeReducer from "../other/apis/CurrencyExchangeSlice";
import SpacesReducer from "../modules/facilities/spaces/SpacesSlice";
import facilityBidsReducer from "../modules/facilities/bids/FacilityBidsSlice";
import facilityAccommodationsReducer from "../modules/facilities/accommodations/accommodationsSlice";
import accommodationRentReducer from "../modules/facilities/accommodations/AccommodationRentSlice";
import facilityRentReducer from "../modules/facilities/rent/FacilityRentSlice";
import facilityTenantsReducer from "../modules/facilities/tenants/TenantsSlice";
import tenantRentReducer from "../modules/facilities/tenants/TenantRentSlice";
import facilityServiceFeesReducer from "../modules/facilities/serviceFees/FacilityServiceFeesSlice";
import facilityBookingsReducer from "../modules/facilities/bookings/bookingsSlice";
import facilityHistoryReducer from "../modules/facilities/history/HistorySlice";
import receiptsReducer from "../modules/receipts/receiptsSlice";
import expensesReducer from "../modules/facilities/expenses/expenseSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    landlords: landlordsReducer,
    alert: alertReducer,
    confirm: confirmReducer,
    action: actionReducer,
    landlordFacilities: landlordFacilitiesReducer,
    settings: settingsReducer,
    subscriptions: subscriptionsReducer,
    brokerFees: brokerFeesReducer,
    bids: bidsReducer,
    offices: officesReducer,
    admins: adminsReducer,
    logs: logsReduser,
    landlordUsers: landlordUsersReducer,
    userLogs: userLogsReducer,
    userBids: userBidsReducer,
    facilities: facilitiesReducer,
    currencyExchange: currencyExchangeReducer,
    spaces: SpacesReducer,
    facilityBids: facilityBidsReducer,
    facilityAccommodations: facilityAccommodationsReducer,
    facilityTenants: facilityTenantsReducer,
    accommodationRent: accommodationRentReducer,
    facilityRent: facilityRentReducer,
    tenantRent: tenantRentReducer,
    facilityServiceFees: facilityServiceFeesReducer,
    facilityBookings: facilityBookingsReducer,
    facilityHistory: facilityHistoryReducer,
    receipts: receiptsReducer,
    facilityExpenses: expensesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
