import React from "react";
import LandlordBidsList from "./bids/LandlordBidsList";

interface Props {
  userId: string | undefined;
}
const LandlordBids: React.FC<Props> = ({ userId }) => {
  return (
    <div>
      <LandlordBidsList userId={userId} />
    </div>
  );
};

export default LandlordBids;
