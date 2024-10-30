import { useDispatch, useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import BocButton from "../../shared/BocButton";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import { useEffect } from "react";
import { fetchMyLoans } from "../../../../redux/reducers/loanReducer";
import PageLoader from "../../shared/PageLoader";

const styles = {
  head: {
    color: "#fff",
    fontSize: "1rem",
  },
  table: {
    marginLeft: "-1rem",
  },
};

const MyLoan = () => {
  const user = useSelector((state) => state.adminAuth.user);
  const { allLoans, status } = useSelector((state) => state.loanReducer);

  const dispatch = useDispatch();
  useEffect(() => {
    const getData = async () => {
      try {
        await dispatch(fetchMyLoans(user?._id));
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [user]);

  return (
    <div className="MLoan">
      <DashboardHeadline
        height="46px"
        mspacer="2rem 2rem -2.55rem -2rem"
        bgcolor="#145098"
      ></DashboardHeadline>
      <Table
        borderless
        hover
        responsive="sm"
        style={styles.table}
        className="DTable"
      >
        <thead style={styles.head}>
          <tr>
            <th>Loan ID</th>
            <th>Loan Product</th>
            <th>Applied Amount</th>
            <th>Total Payable</th>
            <th>Amount Paid</th>
            <th>Due Amount</th>
            <th>Release Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {!allLoans || status === "loading" ? (
            <tr>
              <td colSpan="8">
                <PageLoader width="70px" />
              </td>
            </tr>
          ) : allLoans && allLoans.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No loan record
              </td>
            </tr>
          ) : allLoans.map((loan) =>(
            <tr key={loan._id}>
<td>
  
</td>
            </tr>
          ) )   }
        </tbody>
      </Table>
    </div>
  );
};

export default MyLoan;
