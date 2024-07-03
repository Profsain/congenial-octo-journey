import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import "./Credit.css";
import PaySlipAnalysis from "./PaySlipAnalysis";
import DecisionSummary from "./DecisionSummary";
import PdfDocument from "../../../shared/PdfDocument";
import PageLoader from "../../shared/PageLoader";

import FirstCentralPdfReport from "./firstCentralPdfReport";
import FirstCentralCommercialPdf from "./FirstCentralCommercialPdf";
import CRCBasicReportPDF from "./CRCBasicReportPDF";
import CRCCooporateReport from "./CRCCooporateReport";
import { toast, ToastContainer } from "react-toastify";

// toast styles
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";

import { fetchSingleCustomer } from "../../../../redux/reducers/customerReducer";

const creditBureauOptions = [
  { value: "first_central", label: "First Central" },
  { value: "crc_bureau", label: "CRC" },
  { value: "credit_register", label: "Credit Registry" },
  // Add more options as needed
];

const apiUrl = import.meta.env.VITE_BASE_URL;

const searchTypes = [
  { value: "defaulters", label: "Defaulters" },
  { value: "request", label: "Request" },
  { value: "issuance", label: "Issuance" },
  // Add more options as needed
];

const CreditCheckhtmlForm = ({ setShowCreditCheckForm, customerId }) => {
  const [reportOptions, setReportOptions] = useState([
    { value: "", label: "Choose..." },
  ]);

  const [isCreditDbCheck, setIsCreditDbCheck] = useState(false);
  const [searchType, setSearchType] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [searchByDeduct, setSearchByDeduct] = useState("");
  const [applicantNameDeduct, setApplicantNameDeduct] = useState("");
  const [searchDateDeduct, setSearchDateDeduct] = useState("");
  const [remarksDeduct, setRemarksDeduct] = useState("");
  const [reportObj, setReportObj] = useState({});
  const [reportTitle, setReportTitle] = useState("");
  const [dbSearchReport, setDbSearchReport] = useState("");

  const [isDeductCheck, setIsDeductCheck] = useState(false);
  const [deductSearchReport, setDeductSearchReport] = useState("");
  const [bureauSearchReport, setBureauSearchReport] = useState({
    firstUpload: "",
    secondUpload: "",
  });
  const [noReport, setNoReport] = useState(false);
  const [noCRC, setNoCRC] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  // PaySlip form state
  const [formState, setFormState] = useState({
    netPay: "",
    numOfExtraLenders: 0,
    extraLenders: [],
    monthlyLoanRepayment: 0,
    dateOfBirth: "",
    dateOfAppointment: "",
    uploadPaySlip: "",
    benchmark: 0,
  });

  // {
  //   extraLenderName: "",
  //   extraLenderDeduction: 0,
  // },

  const [reportConfirmation, setReportConfirmation] = useState({
    isApplicantCivilianPolice: false,
    isPaySlipContainsMoreThenFiveLenders: false,
    monthlyDeductionBelowPercentageBenchmark: false,
    takeHomePayNotLessThanBenchmark: false,
    takeHomePayNotLessThan20PercentGross: false,
    netPayNotLessThanBenchmark: false,
  });

  const dispatch = useDispatch();

  const { selectedCustomer, customerApprovalEnum } = useSelector(
    (state) => state.customerReducer
  );

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
      setReportConfirmation({
        isApplicantCivilianPolice:
          selectedCustomer?.paySlipAnalysis?.isApplicantCivilianPolice || false,
        isPaySlipContainsMoreThenFiveLenders:
          selectedCustomer?.paySlipAnalysis
            ?.isPaySlipContainsMoreThenFiveLenders || false,
        monthlyDeductionBelowPercentageBenchmark:
          selectedCustomer?.paySlipAnalysis
            ?.monthlyDeductionBelowPercentageBenchmark || false,
        netPayNotLessThanBenchmark:
          selectedCustomer?.paySlipAnalysis?.netPayNotLessThanBenchmark ||
          false,
        takeHomePayNotLessThan20PercentGross:
          selectedCustomer?.paySlipAnalysis
            ?.takeHomePayNotLessThan20PercentGross || false,
        takeHomePayNotLessThanBenchmark:
          selectedCustomer?.paySlipAnalysis?.takeHomePayNotLessThanBenchmark ||
          false,
      });

      setFormState({
        netPay: selectedCustomer?.paySlipAnalysis?.netPay || "",
        numOfExtraLenders:
          selectedCustomer?.paySlipAnalysis?.numOfExtraLenders || 0,
        extraLenders: selectedCustomer?.paySlipAnalysis?.extraLenders || [],
        monthlyLoanRepayment:
          selectedCustomer?.paySlipAnalysis?.monthlyLoanRepayment || 0,
        dateOfBirth: selectedCustomer?.paySlipAnalysis?.dateOfBirth || "",
        dateOfAppointment:
          selectedCustomer?.paySlipAnalysis?.dateOfAppointment || "",
        uploadPaySlip: selectedCustomer?.paySlipAnalysis?.uploadPaySlip || "",
        benchmark: selectedCustomer?.paySlipAnalysis?.benchmark || 0,
      });

      setDbSearchReport(
        selectedCustomer?.creditCheck?.creditDbSearch?.dbSearchReport || ""
      );
      setDeductSearchReport(
        selectedCustomer?.creditCheck?.deductCheck?.deductSearchReport || ""
      );
      setBureauSearchReport(
        selectedCustomer?.bureauSearchReport?.creditCheck
          ?.creditBureauResult || {
          firstUpload: "",
          secondUpload: "",
        }
      );
    }
  }, []);

  const handleChange = () => {
    setIsCreditDbCheck(!isCreditDbCheck);
  };
  const handleDbChange = () => {
    setIsDeductCheck(!isDeductCheck);
  };

  //  Toast Notifications callback
  const notify = (msg) => {
    toast.error(msg, {
      position: "bottom-right",
    });
  };

  // handle file update
  const handleFileUpdate = async () => {
    setIsUpdateLoading(true);

    try {
      const formData = new FormData();

      if (isCreditDbCheck) {
        formData.append("dbSearchReport", dbSearchReport);
        await fetch(
          `${apiUrl}/api/updatecustomer/creditDbSearch/${customerId}`,
          {
            method: "PUT",
            enctype: "multipart/form-data",
            body: formData,
          }
        );
        setDbSearchReport("");
        setIsCreditDbCheck(false);
      }
      if (isDeductCheck) {
        formData.append("deductSearchReport", deductSearchReport);
        await fetch(`${apiUrl}/api/updatecustomer/deductcheck/${customerId}`, {
          method: "PUT",
          enctype: "multipart/form-data",
          body: formData,
        });
        setDeductSearchReport("");
        setIsDeductCheck(false);
      }
      if (bureauSearchReport.firstUpload || bureauSearchReport.secondUpload) {
        bureauSearchReport.firstUpload &&
          formData.append(
            "bureauSearchReport1",
            bureauSearchReport?.firstUpload
          );
        bureauSearchReport.secondUpload &&
          formData.append(
            "bureauSearchReport2",
            bureauSearchReport?.secondUpload
          );
        await fetch(
          `${apiUrl}/api/updatecustomer/creditBureauSearch/${customerId}`,
          {
            method: "PUT",
            enctype: "multipart/form-data",
            body: formData,
          }
        );
        setBureauSearchReport({
          firstUpload: "",
          secondUpload: "",
        });
      } else if (
        !bureauSearchReport.firstUpload ||
        !bureauSearchReport.secondUpload
      ) {
        notify("Please Provide at Least one Bureau search report");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdateLoading(false);
    }
  };

  // clear report
  const clearReport = () => {
    setReportObj({});
    setFirstCentralReport({});
    setFirstCentralCommercialReport({});
    setPDFContent("");
    setBureauReport("");

    setCrcCooporateReport("");
  };
  // clear form fields
  const clearForm = () => {
    setSearchType("");
    setSearchBy("");
    setApplicantName("");
    setSearchDate("");
    setRemarks("");
    setReportTitle("");
    setDbSearchReport("");
  };

  // handle Credit DB check
  const handleDbCheck = async (e) => {
    e.preventDefault();

    const searchReport = {
      searchType,
      searchBy,
      searchDate,
      remarks,
      dbSearchReport,
      isCreditDbCheck,
    };
    // setDbSearchReport(dbSearchReport);
    // generate pdf and download
    setReportTitle(() => "Credit DB Check Report");
    const pdfReport = {
      reportTitle,
      applicantName,
      searchType: searchType,
      searchBy: searchBy,
      searchDate: searchDate,
      remarks: remarks,
    };
    setReportObj(pdfReport);

    // send update to backend
    await fetch(`${apiUrl}/api/updatecustomer/creditDbSearch/${customerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(searchReport),
    });

    clearForm();
  };

  // handle deduct DB check
  const handleDeductCheck = async (e) => {
    e.preventDefault();

    const searchReport = {
      searchByDeduct,
      searchDateDeduct,
      remarksDeduct,
      deductSearchReport,
      isDeductCheck,
    };

    // setDbSearchReport(dbSearchReport);
    // generate pdf and download
    setReportTitle(() => "Deduct Check Report");
    const pdfReport = {
      reportTitle,
      applicantName: applicantNameDeduct,
      searchType: "Deduct Check",
      searchBy: searchByDeduct,
      searchDate: searchDateDeduct,
      remarks: remarksDeduct,
    };
    setReportObj(pdfReport);

    // send update to backend
    await fetch(`${apiUrl}/api/updatecustomer/deductcheck/${customerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(searchReport),
    });

    // clear form fields
    setSearchByDeduct("");
    setApplicantNameDeduct("");
    setRemarksDeduct("");
    setSearchDateDeduct("");
    setReportTitle("");
  };

  // credit bureau check logic
  const [bureauData, setBureauData] = useState({
    bureauName: "",
    bvnNo: "",
    reportType: "",
    reportReason: "",
    bureauDate: "",
  });

  const handleBureauDataChange = (e) => {
    const { name, value } = e.target;
    setBureauData({ ...bureauData, [name]: value });
  };

  const [bureauReport, setBureauReport] = useState(""); // crc basic report
  const [crcCooporateReport, setCrcCooporateReport] = useState("");
  const [crcTitle, setCrcTitle] = useState("");
  const [bureauLoading, setBureauLoading] = useState(false);
  const [firstCentralReport, setFirstCentralReport] = useState([]);
  const [firstCentralCommercialReport, setFirstCentralCommercialReport] =
    useState([]);

  const [PDFContent, setPDFContent] = useState("");

  const [successMsg, setSuccessMsg] = useState("");

  // update report type options
  useEffect(() => {
    if (bureauData.bureauName === "first_central") {
      setReportOptions([
        { value: "consumer_report", label: "Consumer Report" },
        { value: "commercial_report", label: "Commercial Report" },
      ]);
    } else if (bureauData.bureauName === "crc_bureau") {
      setReportOptions([
        { value: "consumer_basic", label: "Consumer Basic Report" },
        { value: "consumer_classic", label: "Consumer Classic Report" },
        { value: "corporate_classic", label: "Corporate Classic Report" },
      ]);
    } else if (bureauData.bureauName === "credit_register") {
      setReportOptions([
        { value: "consumer_report", label: "Consumer Report" },
      ]);
    }
  }, [bureauData.bureauName]);

  const handleBureauCheck = async (e) => {
    e.preventDefault();
    setBureauLoading(true);
    if (bureauData.bureauName === "first_central") {
      clearReport();

      const reportType = bureauData.reportType;
      const apiEndpoint =
        reportType === "consumer_report"
          ? `${apiUrl}/api/firstcentral/firstcentralreport`
          : `${apiUrl}/api/firstcentral/firstcentralCommercialReport`;
      try {
        const bvn = bureauData.bvnNo;
        const response = await fetch(`${apiEndpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bvn }),
        });
        if (!response.ok) {
          setBureauLoading(false);
          setNoReport(true);
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setBureauLoading(false);
        // set first central report
        if (reportType === "consumer_report") {
          // clear report
          setFirstCentralCommercialReport([]);
          setFirstCentralReport(data.data);
        } else {
          // clear report
          setFirstCentralReport([]);
          setFirstCentralCommercialReport(data.data);
        }

        // set bureau loading
        // updateBureauLoading("success");
      } catch (error) {
        setBureauLoading(false);
        throw new Error(error.message);
      }
    }

    if (bureauData.bureauName === "crc_bureau") {
      clearReport();
      const reportType = bureauData.reportType;
      const apiEndpoint =
        reportType === "consumer_basic"
          ? `${apiUrl}/api/crc/getcrc`
          : reportType === "consumer_classic"
          ? `${apiUrl}/api/crc/getcrcclassic`
          : `${apiUrl}/api/crc/getcrccooporate`;

      try {
        const bvn = bureauData.bvnNo;
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bvn }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        // set  report
        if (reportType === "consumer_basic") {
          clearReport();
          setBureauReport(data.data.ConsumerSearchResultResponse);
          setCrcTitle("Consumer Basic Report");
        } else if (reportType === "consumer_classic") {
          clearReport();
          // setCrcClassicReport(data.data.ConsumerSearchResultResponse);
          setBureauReport(data.data.ConsumerSearchResultResponse);
          setCrcTitle("Consumer Classic Report");
        } else {
          clearReport();
          setCrcCooporateReport(data.data.CommercialSearchResultResponse);
        }

        // set bureau loading
        setBureauLoading(false);
        // updateBureauLoading("success");
      } catch (error) {
        setBureauLoading(false);
        setNoCRC(false);
        throw new Error(error.message);
      }
    }

    if (bureauData.bureauName === "credit_register") {
      clearReport();
      try {
        const bvn = bureauData.bvnNo;
        const response = await fetch(`${apiUrl}/api/creditregistry/getreport`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bvn }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        // set  report
        setPDFContent(data.data.Reports[0].PDFContent);

        // set bureau loading
        setBureauLoading(false);
        // updateBureauLoading("success");
        setSuccessMsg("Report generated successfully");

        // set success message to empty string after 5 seconds
        setTimeout(() => {
          setSuccessMsg("");
        }, 5000);
      } catch (error) {
        setBureauLoading(false);
        throw new Error(error.message);
      }
    }
  };

  // submit Paylslip form data to backend
  const uploadPaySlipAnalysis = async () => {
    setIsUpdateLoading(true);

    try {
      if (!selectedCustomer) return;

      const actualNetPay = selectedCustomer?.buyoverloanactivated
        ? selectedCustomer?.liquidationbalance + formState.netPay
        : formState.netPay;

      const formData = new FormData(); // create a new FormData object
      formData.append("netPay", actualNetPay); // add the fields to formData

      formData.append(
        "extraLenders",
        JSON.stringify(
          formState.extraLenders.map((item) => ({
            name: item.name,
            deductions: item.deductions,
          }))
        )
      );
      formData.append("monthlyLoanRepayment", formState.monthlyLoanRepayment);
      formData.append("dateOfBirth", formState.dateOfBirth);
      formData.append("dateOfAppointment", formState.dateOfAppointment);
      formData.append(
        "isApplicantCivilianPolice",
        reportConfirmation.isApplicantCivilianPolice
      );
      formData.append("uploadPaySlip", formState.uploadPaySlip);
      formData.append(
        "isPaySlipContainsMoreThenFiveLenders",
        reportConfirmation.isPaySlipContainsMoreThenFiveLenders
      );
      formData.append("benchmark", formState.benchmark);
      formData.append(
        "monthlyDeductionBelowPercentageBenchmark",
        reportConfirmation.monthlyDeductionBelowPercentageBenchmark
      );
      formData.append(
        "takeHomePayNotLessThanBenchmark",
        reportConfirmation.takeHomePayNotLessThanBenchmark
      );
      formData.append(
        "takeHomePayNotLessThan20PercentGross",
        reportConfirmation.takeHomePayNotLessThan20PercentGross
      );
      formData.append(
        "netPayNotLessThanBenchmark",
        reportConfirmation.netPayNotLessThanBenchmark
      );

      // send formData object to backend
      await fetch(
        `${apiUrl}/api/updatecustomer/paySlipAnalysis/${customerId}`,
        {
          method: "PUT",
          enctype: "multipart/form-data",
          body: formData,
        }
      );

      // clear form fields
      setFormState({
        netPay: "",
        numOfExtraLenders: 0,
        extraLenders: [],
        monthlyLoanRepayment: 0,
        dateOfBirth: "",
        dateOfAppointment: "",
        uploadPaySlip: "",
        benchmark: 0,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdateLoading(false);
    }
  };

  // handle next prev form step start
  const [formStep, setFormStep] = useState(1);
  const handleNext = async () => {
    if (formStep === 1) {
      if (!bureauSearchReport.firstUpload && !bureauSearchReport.secondUpload) {
        return notify("Please Provide at Least one Bureau search report");
      }

      await handleFileUpdate();
      setFormStep(2);
    } else if (formStep === 2) {
      if (!formState.uploadPaySlip) {
        return notify("Please Provide a Payslip");
      }
      if (!formState.netPay || !formState.monthlyLoanRepayment) {
        return notify("Please Provide a Valid Netpay and Monthly Repayment");
      }

      await uploadPaySlipAnalysis();
      setFormStep(3);
    } else {
      setFormStep(3);
    }
  };

  const handlePrev = () => {
    if (formStep === 2) {
      setFormStep(1);
    } else if (formStep === 3) {
      setFormStep(2);
    } else {
      setFormStep(1);
    }
  };

  // scroll to the top of the page
  useEffect(() => {
    // eslint-disable-next-line no-undef
    window.scrollTo(0, 0);
  }, [formStep]);

  return (
    <>
      {formStep === 1 && (
        <div className="TransContainer RBox">
          {/* step 1 */}
          <div className="row">
            {/* credit DB check */}
            <div className="col-sm-12 mb-5 col-md-4">
              <h6 className="creditTitle">Do Credit DB Check</h6>
              <form onSubmit={handleDbCheck}>
                <div className="row mb-3">
                  <label htmlFor="searchType" className="col-form-label">
                    Choose Search Type
                  </label>
                  <div>
                    <select
                      id="searchType"
                      className="form-select"
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                    >
                      <option selected>Choose...</option>
                      {searchTypes.map((searchType) => (
                        <option key={searchType.value} value={searchType.value}>
                          {searchType.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="searchInput" className="col-form-label">
                    IPPIS, BVN, or Phone No
                  </label>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      value={searchBy}
                      onChange={(e) => setSearchBy(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="searchInput" className="col-form-label">
                    Applicant Full-name
                  </label>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="dSearchDate" className="col-form-label">
                    Search Date
                  </label>
                  <div>
                    <input
                      type="date"
                      className="form-control"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row my-3">
                  <label htmlFor="netPay" className="col-form-label">
                    Remarks
                  </label>
                  <div>
                    <textarea
                      className="form-control"
                      id="netPay"
                      placeholder="Enter remarks here..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="row mx-md-5 align-items-center">
                  <button type="submit" className="btn btn-warning mt-3">
                    Generate Manual Report
                  </button>
                </div>
              </form>
            </div>

            {/* deduct check */}
            <div className="col-sm-12 mb-5 col-md-4 midBorder">
              <h6 className="creditTitle">Do Deduct Check</h6>
              <form onSubmit={handleDeductCheck}>
                <div className="row mb-3">
                  <label htmlFor="dSearchInput" className="col-form-label">
                    IPPIS
                  </label>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      value={searchByDeduct}
                      onChange={(e) => setSearchByDeduct(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="searchInput" className="col-form-label">
                    Applicant Full-name
                  </label>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      value={applicantNameDeduct}
                      onChange={(e) => setApplicantNameDeduct(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="dSearchDate" className="col-form-label">
                    Search Date
                  </label>
                  <div>
                    <input
                      type="date"
                      className="form-control"
                      value={searchDateDeduct}
                      onChange={(e) => setSearchDateDeduct(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row my-3">
                  <label htmlFor="netPay" className="col-form-label">
                    Remarks
                  </label>
                  <div>
                    <textarea
                      className="form-control"
                      id="netPay"
                      placeholder="Enter remarks here..."
                      value={remarksDeduct}
                      onChange={(e) => setRemarksDeduct(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="row mx-md-5 align-items-center">
                  <button type="submit" className="btn btn-warning mt-3">
                    Generate Manual Report
                  </button>
                </div>
              </form>
            </div>

            {/* credit bureau check */}
            <div className="col-sm-12 mb-sm-5 col-md-4">
              <h6 className="creditTitle">Do Credit Bureau Check</h6>
              <form onSubmit={handleBureauCheck}>
                <div className="row mb-3">
                  <label htmlFor="searchType" className="col-form-label">
                    Select Credit Bureau
                  </label>
                  <div>
                    <select
                      id="searchType"
                      className="form-select"
                      name="bureauName"
                      value={bureauData.bureauName}
                      onChange={handleBureauDataChange}
                    >
                      <option selected>Choose...</option>
                      {creditBureauOptions.map((creditBureauOption) => (
                        <option
                          key={creditBureauOption.value}
                          value={creditBureauOption.value}
                        >
                          {creditBureauOption.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <label htmlFor="dSearchInput" className="col-form-label">
                    BVN | Business Name | RC. NO
                  </label>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      name="bvnNo"
                      value={bureauData.bvnNo}
                      onChange={handleBureauDataChange}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label htmlFor="reportType" className="col-form-label">
                    Select Report Type
                  </label>
                  <div>
                    <select
                      id="reportType"
                      className="form-select"
                      name="reportType"
                      value={bureauData.reportType}
                      onChange={handleBureauDataChange}
                    >
                      <option selected>Choose...</option>
                      {reportOptions.map((reportOption) => (
                        <option
                          key={reportOption.value}
                          value={reportOption.value}
                        >
                          {reportOption.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <label htmlFor="reportReason" className="col-form-label">
                    Reason of Report
                  </label>
                  <div>
                    <select
                      id="reportReason"
                      className="form-select"
                      name="reportReason"
                      value={bureauData.reportReason}
                      onChange={handleBureauDataChange}
                    >
                      <option selected>Choose...</option>
                      <option value="credit">Credit Report</option>
                      <option value="kyc">KYC</option>
                    </select>
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="dSearchInput" className="col-form-label">
                    Search Date
                  </label>
                  <div>
                    <input
                      type="date"
                      className="form-control"
                      name="bureauDate"
                      value={bureauData.bureauDate}
                      onChange={handleBureauDataChange}
                    />
                  </div>
                </div>

                <div className="row mx-md-5 align-items-center">
                  <button type="submit" className="btn btn-warning mt-3">
                    Generate Report
                  </button>
                </div>
              </form>
            </div>

            {/* loading bar */}
            <div>{bureauLoading && <PageLoader />}</div>
            {/* success message */}
            <p style={{ color: "#ecaa00" }}>{successMsg}</p>
          </div>

          <div className="row m-5">
            {/* generated pdf report component */}
            {Object.keys(reportObj).length > 0 && (
              <PdfDocument report={reportObj} />
            )}
          </div>

          {/* first centra render */}
          <div className="row m-5">
            {noReport && <h4>No First Central Report</h4>}
            {/* generated pdf report component */}

            {firstCentralReport?.length > 0 && (
              <FirstCentralPdfReport report={firstCentralReport} />
            )}
            {Object.keys(firstCentralCommercialReport).length > 0 && (
              <FirstCentralCommercialPdf
                report={firstCentralCommercialReport}
              />
            )}
          </div>

          {/* crc render report */}
          <div className="row m-5">
            {noCRC && <h4>No CRC Report</h4>}
            {/* generated pdf report component */}
            {bureauReport && (
              <CRCBasicReportPDF
                report={bureauReport}
                formData={bureauData}
                title={crcTitle}
              />
            )}

            {crcCooporateReport && (
              <CRCCooporateReport
                report={crcCooporateReport}
                formData={bureauData}
              />
            )}
          </div>

          {/* credit registry report */}
          <div className="row" style={{ width: "100vw" }}>
            {PDFContent && (
              <div style={{ width: "80%", height: "100vh" }}>
                <h3>Credit Registry Report</h3>
                <embed
                  src={`data:application/pdf;base64,${PDFContent}`}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            )}
          </div>

          {/* attach report */}
          <div className="row">
            <h4>Upload Reports</h4>
            <form encType="multipart/form-data">
              <div className="row reportRow">
                <div className="col-sm-8 col-md-4">
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckChecked"
                  >
                    Is there a Credit DB Report?
                  </label>
                </div>

                <div className="form-check form-switch col-sm-4 col-md-2 mt-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={isCreditDbCheck}
                    onChange={handleChange}
                  />
                  <label className="form-check-label mx-3 checked">
                    {isCreditDbCheck ? "Yes" : "No"}
                  </label>
                </div>
                <div className="col-sm-12 col-md-6 mt-2">
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setDbSearchReport(e.target.files[0])}
                    />
                  </div>
                </div>
              </div>

              <div className="row reportRow">
                <div className="col-sm-8 col-md-4">
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckChecked"
                  >
                    Is there a Deduct Report?
                  </label>
                </div>

                <div className="form-check form-switch col-sm-4 col-md-2 mt-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={isDeductCheck}
                    onChange={handleDbChange}
                  />
                  <label className="form-check-label mx-3 checked">
                    {isDeductCheck ? "Yes" : "No"}
                  </label>
                </div>
                <div className="col-sm-12 col-md-6 mt-2">
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setDeductSearchReport(e.target.files[0])}
                    />
                  </div>
                </div>
              </div>

              <div className="row reportRow">
                <div className="col-sm-8 col-md-4">
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckChecked"
                  >
                    Please Provide at leat one Credit Bureau Report
                  </label>
                </div>

                <div className="form-check form-switch col-sm-4 col-md-2 mt-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={true}
                    readOnly
                  />
                  <label
                    style={{ fontSize: "0.6rem" }}
                    className="form-check-label text-danger mx-3 checked"
                  >
                    **required
                  </label>
                </div>
                <div className="col-sm-12 col-md-6 mt-2">
                  <div className="d-flex flex-column gap-2">
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control"
                        id="inputGroupFile01"
                        onChange={(e) =>
                          setBureauSearchReport({
                            ...bureauSearchReport,
                            firstUpload: e.target.files[0],
                          })
                        }
                      />
                    </div>
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control"
                        id="inputGroupFile01"
                        onChange={(e) =>
                          setBureauSearchReport({
                            ...bureauSearchReport,
                            secondUpload: e.target.files[0],
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="row mx-5 align-items-center">
                <div className="col-sm-12 col-md-3"></div>
                {isUpdateLoading ? (
                  <PageLoader width="34px" />
                ) : (
                  <button
                    type="submit"
                    className="btn btn-warning mt-3 col-sm-12 col-md-6"
                  >
                    Update Report
                  </button>
                )}

                <div className="col-sm-12 col-md-3"></div>
              </div> */}
            </form>
          </div>
        </div>
      )}
      {/* pay slip analysis component */}
      {formStep === 2 && (
        <PaySlipAnalysis
          customerId={customerId}
          formState={formState}
          setFormState={setFormState}
          reportConfirmation={reportConfirmation}
          setReportConfirmation={setReportConfirmation}
        />
      )}
      {/* decision summary */}{" "}
      {formStep === 3 && <DecisionSummary customerId={customerId} />}
      {/* next prev button */}
      <div className="row d-flex justify-content-center">
        <button className="btn btn-warning btn-prev" onClick={handlePrev}>
          Prev
        </button>
        {selectedCustomer?.creditCheck.decisionSummary
          .creditOfficerApprovalStatus === customerApprovalEnum.pending ? (
          <button className="btn btn-primary btn-next" onClick={handleNext}>
            {isUpdateLoading ? <PageLoader width="16px" /> : "Next"}
          </button>
        ) : (
          <button
            onClick={() => setShowCreditCheckForm(false)}
            className="btn btn-success btn-next"
          >
            Process Completed
          </button>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

CreditCheckhtmlForm.propTypes = {
  customerId: PropTypes.string,
  setShowCreditCheckForm: PropTypes.func,
};

export default CreditCheckhtmlForm;
