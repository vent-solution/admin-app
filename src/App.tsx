import { Routes, Route } from "react-router-dom";
import UsersPage from "./modules/users/usersPage";
import ResetPasswordPage from "./modules/auth/resetPasswordPage";
import SignUpPage from "./modules/auth/signUpPage";
import LandlordsPage from "./modules/landlords/LandlordsPage";
import Layout from "./components/Layout";
import SingleLandlordPage from "./modules/landlords/SingleLandlordPage";
import AdminStaffsPage from "./modules/admins/AdminStaffsPage";
import SettingsPage from "./modules/settings/settingsPage";
import OfficesPage from "./modules/offices/OfficesPage";
import SubscriptionsPage from "./modules/subscription/SubscriptionsPage";
import BrokerFeePage from "./modules/brokerFee/BrokerFeePage";
import BidsPage from "./modules/bids/bidsPage";
import SingleOfficePage from "./modules/offices/SingleOfficePage";
import LogsPage from "./modules/logs/LogsPage";
import Dashboard from "./modules/dashboard/Dashboard";
import LoginPage from "./modules/auth/loginPage";
import FacilitiesPage from "./modules/facilities/FacilitiesPage";
import SingleFacilityPage from "./modules/facilities/SingleFacilityPage";
import ReceiptsPage from "./modules/receipts/ReceiptsPage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./app/store";
import { webSocketService } from "./webSockets/socketService";
import { usersTopicSubscription } from "./webSockets/subscriptionTopics/usersTopicSubscription";
import { facilitiesTopicSubscription } from "./webSockets/subscriptionTopics/facilitiesTopicSubscription";
function App() {
  const dispatch = useDispatch<AppDispatch>();

  // socket connection and subscription
  useEffect(() => {
    webSocketService.connect();

    usersTopicSubscription(dispatch);
    facilitiesTopicSubscription(dispatch);

    return () => {
      console.log("Unsubscribing from WebSocket...");
      webSocketService.unsubscribe("/topic/users");
      webSocketService.disconnect();
    };
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="dashboard">
          <Route index element={<Dashboard />} />
        </Route>

        <Route path="users">
          <Route index element={<UsersPage />} />
          <Route path=":userId" element={<UsersPage />} />
        </Route>

        <Route path="landlords">
          <Route index element={<LandlordsPage />} />
          <Route path=":landlordId" element={<SingleLandlordPage />} />
        </Route>

        <Route path="staffs">
          <Route index element={<AdminStaffsPage />} />
          <Route path=":userId" element={<AdminStaffsPage />} />
        </Route>

        <Route path="offices">
          <Route index element={<OfficesPage />} />
          <Route path=":officeId" element={<SingleOfficePage />} />
        </Route>

        <Route path="settings">
          <Route index element={<SettingsPage />} />
        </Route>

        <Route path="subscription">
          <Route index element={<SubscriptionsPage />} />
        </Route>

        <Route path="brokerFees">
          <Route index element={<BrokerFeePage />} />
        </Route>

        <Route path="bids">
          <Route index element={<BidsPage />} />
        </Route>

        <Route path="logs">
          <Route index element={<LogsPage />} />
        </Route>

        <Route path="receipts">
          <Route index element={<ReceiptsPage />} />
        </Route>

        <Route path="facilies">
          <Route index element={<FacilitiesPage />} />
          <Route path=":facilityId" element={<SingleFacilityPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
