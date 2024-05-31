import { useSelector } from "react-redux";
import TopCardSec from "./TopCardSec";
import AccountOverviewTable from "./tables/AccountOverviewTable";
import RecentTransaction from "./tables/RecentTransaction";
import UpcomingLoanPayment from "./tables/UpcomingLoanPayment";

const DashboardHome = () => {
  // get current login user
  const user = useSelector((state) => state.adminAuth.user);
  console.log("Login User", user)
  return (
    <div className="DashboardHome">
      <TopCardSec />
      <div className="PCont">
        <AccountOverviewTable />
        <UpcomingLoanPayment />
        <RecentTransaction />
      </div>
    </div>
  );
}

export default DashboardHome