import { useDispatch, useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import BocButton from "../../shared/BocButton";
import "../../Dashboard.css";
import { useEffect, useState } from "react";
import TableStyles from "../tables/TableStyles.module.css";
import { fetchUserTransactions } from "../../../../redux/reducers/transactionReducer";
import PageLoader from "../../shared/PageLoader";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";
import TransactionModal from "./TransactionModal";
import { format } from "date-fns";
import DashboardHeadline from "../../shared/DashboardHeadline";

const AccountTransaction = () => {
  const styles = {
    th: {
      color: "#ffffff",
      fontWeight: "bold",
      fontSize: "1.2rem",
    },
    completed: {
      color: "#5cc51c",
    },
  };

  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const { userTransactions, status } = useSelector(
    (state) => state.transactionReducer
  );

  const user = useSelector((state) => state.adminAuth.user);

  const dispatch = useDispatch(0);

  useEffect(() => {
    const getData = async () => {
      if (!user) return;

      try {
        await dispatch(
          fetchUserTransactions(user.banking?.accountDetails?.AccountNumber)
        );
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [user]);

  return (
    <div className={TableStyles.table__wrapper}>
      <DashboardHeadline
        height="52px"
        mspacer="2rem 0 -3.2rem -1rem"
        bgcolor="#145098"
      ></DashboardHeadline>
      <Table
        borderless
        hover
        responsive="sm"
        style={styles.table}
        className="RBox"
      >
        <thead>
          <tr style={styles.th}>
            <th>Date</th>
            <th>AC Number</th>
            <th>Amount</th>
            <th>Dr/Cr</th>
            <th>Type</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>

        <tbody>
          {!userTransactions || status === "loading" ? (
            <tr className={TableStyles.row}>
              <td colSpan="7">
                <PageLoader width="70px" />
              </td>
            </tr>
          ) : userTransactions.length === 0 ? (
            <tr className={TableStyles.row}>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No recent transactions
              </td>
            </tr>
          ) : (
            userTransactions &&
            userTransactions.slice(0, 5).map((transaction, index) => {
              return (
                <tr key={index} className={TableStyles.row}>
                  <td>
                    {transaction?.CurrentDate
                      ? format(
                          transaction?.CurrentDate,
                          "dd/LL/yyyy, hh:mm aaa"
                        )
                      : ""}
                  </td>
                  <td>{transaction?.AccountNumber || "NIL"}</td>
                  <td>
                    {nigerianCurrencyFormat.format(transaction?.Amount / 100)}
                  </td>
                  <td>{transaction?.RecordType}</td>
                  <td>{transaction?.PostingType} </td>
                  <td style={styles.completed}>{transaction?.status}</td>
                  <td>
                    <BocButton
                      func={() => setSelectedTransaction(transaction)}
                      cursor="pointer"
                      bgcolor="#145098"
                      bradius="18px"
                    >
                      View
                    </BocButton>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>

      {selectedTransaction ? (
        <TransactionModal
          selectedTransaction={selectedTransaction}
          handleClose={() => setSelectedTransaction(null)}
        />
      ) : null}
    </div>
  );
};

export default AccountTransaction;
