import React, { useCallback, useState } from "react";
import { FacilitiesModel } from "./FacilityModel";
import TenantsList from "./tenants/FacilityTenantsList";
import TenantDetails from "./tenants/TenantDetails";
import { useSelector } from "react-redux";
import { getTenantById } from "./tenants/TenantsSlice";

interface Props {
  facility: FacilitiesModel;
}

let Tenants: React.FC<Props> = ({ facility }) => {
  const [showTenantDetails, setShowTenantDetails] = useState<boolean>(false);
  const [tenantId, setTenantId] = useState<number>(0);

  // handle toggle show tenant details
  const toggleShowTenantDetails = useCallback(() => {
    setShowTenantDetails(!showTenantDetails);
  }, [showTenantDetails]);

  const history = useSelector(getTenantById(tenantId));

  const tenant = history?.tenant;

  return (
    <div className="">
      {!showTenantDetails && (
        <TenantsList
          facility={facility}
          setTenantId={setTenantId}
          toggleShowTenantDetails={toggleShowTenantDetails}
        />
      )}
      {showTenantDetails && (
        <TenantDetails
          tenant={tenant}
          toggleShowTenantDetails={toggleShowTenantDetails}
        />
      )}
    </div>
  );
};

Tenants = React.memo(Tenants);

export default Tenants;
