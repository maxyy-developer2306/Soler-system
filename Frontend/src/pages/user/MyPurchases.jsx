import { useLocation } from "react-router-dom";
import Orders from "./Orders";

function MyPurchases() {
  const location = useLocation();

  return (
    <Orders
      view="purchases"
      checkoutSuccess={location.state?.checkoutSuccess === true}
    />
  );
}

export default MyPurchases;