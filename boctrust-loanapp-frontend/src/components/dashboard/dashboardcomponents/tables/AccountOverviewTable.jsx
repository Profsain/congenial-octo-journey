import PropTypes from "prop-types";
import DashboardHeadline from "../../shared/DashboardHeadline";
import Table from "react-bootstrap/Table";

const AccountOverviewTable = ({ user }) => {
  const styles = {
    table: {
      marginLeft: "2rem",
    },
    head: { color: "#145098", fontWeight: "bold", fontSize: "1.2rem" },
  };

  // all loans record
  const allLoans = user?.allLoans || [];
  // console.log("All loan", allLoans)

  return (
    <div>
      <DashboardHeadline>Account Overview</DashboardHeadline>
      <Table
        borderless
        hover
        responsive="sm"
        style={styles.table}
        className="RBox"
      >
        <thead>
          <tr style={styles.head}>
            <th>Account Number</th>
            <th>Account Type</th>
            <th>Balance</th>
            <th>Loan</th>
            <th>Current Balance</th>
          </tr>
        </thead>
        <tbody>
          {allLoans.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No account overview
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No account overview
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

AccountOverviewTable.propTypes = {
  user: PropTypes.any,
};

export default AccountOverviewTable;
