import React from "react";
import { useSelector } from "react-redux";
import { getAccommodationByTenant } from "../accommodations/accommodationsSlice";
import { HistoryModel } from "../history/HistoryModel";

interface Props {
  tenantIndex: number;
  tenant: HistoryModel;
  setTenantId: React.Dispatch<React.SetStateAction<number>>;
  toggleShowTenantDetails: () => void;
}

const Tenant: React.FC<Props> = ({
  tenant,
  tenantIndex,
  setTenantId,
  toggleShowTenantDetails,
}) => {
  const tenantAccommodation = useSelector(
    getAccommodationByTenant(Number(tenant && tenant.tenant.tenantId))
  );

  return (
    <tr
      className="cursor-pointer text-sm text-center border-y-2 hover:bg-gray-100"
      onClick={() => {
        setTenantId(Number(tenant.tenant.tenantId));
        toggleShowTenantDetails();
      }}
    >
      <td className="py-5">{tenantIndex + 1}</td>
      <td>{tenantAccommodation?.accommodationNumber}</td>
      <td>{tenantAccommodation?.floor}</td>
      <td>{tenantAccommodation?.accommodationType}</td>
      <td>{"TNT-" + tenant.tenant.tenantId}</td>
      {tenant.tenant.companyName && <td>{tenant.tenant.companyName}</td>}
      {!tenant.tenant.companyName && (
        <td>
          {tenant.tenant.user.firstName + " " + tenant.tenant.user.lastName}
        </td>
      )}
      <td>{tenant.tenant.user.userTelephone}</td>
      <td>{tenant.tenant.user.userEmail}</td>
    </tr>
  );
};

export default Tenant;
