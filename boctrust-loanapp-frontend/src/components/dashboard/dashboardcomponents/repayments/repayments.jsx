import { useSelector } from "react-redux";
import { useState } from "react";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import Table from "react-bootstrap/Table";

const LoanPayment = () => {
  const styles = {
    container: {
      paddingBottom: "3rem",
      marginRight: "4rem",
    },
    table: {
      marginLeft: "2rem",
    },
    head: {
      color: "#145098",
      fontWeight: "bold",
      fontSize: "1.2rem",
    },
  };

  const user = useSelector((state) => state.adminAuth.user);
  const [upcomingLoanPayment, setUpcomingLoanPayment] = useState([]);

  return (
    <div style={styles.container} className="RepaymentCon SecCon">
      <DashboardHeadline>Upcoming Loan Payment</DashboardHeadline>
      <Table
        borderless
        hover
        responsive="sm"
        style={styles.table}
        className="DTable RTable"
      >
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
          {upcomingLoanPayment.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No upcoming loan payment
              </td>
            </tr>
          ) : (
            <div>
              <tr>
                <td>1023</td>
                <td>2023-25-03</td>
                <td>Completed</td>
                <td>N2134</td>
                <td>
                  <BocButton cursor="pointer" bgcolor="#145098" bradius="18px">
                    View
                  </BocButton>
                </td>
              </tr>
              <tr>
                <td>1023</td>
                <td>2023-25-03</td>
                <td>Completed</td>
                <td>N2134</td>
                <td>
                  <BocButton cursor="pointer" bgcolor="#145098" bradius="18px">
                    View
                  </BocButton>
                </td>
              </tr>
              <tr>
                <td>1023</td>
                <td>2023-25-03</td>
                <td>Completed</td>
                <td>N2134</td>
                <td>
                  <BocButton cursor="pointer" bgcolor="#145098" bradius="18px">
                    View
                  </BocButton>
                </td>
              </tr>
            </div>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default LoanPayment;
