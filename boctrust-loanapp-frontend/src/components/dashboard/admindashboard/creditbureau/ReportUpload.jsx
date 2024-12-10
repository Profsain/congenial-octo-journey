import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import ReportTypeSelect from "./atoms/ReportTypeSelect";
import CreditBureauSelect from "./atoms/CreditBureauSelect";
import ReportReasonSelect from "./atoms/ReportReasonSelect";
import PageLoader from "../../shared/PageLoader";

const ReportUpload = ({ customerId, setIsReportUploaded }) => {
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const [bureauData, setBureauData] = useState({
    bureauName: "",
    reportType: "",
    reportReason: "",
  });

  const [reportOptions, setReportOptions] = useState([]);
  const [reportFile, setReportFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleBureauDataChange = (e) => {
    const { name, value } = e.target;
    setBureauData({ ...bureauData, [name]: value });
  };

  // clear the file input field
  const clearFileInput = () => {
    setReportFile(null);
    // clear file input field
    document.getElementById("inputGroupFile01").value = "";
    setBureauData({
      bureauName: "",
      reportType: "",
      reportReason: "",
    });
  };

  const creditBureauOptions = [
    { value: "first_central", label: "First Central" },
    { value: "crc_bureau", label: "CRC" },
    { value: "credit_register", label: "Credit Registry" },
    // Add more options as needed
  ];

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

  // handle upload
  const handleCreditBureauReportUpload = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setUploading(true);

    // Create FormData object
    const formData = new FormData();
    formData.append("bureauName", bureauData.bureauName);
    formData.append("reportType", bureauData.reportType);
    formData.append("reportReason", bureauData.reportReason);
    formData.append("bureauSearchReport", reportFile);

    // Helper function to handle API requests
    const uploadReport = async (url, method) => {
      try {
        const response = await fetch(url, {
          method: method,
          body: formData,
        });

        if (!response.ok) {
          console.error("Upload failed:", response.statusText);
          throw new Error("Failed to upload the report");
        }

        toast.success("Report uploaded successfully!");
        setIsReportUploaded(true);

        // Clear the file input field
        clearFileInput();
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error(error.message || "Something Went Wrong");
      }
    };

    // Check the selected bureau and handle the upload
    try {
      if (bureauData.bureauName === "first_central") {
        console.log("First central upload");

        // Upload report for first_central
        const url = `${apiUrl}/api/updatecustomer/creditBureauSearch/${customerId}/fileupload`;
        await uploadReport(url, "PUT");
      } else if (bureauData.bureauName === "crc_bureau") {
        console.log("CRC report upload");

        // Upload report for crc_bureau
        const url = `${apiUrl}/api/updatecustomer/creditBureauSearch/${customerId}/fileupload`;
        await uploadReport(url, "PUT");
      } else if (bureauData.bureauName === "credit_register") {
        console.log("Credit registry report upload");

        // Upload report for credit_register
        const url = `${apiUrl}/api/updatecustomer/creditBureauSearch/${customerId}/fileupload`;
        await uploadReport(url, "PUT");
      } else {
        toast.error("Wrong file upload. Try again!");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(error?.message || "Something Went Wrong");
    } finally {
      setUploading(false); // Reset the uploading state
    }
  };

  return (
    <div
      // onSubmit={handleCreditBureauReportUpload} // Use function reference directly
      encType="multipart/form-data" // Necessary for file uploads
    >
      <div className="bureau__fileUploadRow">
        <CreditBureauSelect
          bureauName={bureauData.bureauName}
          creditBureauOptions={creditBureauOptions}
          handleBureauDataChange={handleBureauDataChange}
        />

        <ReportTypeSelect
          reportType={bureauData.reportType}
          reportOptions={reportOptions}
          handleBureauDataChange={handleBureauDataChange}
        />
        <ReportReasonSelect
          handleBureauDataChange={handleBureauDataChange}
          reportReason={bureauData.reportReason}
        />
      </div>

      {/* File upload */}
      <div className="row">
        <label
          className="col-form-label fileUpload__label"
          htmlFor="inputGroupFile01"
        >
          Upload Specific Report with the selected properties
        </label>
        <div className="input-group">
          <input
            type="file"
            className="form-control uploadBureaFile"
            id="inputGroupFile01"
            onChange={(e) => setReportFile(e.target.files[0])} // Update state with the file
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="row mx-md-5 align-items-center">
        {uploading && <PageLoader width="34px" />}
        <button
          type="button"
          className="btn btn-warning mt-3"
          disabled={!reportFile || uploading}
          onClick={handleCreditBureauReportUpload}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default ReportUpload;