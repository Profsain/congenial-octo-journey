import FigCard from "../../shared/FigCard";
import DashboardHeadline from "../../shared/DashboardHeadline";
import Headline from "../../../shared/Headline";
import "./AdminDashboard.css";
import LoansCard from "./LoansCard";
import StatCard from "./StatCard";
import BocChart from "./BocChart";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentDateFormatted,
  getYesterdayDate,
  getCurrentMonthAndYear,
  getLastMonthAndYear,
  getCurrentYear,
} from "./dashboradfunc";
import PageLoader from "../../shared/PageLoader";
import { fetchAllLoans } from "../../../../redux/reducers/loanReducer";

const HomeDashboard = () => {
  const [customerAnalytics, setCustomerAnalytics] = useState({
    kycCompleted: null,
    withCoo: null,
    withOperations: null,
    withCredit: null,
    booked: null,
    completed: null,
  });
  // fetch all customer data
  const dispatch = useDispatch();

  const { allLoans } = useSelector((state) => state.loanReducer);

  useEffect(() => {
    dispatch(fetchAllLoans()).catch((error) =>
      console.error("Error fetching Loans:", error)
    );
  }, [dispatch]);

  useEffect(() => {
    if (allLoans) {
      setCustomerAnalytics({
        ...customerAnalytics,
        booked: allLoans?.filter((loan) => loan?.loanstatus === "booked") || [],
        kycCompleted:
          allLoans?.filter(
            (loan) => loan?.customer?.kyc?.isKycApproved === true
          ) || [],
        withCoo:
          allLoans?.filter(
            (loan) =>
              loan?.loanstatus === "with coo" || loan?.loanstatus === "unbooked"
          ) || [],
        withCredit:
          allLoans?.filter((loan) => loan?.loanstatus === "with credit") || [],

        withOperations:
          allLoans?.filter((loan) => loan?.loanstatus === "with operations") ||
          [],

        completed:
          allLoans?.filter((loan) => loan?.loanstatus === "completed") || [],
      });
    }
  }, [allLoans]);

  // check
  return (
    <>
      <div className="TopCard">
        <FigCard>
          {customerAnalytics.completed ? (
            <h4 className="Title">
              {customerAnalytics.kycCompleted.length || "0"}
            </h4>
          ) : (
            <PageLoader width="28px" />
          )}
          <img className="CardIcon" src="images/eyes.png" alt="icon" />
          <p>Total Customers</p>
        </FigCard>
        <div className="Spacer"></div>
        <FigCard>
          {customerAnalytics.completed ? (
            <h4 className="Title">
              {customerAnalytics.completed.length || "0"}
            </h4>
          ) : (
            <PageLoader width="28px" />
          )}
          <img className="CardIcon" src="images/eyes.png" alt="icon" />
          <p>Total No Disbursed</p>
        </FigCard>
      </div>

      <div className="Stat">
        <div className="LoansStat">
          <Headline spacer="0 0 0.6rem 0" align="left" text="Loans" />
          <div className="InlineCard">
            <LoansCard
              img="images/padding.png"
              title="With Operations"
              stat={customerAnalytics.withOperations?.length}
              bgcolor="#ea5767"
            />
            <LoansCard
              img="images/star.png"
              title="With Credit"
              stat={customerAnalytics.withCredit?.length}
              bgcolor="#f6ab60"
            />

            <LoansCard
              img="images/thumbup.png"
              title="With COO/Unbooked"
              stat={customerAnalytics.withCoo?.length}
              bgcolor="#32c6c7"
            />
            <LoansCard
              img="images/star.png"
              title="Booked"
              stat={customerAnalytics.booked?.length}
              bgcolor="#ecaa00"
            />

            <LoansCard
              img="images/active.png"
              title="Completed"
              stat={customerAnalytics.completed?.length}
              bgcolor="#2bb294"
            />
            {/* add here */}
          </div>
        </div>

        <div className="LoansStat">
          <Headline
            spacer="1.5rem 0 0.6rem 0"
            align="left"
            text="Collections"
          />
          <div className="InlineCard collections">
            <StatCard
              day="Today"
              date={getCurrentDateFormatted()}
              stat="0.00"
              datecolor="#2bb294"
            />
            <StatCard
              day="Yesterday"
              date={getYesterdayDate()}
              stat="0.00"
              datecolor="#20c0ec"
            />
            <StatCard
              day="This Month"
              date={getCurrentMonthAndYear()}
              stat="0.00"
              datecolor="#2585c3"
            />
            <StatCard
              day="Last Month"
              date={getLastMonthAndYear()}
              stat="0.00"
              datecolor="#f6ab60"
            />
          </div>
        </div>
        <div className="LoansStat">
          <Headline
            spacer="1.5rem 0 0.6rem 0"
            align="left"
            text="Disbursement"
          />
          <div className="InlineCard collections" >
            <StatCard
              day="Today"
              date={getCurrentDateFormatted()}
              stat="0.00"
              datecolor="#2bb294"
            />
            <StatCard
              day="Yesterday"
              date={getYesterdayDate()}
              stat="0.00"
              datecolor="#20c0ec"
            />
            <StatCard
              day="This Month"
              date={getCurrentMonthAndYear()}
              stat="0.00"
              datecolor="#2585c3"
            />
            <StatCard
              day="Last Month"
              date={getLastMonthAndYear()}
              stat="0.00"
              datecolor="#f6ab60"
            />
          </div>
        </div>
      </div>

      {/* stat chart section */}
      <div className="Stat">
        <DashboardHeadline mspacer="0 0 4rem 0">
          Disbursement & Collections Analytics - {getCurrentYear()}
        </DashboardHeadline>
        <BocChart />
      </div>
    </>
  );
};

export default HomeDashboard;
