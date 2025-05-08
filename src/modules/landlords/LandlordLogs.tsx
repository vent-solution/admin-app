import React from "react";
import LandlordLogsList from "./logs/LandlordLogsList";

interface Props {
  userId: string | undefined;
}
const LandlordLogs: React.FC<Props> = ({ userId }) => {
  return (
    <div>
      <LandlordLogsList userId={userId} />
    </div>
  );
};

export default LandlordLogs;
