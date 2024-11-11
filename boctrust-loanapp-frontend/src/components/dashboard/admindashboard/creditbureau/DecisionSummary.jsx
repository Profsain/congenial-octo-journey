import { useEffect, useState } from "react";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import "./Credit.css";
import PropTypes from "prop-types";
import { fetchSingleCustomer } from "../../../../redux/reducers/customerReducer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { format, formatDistance } from "date-fns";
import PageLoader from "../../shared/PageLoader";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";
import { customerApprovalEnum } from "../../../../lib/userRelated";
import apiClient from "../../../../lib/axios";
import { VscDebugStart } from "react-icons/vsc";
import { AiFillStop } from "react-icons/ai";

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
  const [approvalStatus, setApprovalStatus] = useState({
    creditOfficerApprovalStatus: false,
    headOfCreditApprovalStatus: false,
    cooApprovalStatus: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { selectedCustomer } = useSelector((state) => state.customerReducer);

  // current login superAdmin user
  const currentUser = useSelector((state) => state.adminAuth.user);

  useEffect(() => {
    const getData = async () => {
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
          Number(selectedCustomer?.creditCheck?.paySlipAnalysis?.netPay) *
          percentageIndex
        ).toFixed(2),
        totalMonthlyDeductions:
          selectedCustomer?.creditCheck?.paySlipAnalysis?.extraLenders.reduce(
            (acc, curr) => acc + Number(curr.deductions),
            0
          ),
      });

      setValidateInfo({
        isCustomerOnSoftSuit:
          selectedCustomer?.creditCheck?.decisionSummary?.isCustomerOnSoftSuit,
        isCustomerNextOfKinOk:
          selectedCustomer?.creditCheck?.decisionSummary?.isCustomerNextOfKinOk,
        isCreditCheckOk:
          selectedCustomer?.creditCheck?.decisionSummary?.isCreditCheckOk,
        isBvnCheckOk:
          selectedCustomer?.creditCheck?.decisionSummary?.isBvnCheckOk,
        disbursementInstruction:
          selectedCustomer?.creditCheck?.decisionSummary
            ?.disbursementInstruction,
        creditOfficerReview:
          selectedCustomer?.creditCheck?.decisionSummary?.creditOfficerReview,
      });

      setApprovalStatus({
        cooApprovalStatus:
          selectedCustomer?.creditCheck?.decisionSummary?.cooApprovalStatus,
        creditOfficerApprovalStatus:
          selectedCustomer?.creditCheck?.decisionSummary
            ?.creditOfficerApprovalStatus,
        headOfCreditApprovalStatus:
          selectedCustomer?.creditCheck?.decisionSummary
            ?.headOfCreditApprovalStatus,
      });
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (!decisionSummaryInfo) return;
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
  }, [decisionSummaryInfo, selectedCustomer]);

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
      if (
        approvalStatus.creditOfficerApprovalStatus ==
        customerApprovalEnum.pending
      ) {
        await apiClient.put(
          `/updatecustomer/approve/co/${customerId}`,
          requestObj
        );
      } else if (
        approvalStatus.headOfCreditApprovalStatus ==
        customerApprovalEnum.pending
      ) {
        await apiClient.put(`/updatecustomer/approve/hoc/${customerId}`);
      } else if (
        approvalStatus.cooApprovalStatus == customerApprovalEnum.pending
      ) {
        await apiClient.put(`/updatecustomer/approve/coo/${customerId}`);
      }
      await dispatch(fetchSingleCustomer(customerId));
      toast.success("Customer Approval Success");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something Went Wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfCurrentAdminHasApproved = () => {
    if (
      approvalStatus.creditOfficerApprovalStatus ==
        customerApprovalEnum.pending &&
      currentUser.userRole.can.includes("approveCreditAssesment")
    ) {
      return false;
    } else if (
      approvalStatus.headOfCreditApprovalStatus ==
        customerApprovalEnum.pending &&
      currentUser.userRole.can.includes("headOfCreditApproval")
    ) {
      return false;
    } else if (
      approvalStatus.cooApprovalStatus == customerApprovalEnum.pending &&
      currentUser.userRole.can.includes("cooApproval")
    ) {
      return false;
    }

    return true;
  };
  const checkIfCurrentAdminShouldApproved = () => {
    if (currentUser.userRole.value === "super_admin") {
      return true;
    } else if (
      approvalStatus.creditOfficerApprovalStatus ==
        customerApprovalEnum.pending &&
      currentUser.userRole.can.includes("headOfCreditApproval")
    ) {
      return false;
    } else if (
      approvalStatus.headOfCreditApprovalStatus ==
        customerApprovalEnum.pending &&
      currentUser.userRole.can.includes("cooApproval")
    ) {
      return false;
    }

    return true;
  };

  return (
    <div className="TransContainer RBox">
      <div className=" d-flex justify-content-center mt-3 mb-4">
        <h4>Decision Summary</h4>
      </div>

      <div className="mx-1">
        <p className="row">
          <span className="col-7"> Customer&apos;s Net pay is </span>
          <span className="figure col-5">
            {nigerianCurrencyFormat.format(
              selectedCustomer?.creditCheck?.paySlipAnalysis?.netPay
            )}
          </span>
        </p>
        <p className="row">
          <span className="col-7"> 45% of Customer&apos;s Net pay is </span>
          <span className="figure col-5">
            {nigerianCurrencyFormat.format(
              decisionSummaryInfo?.maxAmountLendable
            )}
          </span>
        </p>
        <p className="row">
          <span className="col-7"> Monthy Repayment</span>{" "}
          <span className="figure col-5">
            {nigerianCurrencyFormat.format(
              selectedCustomer?.creditCheck?.paySlipAnalysis
                ?.monthlyLoanRepayment
            )}
          </span>
        </p>
        <p className="row">
          <span className="col-7"> Total Monthy Deductions</span>{" "}
          <span className="figure col-5">
            {decisionSummaryInfo?.totalMonthlyDeductions}
          </span>
        </p>
        <p className="row">
          <span className="col-7">
            If Loan is approved, customer&apos;s Take Home is{" "}
          </span>
          <div className="col-5">
            <span className="figure">
              {nigerianCurrencyFormat.format(
                decisionSummaryInfo?.maxAmountLendable -
                  decisionSummaryInfo?.totalMonthlyDeductions
              )}
            </span>{" "}
            which is{" "}
            <span className="figure">
              {(
                ((decisionSummaryInfo?.maxAmountLendable -
                  decisionSummaryInfo?.totalMonthlyDeductions) *
                  100) /
                selectedCustomer?.creditCheck?.paySlipAnalysis?.netPay
              ).toFixed(2)}
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
            <div className="form-check d-flex form-switch col-sm-4 mt-4">
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
            <div className="form-check d-flex form-switch col-sm-4 col-md-4 mt-4">
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
              <label className="form-check-label  mx-3 checked">
                {validateInfo.isCustomerNextOfKinOk ? "Yes" : "No"}
              </label>
            </div>
          </p>

          <p className="decision-row  ">
            <span className="">Credit Bureau Check</span>{" "}
            <div className="form-check form-switch d-flex col-sm-4 col-md-4 mt-4">
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
              <label className="form-check-label  mx-3 checked">
                {validateInfo.isCreditCheckOk ? "Yes" : "No"}
              </label>
            </div>
          </p>

          <p className="decision-row  ">
            <span className=""> BVN Check</span>
            <div className="form-check form-switch d-flex col-sm-4 col-md-4 mt-4">
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
              <label className="form-check-label  mx-3 checked">
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
                  {format(
                    selectedCustomer?.creditCheck?.creditDbSearch?.updatedAt,
                    "MMM dd, HH:mm"
                  )}
                </span>
              )}
            </div>

            <div className="col-sm-12 col-md-6">
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
          <hr />

          <div className="row mt-2 decision-row">
            <div>
              Deduct Search{" "}
              {selectedCustomer?.creditCheck?.deductCheck?.updatedAt && (
                <span className="validBtn">
                  {format(
                    selectedCustomer?.creditCheck?.deductCheck?.updatedAt,
                    "MMM dd, HH:mm"
                  )}
                </span>
              )}
            </div>

            <div className="col-sm-12 col-md-6">
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
          <hr />

          <div className=" mt-2">
            <div>Credit Bureau Search </div>

            {selectedCustomer?.creditCheck?.creditBureauSearch &&
              selectedCustomer?.creditCheck?.creditBureauSearch.map((item) => (
                <div key={item?._id}>
                  {item?.bureauDate ? (
                    <div className="row ml-4 decision-row">
                      <div className="d-flex gap-2 mt-3 align-items-center">
                        <h6>{item?.bureauName}</h6>
                        <span className="validBtn">
                          {format(item?.bureauDate, "MMM dd")}
                        </span>
                      </div>
                      <div className="col-sm-12 col-md-6">
                        <button className="viewBtn">
                          <a
                            target="_blank"
                            rel="noreferrer"
                            href={item?.bureauSearchReport}
                          >
                            View Data
                          </a>
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
          </div>
          <hr />

          <div className="row mt-2 decision-row">
            <div>
              Payslip Analysis{" "}
              {selectedCustomer?.creditCheck?.paySlipAnalysis?.updatedAt && (
                <span className="validBtn">
                  {format(
                    selectedCustomer?.creditCheck?.paySlipAnalysis?.updatedAt,
                    "MMM dd, HH:mm"
                  )}
                </span>
              )}
            </div>

            <div className="col-sm-12 col-md-6">
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
                value={validateInfo.disbursementInstruction}
                id="netPay"
                disabled={
                  approvalStatus.creditOfficerApprovalStatus !==
                  customerApprovalEnum.pending
                }
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
                value={validateInfo.creditOfficerReview}
                disabled={
                  approvalStatus.creditOfficerApprovalStatus !==
                  customerApprovalEnum.pending
                }
                id="netPay"
              ></textarea>
            </div>
          </div>
        </div>

        <div>
          {checkIfCurrentAdminShouldApproved() &&
          !checkIfCurrentAdminHasApproved() ? (
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
              <p> Customer has been approved by Credit Officer</p>
              {selectedCustomer?.creditCheck.assignment.updatedAt &&
                selectedCustomer?.creditCheck?.decisionSummary
                  .creditOfficerApprovedAt && (
                  <div>
                    <div className="d-flex justify-content-center gap-4">
                      <p
                        style={{
                          fontSize: "1rem",
                        }}
                      >
                        <VscDebugStart color="green" />{" "}
                        {format(
                          new Date(
                            selectedCustomer?.creditCheck.assignment.updatedAt
                          ),
                          "dd/LL/yyyy, hh:mm aaa"
                        )}
                      </p>
                      <p
                        style={{
                          fontSize: "1rem",
                        }}
                      >
                        <AiFillStop color="red" />{" "}
                        {format(
                          new Date(
                            selectedCustomer?.creditCheck?.decisionSummary.creditOfficerApprovedAt
                          ),
                          "dd/LL/yyyy, hh:mm aaa"
                        )}
                      </p>
                    </div>
                    <p className="d-flex gap-2 justify-content-center">
                      <b>Duration:</b>

                      {formatDistance(
                        new Date(
                          selectedCustomer?.creditCheck.assignment.updatedAt
                        ),
                        new Date(
                          selectedCustomer?.creditCheck?.decisionSummary.creditOfficerApprovedAt
                        )
                      )}
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>

        {selectedCustomer?.creditCheck?.decisionSummary
          ?.creditOfficerApprovalStatus === customerApprovalEnum.approved && (
          <div className="row mt-4 ">
            <p className="cooApprove ">
              Approval:{" "}
              {approvalStatus.headOfCreditApprovalStatus ===
              customerApprovalEnum.pending ? (
                <span>
                  Head of Credit <span className="figure">(Pending)</span>
                </span>
              ) : approvalStatus.cooApprovalStatus ===
                customerApprovalEnum.pending ? (
                <span>
                  by COO<span className="figure">(Pending)</span>
                </span>
              ) : (
                "Completed"
              )}
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
