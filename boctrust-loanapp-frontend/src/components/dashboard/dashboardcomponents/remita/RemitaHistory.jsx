import { useState } from "react";
import BocButton from "../../shared/BocButton";
import Table from "react-bootstrap/Table";
import DashboardHeadline from "../../shared/DashboardHeadline";

const RemitaHistory = () => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "space-between",
      marginLeft: "-1.1rem",
    },
    th: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: "1.2rem",
    },
    completed: {
      color: "#5cc51c",
    },
    decline: {
      color: "#ff0000",
    },
  };

  const [remitaHistory, setRemitaHistory] = useState([]);

  return (
    <div>
      <div style={styles.container}>
        <img width="130px" src="/images/remita-logo.jpg" alt="remita-logo" />
      </div>
      <div className="TReport">
        <DashboardHeadline
          height="46px"
          mspacer="2rem 0 -3.3rem 0"
          bgcolor="#145098"
        ></DashboardHeadline>
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
            {remitaHistory.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No loan record
                </td>
              </tr>
            ) : (
              <div>
                <tr>
                  <td>2023-25-03</td>
                  <td>1234567891</td>
                  <td>N2134</td>
                  <td>Repayment</td>
                  <td style={styles.completed}>Successful</td>
                  <td>
                    <BocButton
                      cursor="pointer"
                      bgcolor="#145098"
                      bradius="18px"
                    >
                      View
                    </BocButton>
                  </td>
                </tr>
                <tr>
                  <td>2023-25-03</td>
                  <td>1234567891</td>
                  <td>N2134</td>
                  <td>Repayment</td>
                  <td style={styles.decline}>Decline</td>
                  <td>
                    <BocButton
                      cursor="pointer"
                      bgcolor="#145098"
                      bradius="18px"
                    >
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
                    <BocButton
                      cursor="pointer"
                      bgcolor="#145098"
                      bradius="18px"
                    >
                      View
                    </BocButton>
                  </td>
                </tr>
              </div>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default RemitaHistory;
