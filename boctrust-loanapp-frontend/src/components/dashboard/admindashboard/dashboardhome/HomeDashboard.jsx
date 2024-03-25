import FigCard from "../../shared/FigCard";
import DashboardHeadline from "../../shared/DashboardHeadline";
import Headline from "../../../shared/Headline";
import "./AdminDashboard.css";
import LoansCard from "./LoansCard";
import StatCard from "./StatCard";
import BocChart from "./BocChart";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import {
  getCurrentDateFormatted,
  getYesterdayDate,
  getCurrentMonthAndYear,
  getLastMonthAndYear,
  getCurrentYear,
} from "./dashboradfunc";

const HomeDashboard = () => {
  // fetch all customer data
  const dispatch = useDispatch();
  const customers = useSelector(
    (state) => state.customerReducer.customers.customer
  );

  useEffect(() => {
    dispatch(fetchAllCustomer()).catch((error) =>
      console.error("Error fetching customers:", error)
    );
  }, [dispatch]);

  // filter customer with kyc status completed
  const kycCompleted = customers
    ? customers?.filter((customer) => customer?.kyc?.isKycApproved === true)
    : [];

  // filter customer with loan status
  const withCoo = customers
    ? customers?.filter((customer) => customer?.kyc?.loanstatus === "with coo")
    : [];

  const withOperations = customers
    ? customers?.filter(
        (customer) => customer?.kyc?.loanstatus === "with operation"
      )
    : [];

  const withCredit = customers
    ? customers?.filter(
        (customer) => customer?.kyc?.loanstatus === "with credit"
      )
    : [];

  const booked = customers
    ? customers?.filter((customer) => customer?.kyc?.loanstatus === "booked")
    : [];

  const completed = customers
    ? customers?.filter((customer) => customer?.kyc?.loanstatus === "completed")
    : [];

  const totalCustomer = kycCompleted.length;

  // check
  return (
    <>
      <div className="TopCard">
        <FigCard>
          <h4 className="Title">{totalCustomer || "0"}</h4>
          <img className="CardIcon" src="images/eyes.png" alt="icon" />
          <p>Total Customers</p>
        </FigCard>
        <div className="Spacer"></div>
        <FigCard>
          <h4 className="Title">{totalCustomer || "0"}</h4>
          <img className="CardIcon" src="images/eyes.png" alt="icon" />
          <p>Total No Disbursed</p>
        </FigCard>
      </div>

      <div className="Stat">
        <div className="LoansStat">
          <Headline spacer="0 0 0.6rem 0" align="left" text="Loans" />
          <div className="InlineCard">
            <div className="MStat">
              <LoansCard
                img="images/padding.png"
                title="With Operations"
                stat={withOperations.length}
                bgcolor="#ea5767"
              />
              <LoansCard
                img="images/star.png"
                title="With Credit"
                stat={withCredit.length}
                bgcolor="#f6ab60"
              />
            </div>
            <div className="MStat">
              <LoansCard
                img="images/thumbup.png"
                title="With COO"
                stat={withCoo.length}
                bgcolor="#32c6c7"
              />
              <LoansCard
                img="images/star.png"
                title="Booked"
                stat={booked.length}
                bgcolor="#ecaa00"
              />
            </div>
            <LoansCard
              img="images/active.png"
              title="Completed"
              stat={completed.length}
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
          <div className="InlineCard">
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
          <div className="InlineCard">
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
