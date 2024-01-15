import { useEffect } from "react";
import { useSelector } from "react-redux";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import Table from "react-bootstrap/Table";

const UpcomingLoanPayment = () => {
  const styles = {
    table: {
      marginLeft: "2rem",
    },
    head: { color: "#145098", fontWeight: "bold", fontSize: "1.2rem" },
  };

   const user = useSelector((state) => state.adminAuth.user);
  // console.log(user);

  const api_user = import.meta.env.VITE_BASE_URL;
  
  // fetch upcoming loan payment
  const fetchUpcomingLoanPayment = async () => {
    const response = await fetch(
      `${api_user}/api/bankone/getLoanRepaymentSchedule/${user.banking.accountDetails.Message.AccountNumber}`
    );
    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    fetchUpcomingLoanPayment();
  }, []);

  return (
    <div>
      <DashboardHeadline>Upcoming Loan Payment</DashboardHeadline>
      <Table borderless hover responsive="sm" style={styles.table} className="RBox">
        <thead>
          <tr style={styles.head}>
            <th>Loan ID</th>
            <th>Next Payment Date</th>
            <th>Status</th>
            <th>Amount to Pay</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1023</td>
            <td>2023-25-03</td>
            <td>
              <BocButton>Due</BocButton>
            </td>
            <td>N21340</td>
            <td>
              <BocButton cursor="pointer" bgcolor="#ecaa00" bradius="18px">
                Pay Now
              </BocButton>
            </td>
          </tr>
          <tr>
            <td>1024</td>
            <td>2023-25-04</td>
            <td>
              <BocButton>Due</BocButton>
            </td>
            <td>N19340</td>
            <td>
              <BocButton cursor="pointer" bgcolor="#ecaa00" bradius="18px">
                Pay Now
              </BocButton>
            </td>
          </tr>
          <tr>
            <td>1030</td>
            <td>2023-25-05</td>
            <td>
              <BocButton>Due</BocButton>
            </td>
            <td>N10340</td>
            <td>
              <BocButton cursor="pointer" bgcolor="#ecaa00" bradius="18px">
                Pay Now
              </BocButton>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default UpcomingLoanPayment;
