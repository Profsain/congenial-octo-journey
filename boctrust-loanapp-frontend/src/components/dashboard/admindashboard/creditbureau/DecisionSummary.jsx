import { useEffect, useState } from "react";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import "./Credit.css";
import PropTypes from "prop-types";
import { fetchSingleCustomer } from "../../../../redux/reducers/customerReducer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import axios from "axios";
import PageLoader from "../../shared/PageLoader";

const percentageIndex = 0.45;

const DecisionSummary = ({ customerId }) => {
  const dispatch = useDispatch();

  const [decisionSummaryInfo, setDecisionSummaryInfo] = useState(null);
  const [isGoodCreditHistory, setIsGoodCreditHistory] = useState(false);
  const [validateInfo, setValidateInfo] = useState({
    isCustomerOnSoftSuit: false,
    isCustomerNextOfKinOk: false,
    isCreditCheckOk: false,
    isBvnCheckOk: false,
    disbursementInstruction: "",
    creditOfficerReview: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { selectedCustomer, customerApprovalEnum } = useSelector(
    (state) => state.customerReducer
  );

  useEffect(() => {
    const getData = async () => {
      console.log(customerId, "customerId");
      try {
        await dispatch(fetchSingleCustomer(customerId));
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      setDecisionSummaryInfo({
        ...decisionSummaryInfo,

        maxAmountLendable: (
          selectedCustomer?.creditCheck?.paySlipAnalysis?.netPay *
          percentageIndex
        ).toFixed(2),
        totalMonthlyDeductions:
          selectedCustomer?.creditCheck?.paySlipAnalysis?.extraLenders.reduce(
            (acc, curr) => acc + curr.deductions,
            0
          ),
      });
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (
      decisionSummaryInfo?.totalMonthlyDeductions === 0 &&
      selectedCustomer?.creditCheck?.paySlipAnalysis?.monthlyLoanRepayment >
        decisionSummaryInfo.maxAmountLendable
    ) {
      setIsGoodCreditHistory(false);
    } else if (
      decisionSummaryInfo?.totalMonthlyDeductions === 0 &&
      selectedCustomer?.creditCheck?.paySlipAnalysis?.monthlyLoanRepayment <
        decisionSummaryInfo.maxAmountLendable
    ) {
      setIsGoodCreditHistory(true);
    }
    if (decisionSummaryInfo?.totalMonthlyDeductions > 0) {
      if (
        (selectedCustomer?.creditCheck?.paySlipAnalysis?.netPay -
          decisionSummaryInfo?.totalMonthlyDeductions) *
          percentageIndex <
        decisionSummaryInfo.maxAmountLendable
      ) {
        setIsGoodCreditHistory(true);
      } else {
        setIsGoodCreditHistory(false);
      }
    }
  }, []);

  const apiUrl = import.meta.env.VITE_BASE_URL;

  const handleApproveCustomer = async () => {
    const requestObj = {
      customerHasGoodCreditHistory: validateInfo.isGoodCreditHistory,
      isCustomerOnSoftSuit: validateInfo.isCustomerOnSoftSuit,
      isCustomerNextOfKinOk: validateInfo.isCustomerNextOfKinOk,
      isCreditCheckOk: validateInfo.isCreditCheckOk,
      isBvnCheckOk: validateInfo.isBvnCheckOk,
      creditOfficerReview: validateInfo.creditOfficerReview,
      disbursementInstruction: validateInfo.disbursementInstruction,
      maxAmountLendable: decisionSummaryInfo.maxAmountLendable,
      totalMonthlyDeductions: decisionSummaryInfo.totalMonthlyDeductions,
      customerTakeHomeAfterLoanApproval:
        decisionSummaryInfo?.maxAmountLendable -
        decisionSummaryInfo?.totalMonthlyDeductions,
    };
    try {
      setIsLoading(true);
      await axios.put(
        `${apiUrl}/api/updatecustomer/approve/co/${customerId}`,
        requestObj
      );
      await dispatch(fetchSingleCustomer(customerId));
      toast.success("Customer Approval Success");
    } catch (error) {
      toast.error(error?.reponse?.data?.error || "Something Went Wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="TransContainer RBox">
      <div className=" d-flex justify-content-center p-5">
        <h4>Decision Summary</h4>
      </div>

      <div className="mx-5">
        <p className="row">
          <span className="col-5"> Customer&apos;s Net pay is </span>
          <span className="figure col-7">
            {selectedCustomer?.creditCheck?.paySlipAnalysis?.netPay}
          </span>
        </p>
        <p className="row">
          <span className="col-5"> 45% of Customer&apos;s Net pay is </span>
          <span className="figure col-7">
            {decisionSummaryInfo?.maxAmountLendable}
          </span>
        </p>
        <p className="row">
          <span className="col-5"> Monthy Repayment</span>{" "}
          <span className="figure col-7">
            {
              selectedCustomer?.creditCheck?.paySlipAnalysis
                ?.monthlyLoanRepayment
            }
          </span>
        </p>
        <p className="row">
          <span className="col-5"> Total Monthy Deductions</span>{" "}
          <span className="figure col-7">
            {decisionSummaryInfo?.totalMonthlyDeductions}
          </span>
        </p>
        <p className="row">
          <span className="col-5">
            If Loan is approved, customer&apos;s Take Home is{" "}
          </span>
          <div className="col-7">
            <span className="figure">
              {decisionSummaryInfo?.maxAmountLendable -
                decisionSummaryInfo?.totalMonthlyDeductions}
            </span>{" "}
            which is{" "}
            <span className="figure">
              {((decisionSummaryInfo?.maxAmountLendable -
                decisionSummaryInfo?.totalMonthlyDeductions) *
                100) /
                selectedCustomer?.creditCheck?.paySlipAnalysis?.netPay}
            </span>
            % of his/her Net pay.
          </div>
        </p>
        <div id="validate">
          <p className="decision-row ">
            <span className=""> Customer has good credit History </span>
            <span className={isGoodCreditHistory ? "validBtn" : "inValidBtn"}>
              {isGoodCreditHistory ? "Good" : "Bad"}
            </span>
          </p>
          <p className="decision-row ">
            <span className="">
              Customer Name/Number is on the Soft suite document{" "}
            </span>
            <div className="form-check form-switch col-sm-4 col-md-4 mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={validateInfo.isCustomerOnSoftSuit}
                onChange={() =>
                  setValidateInfo({
                    ...validateInfo,
                    isCustomerOnSoftSuit: !validateInfo.isCustomerOnSoftSuit,
                  })
                }
              />
              <label className="form-check-label mx-3 checked">
                {validateInfo.isCustomerOnSoftSuit ? "Yes" : "No"}
              </label>
            </div>
          </p>

          <p className="decision-row  ">
            <span className=""> Customer Next of Kin is okay </span>
            <div className="form-check form-switch col-sm-4 col-md-4 mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={validateInfo.isCustomerNextOfKinOk}
                onChange={() =>
                  setValidateInfo({
                    ...validateInfo,
                    isCustomerNextOfKinOk: !validateInfo.isCustomerNextOfKinOk,
                  })
                }
              />
              <label className="form-check-label mx-3 checked">
                {validateInfo.isCustomerNextOfKinOk ? "Yes" : "No"}
              </label>
            </div>
          </p>

          <p className="decision-row  ">
            <span className="">Credit Bureau Check</span>{" "}
            <div className="form-check form-switch col-sm-4 col-md-4 mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={validateInfo.isCreditCheckOk}
                onChange={() =>
                  setValidateInfo({
                    ...validateInfo,
                    isCreditCheckOk: !validateInfo.isCreditCheckOk,
                  })
                }
              />
              <label className="form-check-label mx-3 checked">
                {validateInfo.isCreditCheckOk ? "Yes" : "No"}
              </label>
            </div>
          </p>

          <p className="decision-row  ">
            <span className=""> BVN Check</span>
            <div className="form-check form-switch col-sm-4 col-md-4 mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={validateInfo.isBvnCheckOk}
                onChange={() =>
                  setValidateInfo({
                    ...validateInfo,
                    isBvnCheckOk: !validateInfo.isBvnCheckOk,
                  })
                }
              />
              <label className="form-check-label mx-3 checked">
                {validateInfo.isBvnCheckOk ? "Yes" : "No"}
              </label>
            </div>
          </p>
        </div>

        {/* view data source */}
        <div className="justify-content-center pt-5 pb-5 view__dataSource ">
          <h4>View Data Source</h4>
          {/* <div className="row mt-4 decision-row">
            <p>
              BVN Search <span className="validBtn">12/08/2023</span>
            </p>

            <div className="col-sm-12 col-md-3">
              <button className="viewBtn">View Data</button>
            </div>
          </div> */}

          <div className="row mt-2 decision-row">
            <div>
              Credit DB Search{" "}
              {selectedCustomer?.creditCheck?.creditDbSearch?.updatedAt && (
                <span className="validBtn">
                  {selectedCustomer?.creditCheck?.creditDbSearch?.updatedAt}
                </span>
              )}
            </div>

            <div className="col-sm-12 col-md-3">
              <button className="viewBtn">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    selectedCustomer?.creditCheck?.creditDbSearch
                      ?.dbSearchReport
                  }
                >
                  View Data
                </a>
              </button>
            </div>
          </div>

          <div className="row mt-2 decision-row">
            <div>
              Deduct Search{" "}
              {selectedCustomer?.creditCheck?.deductCheck?.updatedAt && (
                <span className="validBtn">
                  {selectedCustomer?.creditCheck?.deductCheck?.updatedAt}
                </span>
              )}
            </div>

            <div className="col-sm-12 col-md-3">
              <button className="viewBtn">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    selectedCustomer?.creditCheck?.deductCheck
                      ?.deductSearchReport
                  }
                >
                  View Data
                </a>
              </button>
            </div>
          </div>

          <div className="row mt-2 decision-row">
            <div>
              Credit Bureau Search{" "}
              {selectedCustomer?.creditCheck?.creditBureauSearch?.updatedAt && (
                <span className="validBtn">
                  {selectedCustomer?.creditCheck?.creditBureauSearch?.updatedAt}
                </span>
              )}
            </div>

            <div className="col-sm-12 col-md-3">
              <button className="viewBtn">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    selectedCustomer?.creditCheck?.creditBureauSearch
                      ?.bureauSearchReport[0]
                  }
                >
                  View Data
                </a>
              </button>
            </div>
          </div>

          <div className="row mt-2 decision-row">
            <div>
              Payslip Analysis{" "}
              {selectedCustomer?.creditCheck?.paySlipAnalysis?.updatedAt && (
                <span className="validBtn">
                  {selectedCustomer?.creditCheck?.paySlipAnalysis?.updatedAt}
                </span>
              )}
            </div>

            <div className="col-sm-12 col-md-3">
              <button className="viewBtn">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    selectedCustomer?.creditCheck?.paySlipAnalysis
                      ?.uploadPaySlip
                  }
                >
                  View Data
                </a>
              </button>
            </div>
          </div>
          {/* 
          <div className="row mt-2 decision-row">
            <p>
              Decision Analysis <span className="validBtn">12/08/2023</span>
            </p>

            <div className="col-sm-12 col-md-3">
              <button className="viewBtn">View Data</button>
            </div>
          </div> */}
        </div>

        {/* Coment  */}
        <div id="comment">
          <div className="row my-3">
            <label htmlFor="netPay" className="col-form-label col-3 mt-2">
              Disbursement Instruction
            </label>
            <div className="col-6">
              <textarea
                onChange={(e) =>
                  setValidateInfo({
                    ...validateInfo,
                    disbursementInstruction: e.target.value,
                  })
                }
                className="form-control"
                id="netPay"
              ></textarea>
            </div>
          </div>
          <div className="row my-3">
            <label htmlFor="netPay" className="col-form-label col-3 mt-2">
              Credit officer Review
            </label>
            <div className="col-6">
              <textarea
                onChange={(e) =>
                  setValidateInfo({
                    ...validateInfo,
                    creditOfficerReview: e.target.value,
                  })
                }
                className="form-control"
                id="netPay"
              ></textarea>
            </div>
          </div>
        </div>

        <div>
          {selectedCustomer?.creditCheck?.decisionSummary
            ?.creditOfficerApprovalStatus == customerApprovalEnum.pending ? (
            <div className=" row mx-5 align-items-center">
              <div className="validBtnBox">
                <button
                  onClick={handleApproveCustomer}
                  type="button"
                  className="btn btn-primary mt-3"
                >
                  {isLoading ? <PageLoader width="16px" /> : "Approve"}
                </button>
                <button type="button" className="btn btn-danger mt-3">
                  Declined
                </button>
              </div>
            </div>
          ) : (
            <div className="already__approved">
              Customer has been approved by Credit Officer
            </div>
          )}
        </div>

        {selectedCustomer?.creditCheck?.decisionSummary
          ?.creditOfficerApprovalStatus === customerApprovalEnum.approved && (
          <div className="row mt-4 ">
            <p className="cooApprove ">
              Approval by:{" "}
              {selectedCustomer?.decisionSummary?.headOfCreditApprovalStatus
                ? "COO"
                : "Head of Credit"}{" "}
              (<span className="figure">Pending</span>)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

DecisionSummary.propTypes = {
  customerId: PropTypes.string,
};

export default DecisionSummary;
