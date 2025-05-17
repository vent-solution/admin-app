import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./app/store";
import { Provider } from "react-redux";
import "./styles/main.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { fetchUsers } from "./modules/users/usersSlice";
import { fetchLandlords } from "./modules/landlords/landlordSlice";
import { fetchSubscriptions } from "./modules/subscription/SubscriptionSlice";
import { fetchBrokerFees } from "./modules/brokerFee/BrokerFeesSlice";
import { fetchBids } from "./modules/bids/BidsSlice";
import { fetchAdminUsers } from "./modules/admins/AdminStaffSlice";
import { fetchLogs } from "./modules/logs/LogsSlice";
import { fetchFacilities } from "./modules/facilities/FacilitiesSlice";
import { fetchCurrencyExchange } from "./other/apis/CurrencyExchangeSlice";
import { fetchAdminFinancialSettings } from "./modules/settings/SettingsSlice";
import { fetchReceipts } from "./modules/receipts/receiptsSlice";

store.dispatch(fetchUsers({ page: 0, size: 100 }));
store.dispatch(fetchLandlords({ page: 0, size: 100 }));
store.dispatch(fetchSubscriptions({ page: 0, size: 100 }));
store.dispatch(fetchBrokerFees({ page: 0, size: 100 }));
store.dispatch(fetchBids({ page: 0, size: 100 }));
store.dispatch(fetchAdminUsers({ page: 0, size: 100 }));
store.dispatch(fetchLogs({ page: 0, size: 100 }));
store.dispatch(fetchFacilities({ page: 0, size: 100 }));
store.dispatch(fetchReceipts({ page: 0, size: 100 }));
store.dispatch(fetchCurrencyExchange());
store.dispatch(fetchAdminFinancialSettings());

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router basename="/admin">
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
