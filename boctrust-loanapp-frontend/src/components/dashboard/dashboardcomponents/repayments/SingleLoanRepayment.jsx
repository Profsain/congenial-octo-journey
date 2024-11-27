import React from "react";
import { calcDaysDiffFromNow } from "../../../../../utilities/calcDaysDiff";
import { format } from "date-fns";
import TableStyles from "../tables/TableStyles.module.css";

function SingleLoanRepayment({ loanRepaymentSchedule }) {
  return (
    loanRepaymentSchedule &&
    loanRepaymentSchedule.map((loan) => (
      <tr key={loan.Id} className={TableStyles.row}>
        <td>{loan.Id}</td>
        <td>{loan.AccountNumber}</td>
        <td>
          {loan.PaymentDueDate &&
            format(loan.PaymentDueDate, "dd/LL/yyyy, hh:mm aaa")}{" "}
        </td>
        <td>
          <button
            className={`btn text-white ${
              calcDaysDiffFromNow(loan.PaymentDueDate) >= 0
                ? "btn-danger"
                : "btn-secondary"
            }`}
          >
            {calcDaysDiffFromNow(loan.PaymentDueDate) >= 0 ? "Due" : "Not Due"}
          </button>
        </td>
        <td>
          <div className="d-flex">
            <img src="/images/naira.png" alt="" width={15} />
            {loan.Total}
          </div>
        </td>
        <td>
          <button className={`${TableStyles.gold_btn} gold__gradientBtn`}>
            Pay Now
          </button>
        </td>
      </tr>
    ))
  );
}

export default SingleLoanRepayment;
