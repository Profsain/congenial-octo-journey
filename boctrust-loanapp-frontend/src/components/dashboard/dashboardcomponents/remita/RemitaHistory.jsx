import BocButton from "../../shared/BocButton";
// import DashboardHeadline from "../../shared/DashboardHeadline";
import Table from "react-bootstrap/Table";

const RemitaHistory = () => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "space-between",
      marginLeft: "-1.1rem",
    },
    th: {
      color: "#145098",
      fontWeight: "bold",
      fontSize: "1.2rem",
    },
    completed: {
      color: "#5cc51c",
    },
  };

  return (
    <div>
      <div style={styles.container}>
        {/* <DashboardHeadline mspacer="0 3rem 0 0">
          Recent Transaction
        </DashboardHeadline> */}
        <img width="130px" src="images/remita-logo.jpg" alt="remita-logo" />
      </div>
      <div className="TReport">
        <Table borderless hover responsive="sm" className="DTable">
          <thead>
            <tr style={styles.th}>
              <th>Date</th>
              <th>AC Number</th>
              <th>Amount</th>
              <th>Transaction</th>
              <th>Status</th>
              <th>Print</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2023-25-03</td>
              <td>1234567891</td>
              <td>N2134</td>
              <td>Repayment</td>
              <td style={styles.completed}>Successful</td>
              <td>
                <BocButton cursor="pointer" bgcolor="#145098" bradius="18px">
                  View
                </BocButton>
              </td>
            </tr>
            <tr>
              <td>2023-25-03</td>
              <td>1234567891</td>
              <td>N2134</td>
              <td>Repayment</td>
              <td style={styles.completed}>Decline</td>
              <td>
                <BocButton cursor="pointer" bgcolor="#145098" bradius="18px">
                  View
                </BocButton>
              </td>
            </tr>
            <tr>
              <td>2023-25-05</td>
              <td>1234567891</td>
              <td>N1134</td>
              <td>Repayment</td>
              <td style={styles.completed}>Successful</td>
              <td>
                <BocButton cursor="pointer" bgcolor="#145098" bradius="18px">
                  View
                </BocButton>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default RemitaHistory;
