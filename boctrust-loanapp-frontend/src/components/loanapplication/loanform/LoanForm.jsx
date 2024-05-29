/* eslint-disable no-undef */
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
// fetch data from api
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../../redux/reducers/productReducer";
import { fetchEmployers } from "../../../redux/reducers/employersManagerReducer";
// formik and yup for form data management
import { Formik, Form, Field } from "formik";
import validationSchema from "./formvalidation";
// state and lga
import NaijaStates from "naija-state-local-government";
import Headline from "../../shared/Headline";
import TextInput from "./formcomponents/TextInput";
import SelectField from "./formcomponents/SelectField";
import "./Form.css";
import PhotoCapture from "./photocapture/PhotoCapture";
import ConfirmData from "./ConfirmData";
import CreateAccount from "./CreateAccount";
import initialValues from "./formInitialValue";
// function
import convertFile from "../../../../utilities/convertFile";
import dataURItoBlob from "../../../../utilities/dataURItoBlob";
import generateCustomerId from "../../dashboard/admindashboard/customers/generateCustomerId";
import ReconfirmBvn from "./ReconfirmBvn";
import fetchAllBanks from "./fetchBanks";
import { getBvnDetails } from "./bvnVerification";

// loan form component
const LoanForm = () => {
  // Function to initialize the bvn details extraction after redirect to clallback url
  const initializeApp = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const code = urlSearchParams.get("code");

    if (code) {
      getBvnDetails(); // Call this function if there's an authorization code in the URL
    } else {
      // Optionally, handle other initialization tasks here
      console.log("No authorization code found. Proceed with the normal flow.");
    }
  };

  // Call the initializeApp function when the window loads
  window.onload = initializeApp;

  // fetch loan product
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProduct());
    dispatch(fetchEmployers());
  }, [dispatch]);

  const employers = useSelector(
    (state) => state.employersManagerReducer.employers.employers
  );

  // get start data from local storage
  const [loanamount, setLoanAmount] = useState("");
  const [careertype, setCareerType] = useState("");
  const [noofmonth, setNoOfMonth] = useState("");
  const [loanRepaymentTotal, setLoanRepaymentTotal] = useState("");
  const [monthlyRepayment, setMonthlyRepayment] = useState("");
  const [product, setProduct] = useState({});
  const [bvn, setBvn] = useState("");
  const [showReconfirmBvn, setShowReconfirmBvn] = useState(false);
  const [firstStepData, setFirstStepData] = useState({});
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    // set showReconfirmBvn modal after 30 seconds
    const timer = setTimeout(() => {
      setShowReconfirmBvn(true);
    }, 30000);

    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, []);

  // fetch first form data here
  useEffect(() => {
    if (firstStepData) {
      setBvn(firstStepData.bvn || "");
      setLoanAmount(firstStepData.loanAmount || "");
      setCareerType(firstStepData.careerType || "");
      setNoOfMonth(firstStepData.numberOfMonths || "");
      setLoanRepaymentTotal(firstStepData.loanTotalRepayment || "");
      setMonthlyRepayment(firstStepData.monthlyRepayment || "");
      setProduct(firstStepData.loanProduct || {});
    }
  }, [firstStepData]);

  // fetch all commercial banks
  const [banks, setBanks] = useState([]);
  useEffect(() => {
    fetchAllBanks(setBanks);
  }, []);

  const [step, setStep] = useState(1);
  const [showForm, setShowForm] = useState(true);
  const [stepImg, setStepImg] = useState("https://i.imgur.com/DPMDjLy.png");
  const [state, setState] = useState("");
  const [lga, setLga] = useState([]);

  // file upload
  const [captureImg, setCaptureImg] = useState("");
  const [idCard, setIdCard] = useState("");
  const [paySlip, setPaySlip] = useState("");
  const [employmentLetter, setEmploymentLetter] = useState("");
  const [signature, setSignature] = useState("");

  // scroll to the top of the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step, showForm]);

  // update photocapture value when captureImg change
  useEffect(() => {
    if (captureImg) {
      ref.current?.setFieldValue("photocapture", captureImg);
    }

    ref.current?.setFieldValue("valididcard", idCard);
    ref.current?.setFieldValue("uploadpayslip", paySlip);
    ref.current?.setFieldValue("employmentletter", employmentLetter);
    ref.current?.setFieldValue("signature", signature);
  }, [captureImg, idCard, paySlip, employmentLetter, signature]);

  // get current formik value
  const ref = useRef();

  // state and lgas
  const ngState = NaijaStates.states();
  const lgas = lga.lgas;
  // handle select state
  const handleSelectState = (e) => {
    const state = e.target.value;
    setState(state);
    setLga(NaijaStates.lgas(state));
    // update state form value
    ref.current?.setFieldValue("stateofresidence", state);
  };

  // find employer using id
  const [employerId, setEmployerId] = useState("");

  const [employer, setEmployer] = useState({});
  const findEmployer = (id) => {
    const employer = employers.find((employer) => employer._id === id);
    return employer;
  };
  useEffect(() => {
    if (employerId) {
      setEmployer(findEmployer(employerId));
    }
  }, [employerId]);

  // handle form submit/move to next step
  const handleSubmit = async () => {
    // handle form submit to backend here
    try {
      if (ref.current.values) {
        const formValues = ref.current?.values;
        // set customerEmail
        setCustomerEmail(formValues.email);
        setCustomerName(formValues.firstname);

        const employer = employers.find(
          (employer) => employer._id === formValues.employername
        );
        // generate customer id
        const customerId = generateCustomerId();
        const formData = new FormData();
        formData.append("customerId", customerId);
        formData.append("loanamount", loanamount);
        formData.append("numberofmonth", noofmonth);
        formData.append("loantotalrepayment", loanRepaymentTotal);
        formData.append("monthlyrepayment", monthlyRepayment);
        formData.append("careertype", careertype);
        formData.append("loanproduct", product);
        formData.append("loanpurpose", formValues.loanpurpose);
        formData.append("otherpurpose", formValues.otherpurpose);
        formData.append("bvnnumber", bvn);
        formData.append("title", formValues.title);
        formData.append("firstname", formValues.firstname);
        formData.append("lastname", formValues.lastname);
        formData.append("phonenumber", formValues.phonenumber);
        formData.append("dob", formValues.dob);
        formData.append("email", formValues.email);
        formData.append("maritalstatus", formValues.maritalstatus);
        formData.append("noofdependent", formValues.noofdependent);
        formData.append("educationlevel", formValues.educationlevel);
        formData.append(
          "howdidyouhearaboutus",
          formValues.howdidyouhearaboutus
        );
        formData.append("houseaddress", formValues.houseaddress);
        formData.append("stateofresidence", formValues.stateofresidence);
        formData.append("lga", formValues.lga);
        formData.append("stateoforigin", formValues.stateoforigin);
        formData.append("ippis", formValues.ippis);
        formData.append("servicenumber", formValues.servicenumber);
        formData.append("valididcard", formValues.valididcard);
        formData.append("idcardnotinclude", formValues.idcardnotinclude);
        formData.append("nkinfirstname", formValues.nkinfirstname);
        formData.append("nkinlastname", formValues.nkinlastname);
        formData.append("nkinphonenumber", formValues.nkinphonenumber);
        formData.append("nkinrelationship", formValues.nkinrelationship);
        formData.append(
          "nkinresidentialaddress",
          formValues.nkinresidentialaddress
        );
        formData.append("employername", employer);
        formData.append("otheremployername", formValues.otheremployername);
        formData.append("employeraddress", formValues.employeraddress);
        formData.append("employmentstartdate", formValues.employmentstartdate);
        formData.append("employmentletter", formValues.employmentletter);
        formData.append("netmonthlyincome", formValues.netmonthlyincome);
        formData.append("totalannualincome", formValues.totalannualincome);
        formData.append("officialemail", formValues.officialemail);
        formData.append("uploadpayslip", formValues.uploadpayslip);

        // financial info
        formData.append("salarybankname", formValues.salarybankname);
        formData.append("salaryaccountnumber", formValues.salaryaccountnumber);
        formData.append("bankcode", formValues.bankcode);
        formData.append("sameasaboveaccount", formValues.sameasaboveaccount);
        formData.append(
          "disbursementbankname",
          formValues.disbursementbankname
        );
        formData.append(
          "disbursementaccountnumber",
          formValues.disbursementaccountnumber
        );
        formData.append("hasloan", formValues.hasloan);
        formData.append(
          "currentmonthlyplanrepaymentamount",
          formValues.currentmonthlyplanrepaymentamount
        );
        formData.append(
          "estimatedmonthlylivingexpense",
          formValues.estimatedmonthlylivingexpense
        );
        formData.append("buyoverloan", formValues.buyoverloan);
        formData.append("beneficiaryname", formValues.beneficiaryname);
        formData.append("beneficiarybank", formValues.beneficiarybank);
        formData.append(
          "beneficiaryaccountnumber",
          formValues.beneficiaryaccountnumber
        );
        formData.append("liquidationbalance", formValues.liquidationbalance);
        formData.append("deductions", formValues.deductions);
        formData.append("guarantee", formValues.guarantee);

        // agree and sign
        formData.append("acceptterms", formValues.acceptterms);
        formData.append("acceptpolicy", formValues.acceptpolicy);
        formData.append("sharemyremita", formValues.sharemyremita);
        formData.append("agreefullname", formValues.agreefullname);
        formData.append("agreedate", formValues.agreedate);
        formData.append("signature", formValues.signature);
        formData.append(
          "photocapture",
          dataURItoBlob(formValues.photocapture),
          "image.jpg"
        ); // Convert data URI to Blob
        formData.append("haveagent", formValues.haveagent);
        formData.append("agentname", formValues.agentname);
        formData.append("username", formValues.username);
        formData.append("password", formValues.password);
        formData.append("confirmpassword", formValues.confirmpassword);

        // send formData to database
        const apiUrl = import.meta.env.VITE_BASE_URL;
        await fetch(`${apiUrl}/api/customer/customer`, {
          method: "POST",
          mode: "cors",
          enctype: "multipart/form-data",
          body: formData,
        });
      }
    } catch (error) {
      console.log(error);
    }

    // setSubmitting(false);
  };

  // handle proceed to account creation
  const handleProceed = () => {
    const formContainer = document.querySelector(".FormContainer");
    formContainer.style.padding = "12px";
    setShowForm(false);
  };

  // todo: fetch banks and code
  // todo: make Bank code a selector for user to select

  // func to check if individual field is valid
  const isFieldValid = (fieldName, ref) => {
    const { isValid, errors } = ref.current;
    return isValid || !errors[fieldName];
  };

  // handle next step, check validation schema and move to next step
  const handleNext = () => {
    // Check that fields are valid
    if (
      isFieldValid("title", ref) &&
      isFieldValid("firstname", ref) &&
      isFieldValid("lastname", ref) &&
      isFieldValid("phonenumber", ref) &&
      isFieldValid("dob", ref) &&
      isFieldValid("email", ref) &&
      isFieldValid("maritalstatus", ref) &&
      isFieldValid("noofdependent", ref) &&
      isFieldValid("educationlevel", ref) &&
      isFieldValid("howdidyouhearaboutus", ref) &&
      isFieldValid("houseaddress", ref) &&
      isFieldValid("stateofresidence", ref) &&
      isFieldValid("lga", ref) &&
      isFieldValid("stateoforigin", ref) &&
      isFieldValid("nkinfirstname", ref) &&
      isFieldValid("nkinlastname", ref) &&
      isFieldValid("nkinphonenumber", ref) &&
      isFieldValid("nkinrelationship", ref) &&
      isFieldValid("nkinresidentialaddress", ref)
    ) {
      if (step === 1) {
        setStep(2);
        setStepImg("https://i.imgur.com/DPMDjLy.png");
      } else if (
        step === 2 &&
        isFieldValid("employername", ref) &&
        isFieldValid("employeraddress", ref) &&
        isFieldValid("employmentstartdate", ref) &&
        isFieldValid("netmonthlyincome", ref) &&
        isFieldValid("totalannualincome", ref) &&
        isFieldValid("officialemail", ref)
      ) {
        setStep(3);
        setStepImg("https://i.imgur.com/DPMDjLy.png");
      } else if (
        step === 3 &&
        isFieldValid("salarybankname", ref) &&
        isFieldValid("salaryaccountnumber", ref)
      ) {
        setStep(4);
        setStepImg("https://i.imgur.com/DPMDjLy.png");
      } else if (step === 4) {
        setStep(5);
        setStepImg("https://i.imgur.com/DPMDjLy.png");
      }
    } else {
      // console.log(ref.current)
      console.log("Input validation error");
    }
  };
  // handle previous step
  const handlePrevious = () => {
    if (step === 2) {
      setStep(1);
      setStepImg("https://i.imgur.com/mObbs26.png");
    } else if (step === 3) {
      setStep(2);
      setStepImg("https://i.imgur.com/mObbs26.png");
    } else if (step === 4) {
      setStep(3);
      setStepImg("https://i.imgur.com/kDbL3XN.png");
    } else if (step === 5) {
      setStep(4);
      setStepImg("https://i.imgur.com/SCIwWO7.png");
    }
  };

  return (
    <div className="container-fluid FormContainer">
      <div>
        {/* formik form */}
        <div>
          <Formik
            initialValues={initialValues(captureImg)}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            innerRef={ref}
            encType="multipart/form-data"
          >
            {({ isSubmitting, values }) => (
              <>
                {showForm ? (
                  <div className="container">
                    <div className="row">
                      {/* left loan form section */}
                      <div className="col-sm-12 col-md-8 FormInputBox">
                        <Form>
                          {/* loan first step section */}

                          {/* customer details section */}
                          {step === 1 && (
                            <>
                              <div id="Step2">
                                <Headline
                                  spacer="12px 0"
                                  color="#000"
                                  text="Start your application process"
                                />
                                <div>
                                  {/* customer details section */}
                                  <Headline
                                    spacer="12px 0"
                                    color="#000"
                                    text="Customer Details"
                                  />
                                  {/* dropdown list */}
                                  <SelectField label="Title" name="title">
                                    <option value=""></option>
                                    <option value="Mr">Mr</option>
                                    <option value="Mrs">Mrs</option>
                                    <option value="Miss">Miss</option>
                                    <option value="Dr">Dr</option>
                                  </SelectField>

                                  {/* Input row sectioin */}
                                  <div className="InputRow">
                                    <TextInput
                                      label="First Name"
                                      name="firstname"
                                      type="text"
                                    />
                                    <div className="Space"></div>
                                    <TextInput
                                      label="Last Name"
                                      name="lastname"
                                      type="text"
                                    />
                                  </div>

                                  <TextInput
                                    label="Phone Number"
                                    name="phonenumber"
                                    type="tel"
                                    placeholder="08012345678"
                                  />

                                  {/* Input row sectioin */}
                                  <div className="InputRow">
                                    <TextInput
                                      label="Date of Birth"
                                      name="dob"
                                      type="date"
                                    />
                                    <div className="Space"></div>
                                    <TextInput
                                      label="Email"
                                      name="email"
                                      type="email"
                                    />
                                  </div>

                                  {/* Input row sectioin */}
                                  <div className="InputRow">
                                    <SelectField
                                      label="Marital Status"
                                      name="maritalstatus"
                                    >
                                      <option value=""></option>
                                      <option value="single">Single</option>
                                      <option value="married">Married</option>
                                      <option value="divorced">Divorced</option>
                                      <option value="widowed">Widowed</option>
                                    </SelectField>
                                    <div className="Space"></div>
                                    <SelectField
                                      label="No of Dependents"
                                      name="noofdependent"
                                    >
                                      <option value=""></option>
                                      <option value="1">1</option>
                                      <option value="2">2</option>
                                      <option value="3">3</option>
                                      <option value="4">4</option>
                                      <option value="5">5</option>
                                      <option value="6">6</option>
                                      <option value="7">7</option>
                                      <option value="more than 7">
                                        More than 7
                                      </option>
                                    </SelectField>
                                  </div>

                                  {/* Input row sectioin */}
                                  <div className="InputRow">
                                    <SelectField
                                      label="Highest Level of Education"
                                      name="educationlevel"
                                    >
                                      <option value=""></option>
                                      <option value="primary">Primary</option>
                                      <option value="secondary">
                                        Secondary
                                      </option>
                                      <option value="tertiary">Tertiary</option>
                                      <option value="post graduate">
                                        Post Graduate
                                      </option>
                                    </SelectField>
                                    <div className="Space"></div>
                                    <SelectField
                                      label="How did you hear about us"
                                      name="howdidyouhearaboutus"
                                    >
                                      <option value=""></option>
                                      <option value="facebook">Facebook</option>
                                      <option value="instagram">
                                        Instagram
                                      </option>
                                      <option value="twitter">Twitter</option>
                                      <option value="linkedin">Linkedin</option>
                                      <option value="google">Google</option>
                                      <option value="friend">Friend</option>
                                      <option value="colleague">
                                        Colleague
                                      </option>
                                      <option value="agent">
                                        Buctrust Agent
                                      </option>
                                      <option value="other">Other</option>
                                    </SelectField>
                                  </div>

                                  {/* Input row sectioin */}
                                  <div className="InputRow">
                                    <SelectField
                                      label="State of Resident"
                                      name="stateofresidence"
                                      value={state}
                                      onChange={handleSelectState}
                                    >
                                      <option value=""></option>
                                      {ngState.map((state) => (
                                        <option key={state} value={state}>
                                          {state}
                                        </option>
                                      ))}
                                    </SelectField>

                                    <div className="Space"></div>
                                    <TextInput
                                      label="House Address"
                                      name="houseaddress"
                                      type="text"
                                    />
                                  </div>

                                  {/* Input row sectioin */}
                                  <div className="InputRow">
                                    <SelectField
                                      label="LGA of Resident"
                                      name="lga"
                                    >
                                      <option value=""></option>
                                      {lgas?.map((lga) => (
                                        <option key={lga} value={lga}>
                                          {lga}
                                        </option>
                                      ))}
                                    </SelectField>
                                    <div className="Space"></div>
                                    <SelectField
                                      label="State of Origin"
                                      name="stateoforigin"
                                    >
                                      <option value=""></option>
                                      {ngState.map((state) => (
                                        <option key={state} value={state}>
                                          {state}
                                        </option>
                                      ))}
                                    </SelectField>
                                  </div>

                                  {/* Staff ID card upload */}
                                  <div>
                                    {careertype.toLowerCase() ===
                                    "government employee" ? (
                                      <div>
                                        <div className="InputRow">
                                          <TextInput
                                            label="IPPIS Number"
                                            name="ippis"
                                            type="text"
                                          />
                                          <div className="Space"></div>
                                          <TextInput
                                            label="Service Number"
                                            name="servicenumber"
                                            type="text"
                                          />
                                        </div>

                                        {/* Input row sectioin */}
                                        <div className="FileUploadBox ">
                                          <Headline
                                            color="#000"
                                            fontSize="22px"
                                            text="Upload Staff ID Card"
                                          />
                                          <div>
                                            <input
                                              type="file"
                                              name="valididcard"
                                              accept="image/png, .jpg, .jpeg"
                                              className="UploadFile"
                                              onChange={(e) =>
                                                convertFile(e, setIdCard)
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="CheckboxGroup">
                                          <label className="CheckInput">
                                            <Field
                                              type="checkbox"
                                              name="idcardnotinclude"
                                            />
                                            My work ID card does not include my
                                            picture and signature
                                          </label>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="FileUploadBox ">
                                        <Headline
                                          color="#000"
                                          fontSize="22px"
                                          text="Upload Valid ID Card"
                                        />

                                        <input
                                          type="file"
                                          name="valididcard"
                                          accept="image/png, .svg, .jpg, .jpeg, .pdf"
                                          className="UploadFile"
                                          onChange={(e) =>
                                            convertFile(e, setIdCard)
                                          }
                                        />
                                      </div>
                                    )}
                                    <hr />
                                  </div>

                                  {/* Next off kin information */}
                                  <div className="NextOfKin">
                                    <Headline
                                      fontSize="24px"
                                      spacer="48px 0 0 0"
                                      align="left"
                                      color="#000"
                                      text="Next of Kin Information"
                                    />
                                    {/* Input row sectioin */}
                                    <div className="InputRow">
                                      <TextInput
                                        label="First Name"
                                        name="nkinfirstname"
                                        type="text"
                                      />
                                      <div className="Space"></div>
                                      <TextInput
                                        label="Last Name"
                                        name="nkinlastname"
                                        type="text"
                                      />
                                    </div>

                                    {/* Input row sectioin */}
                                    <div className="InputRow">
                                      <TextInput
                                        label="Phone Number"
                                        name="nkinphonenumber"
                                        type="tel"
                                      />
                                      <div className="Space"></div>
                                      <TextInput
                                        label="Residential Address"
                                        name="nkinresidentialaddress"
                                        type="text"
                                      />
                                    </div>
                                    {/* select relationship */}
                                    <SelectField
                                      label="Select Relationship"
                                      name="nkinrelationship"
                                    >
                                      <option value=""></option>
                                      <option value="father">Father</option>
                                      <option value="mother">Mother</option>
                                      <option value="brother">Brother</option>
                                      <option value="sister">Sister</option>
                                      <option value="husband">Husband</option>
                                      <option value="wife">Wife</option>
                                      <option value="son">Son</option>
                                      <option value="daughter">Daughter</option>
                                      <option value="uncle">Uncle</option>
                                      <option value="aunt">Aunt</option>
                                      <option value="nephew">Nephew</option>
                                      <option value="niece">Niece</option>
                                      <option value="cousin">Cousin</option>
                                      <option value="other">other</option>
                                    </SelectField>
                                  </div>

                                  <div className="ButtonContainer">
                                    <button
                                      type="button"
                                      onClick={handlePrevious}
                                      className="BtnAction BtnPrimary"
                                    >
                                      Previous
                                    </button>
                                    {/* next form page btn */}
                                    <button
                                      type="submit"
                                      onClick={handleNext}
                                      disabled={isSubmitting}
                                      className="BtnAction BtnSecondary"
                                    >
                                      Next
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}

                          {/* employer information */}
                          {step === 2 && (
                            <>
                              <div id="Step3">
                                <Headline
                                  spacer="12px 0"
                                  color="#000"
                                  text="Employer Details"
                                />
                                {/* to be change to dropdown list and input field */}

                                <div>
                                  {/* dropdown list */}
                                  <SelectField
                                    label="Employer Name"
                                    name="employername"
                                  >
                                    <option value=""></option>
                                    {employers?.map((employer) => {
                                      setEmployerId(
                                        ref.current?.values.employername
                                      );
                                      return (
                                        <option
                                          key={employer._id}
                                          value={employer._id}
                                        >
                                          {employer.employersName}
                                        </option>
                                      );
                                    })}
                                    <option value="other">Other</option>
                                  </SelectField>

                                  {/* type employer name if not in list */}
                                  {values.employername === "other" && (
                                    <TextInput
                                      label="Enter Employers Name"
                                      name="otheremployername"
                                      type="text"
                                      placeholder="Type employers name here"
                                    />
                                  )}
                                </div>
                                <TextInput
                                  label="Employer Address"
                                  name="employeraddress"
                                  type="text"
                                />

                                <TextInput
                                  label="Employment Start Date"
                                  name="employmentstartdate"
                                  type="date"
                                />

                                <TextInput
                                  label="Net Monthly Income"
                                  name="netmonthlyincome"
                                  type="text"
                                />

                                <TextInput
                                  label="Total Annual Income"
                                  name="totalannualincome"
                                  type="text"
                                />

                                <TextInput
                                  label="Official Email"
                                  name="officialemail"
                                  type="text"
                                />

                                {/* pay slip upload private employee*/}
                                {careertype.toLowerCase() ===
                                  "private employee" ||
                                (loanamount >
                                  employer?.statementRule?.maximumAmount &&
                                  noofmonth >
                                    employer?.statementRule?.maximumTenure.slice(
                                      0,
                                      3
                                    )) ? (
                                  <div className="FileUploadBox ">
                                    <Headline
                                      color="#000"
                                      fontSize="22px"
                                      text="Upload Pay Slip"
                                    />
                                    <input
                                      type="file"
                                      name="uploadpayslip"
                                      accept="image/png, .svg, .jpg, .jpeg"
                                      className="UploadFile"
                                      onChange={(e) =>
                                        convertFile(e, setPaySlip)
                                      }
                                    />
                                  </div>
                                ) : null}
                              </div>

                              <div className="ButtonContainer">
                                <button
                                  type="button"
                                  onClick={handlePrevious}
                                  className="BtnAction BtnPrimary"
                                >
                                  Previous
                                </button>
                                {/* next form page btn */}
                                <button
                                  type="button"
                                  onClick={handleNext}
                                  disabled={isSubmitting}
                                  className="BtnAction BtnSecondary"
                                >
                                  Next
                                </button>
                              </div>
                            </>
                          )}

                          {/* financial information */}
                          {step === 3 && (
                            <>
                              <div id="Step4">
                                <Headline
                                  spacer="12px 0"
                                  color="#000"
                                  text="Financial Information"
                                />
                                <div>
                                  <Headline
                                    align="left"
                                    fontSize="22px"
                                    spacer="35px 0 -16px 0"
                                    color="#000"
                                    text="Salary Account Details"
                                  />

                                  {/* Input row sectioin */}
                                  <div className="InputRow">
                                    <TextInput
                                      label="Bank Name"
                                      name="salarybankname"
                                      type="text"
                                    />
                                    <div className="Space"></div>
                                    <TextInput
                                      label="Account Number"
                                      name="salaryaccountnumber"
                                      type="text"
                                    />
                                  </div>
                                </div>

                                <div className="InputRow">
                                  <div>
                                    <Headline
                                      align="left"
                                      fontSize="22px"
                                      spacer="35px 0 -16px 0"
                                      color="#000"
                                      text="Disbursement Account Details"
                                    />
                                    <div className="CheckboxGroup">
                                      <label className="CheckInput">
                                        <Field
                                          type="checkbox"
                                          name="sameasaboveaccount"
      
                                        />
                                        Same as above
                                      </label>
                                    </div>
                                  </div>
                                  

                                  <div>
                                    {/* dropdown list */}
                                    <SelectField
                                      label="Bank code"
                                      name="bankcode"
                                    >
                                      <option value="">Select</option>
                                      <option value="000">No Bank</option>
                                      {banks.data?.map((bank) => {
                                        return (
                                          <option
                                            key={bank.ID}
                                            value={bank.Code}
                                          >
                                            {bank.Name}
                                          </option>
                                        );
                                      })}
                                    </SelectField>
                                  </div>
                                </div>

                                {!values.sameasaboveaccount && (
                                  <div className="InputRow">
                                    <TextInput
                                      label="Bank Name"
                                      name="disbursmentbankname"
                                      type="text"
                                    />
                                    <div className="Space"></div>
                                    <TextInput
                                      label="Account Number"
                                      name="disbursmentaccountnumber"
                                      type="text"
                                    />
                                  </div>
                                )}

                                <div id="ExistingLoan">
                                  <Headline
                                    align="left"
                                    fontSize="20px"
                                    spacer="28px 0 12px 0"
                                    color="#000"
                                    text="Do you have any existing loan?"
                                  />
                                  <div className="RadioRow">
                                    <div className="RadioField">
                                      <label>
                                        <Field
                                          type="radio"
                                          name="hasloan"
                                          value="yes"
                                        />
                                      </label>
                                      Yes
                                    </div>
                                    <div className="RadioField">
                                      <label>
                                        <Field
                                          type="radio"
                                          name="hasloan"
                                          value="no"
                                        />
                                      </label>
                                      No
                                    </div>
                                  </div>
                                  {values.hasloan === "yes" && (
                                    <div className="InputRow">
                                      <div>
                                        <img
                                          src="images/naira.png"
                                          alt=""
                                          className="NairaI FinNaira"
                                        />
                                        <TextInput
                                          label="Current monthly plan repayment amount"
                                          name="currentmonthlyplanrepaymentamount"
                                          type="text"
                                        />
                                      </div>
                                      <div className="Space"></div>
                                      <div>
                                        <img
                                          src="images/naira.png"
                                          alt=""
                                          className="NairaI
                                          FinNaira FinNaira2"
                                        />
                                        <TextInput
                                          label="Estimated monthly living expense"
                                          name="estimatedmonthlylivingexpense"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <Headline
                                    align="left"
                                    fontSize="22px"
                                    spacer="28px 0 12px 0"
                                    color="#000"
                                    text="Is this a Buy Over Loan?"
                                  />
                                  <div className="RadioRow">
                                    <div className="RadioField">
                                      <label>
                                        <Field
                                          type="radio"
                                          name="buyoverloan"
                                          value="yes"
                                        />
                                      </label>
                                      Yes
                                    </div>
                                    <div className="RadioField">
                                      <label>
                                        <Field
                                          type="radio"
                                          name="buyoverloan"
                                          value="no"
                                        />
                                      </label>
                                      No
                                    </div>
                                  </div>
                                </div>

                                {values.buyoverloan === "yes" ? (
                                  <div id="BuyBackLoan">
                                    {/* Input row sectioin */}
                                    <div className="InputRow">
                                      <TextInput
                                        label="Beneficiary Name"
                                        name="beneficiaryname"
                                        type="text"
                                      />
                                      <div className="Space"></div>
                                      <TextInput
                                        label="Bank Name"
                                        name="beneficiarybank"
                                        type="text"
                                      />
                                    </div>
                                    <div className="InputRow">
                                      <TextInput
                                        label="Account Number"
                                        name="beneficiaryaccountnumber"
                                        type="text"
                                      />
                                      <div className="Space"></div>
                                      <TextInput
                                        label="Liquidation Balance"
                                        name="liquidationbalance"
                                        type="text"
                                      />
                                    </div>
                                  </div>
                                ) : null}

                                <div id="Repayment">
                                  <Headline
                                    fontSize="22px"
                                    color="#000"
                                    align="left"
                                    text="Method of Loan Repayment"
                                  />
                                  <div className="DeductionFrom">
                                    <Headline
                                      fontSize="16px"
                                      color="#000"
                                      align="left"
                                      text="1.0 Loan against income/earnings"
                                    />
                                    {careertype.toLowerCase() ===
                                    "government employee" ? (
                                      <div>
                                        <div>
                                          <label>
                                            <Field
                                              type="radio"
                                              name="deductions"
                                              value="remita"
                                            />
                                          </label>
                                          Deduction from salary via Remita
                                          (Government employee)
                                        </div>
                                        <div>
                                          <label>
                                            <Field
                                              type="radio"
                                              name="deductions"
                                              value="ippis"
                                            />
                                          </label>
                                          Deduction from source via IPPIS
                                          (Government employee)
                                        </div>
                                      </div>
                                    ) : (
                                      <div>
                                        <label>
                                          <Field
                                            type="radio"
                                            name="deductions"
                                            value="cheque"
                                          />
                                        </label>
                                        Post-dated cheque or standing order
                                        (private employee or business owner)
                                      </div>
                                    )}
                                  </div>

                                  <div className="DeductionFrom">
                                    <Headline
                                      fontSize="16px"
                                      color="#000"
                                      align="left"
                                      text="2.0 Guarantee"
                                    />
                                    <div>
                                      <label>
                                        <Field
                                          type="radio"
                                          name="guarantee"
                                          value="guranteeofemployer"
                                        />
                                      </label>
                                      Guarantee of Employer
                                    </div>
                                    <div>
                                      <label>
                                        <Field
                                          type="radio"
                                          name="guarantee"
                                          value="individualguarantee"
                                        />
                                      </label>
                                      Individual Guarantee
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="ButtonContainer">
                                <button
                                  type="button"
                                  onClick={handlePrevious}
                                  className="BtnAction BtnPrimary"
                                >
                                  Previous
                                </button>
                                {/* next form page btn */}
                                <button
                                  type="button"
                                  onClick={handleNext}
                                  disabled={isSubmitting}
                                  className="BtnAction BtnSecondary"
                                >
                                  Next
                                </button>
                              </div>
                            </>
                          )}

                          {/* agree and sign */}
                          {step === 4 && (
                            <>
                              <div id="Step5">
                                <Headline
                                  spacer="12px 0"
                                  color="#000"
                                  text="Agree, Sign and Submit"
                                />
                                <div>
                                  <Headline
                                    align="left"
                                    fontSize="20px"
                                    spacer="12px 0"
                                    color="#000"
                                    text="Declaration & Agreement"
                                  />

                                  <div className="DeductionFrom">
                                    <div>
                                      <label>
                                        <Field
                                          type="checkbox"
                                          name="acceptterms"
                                        />
                                      </label>
                                      I have read and understand and accept the{" "}
                                      <a href="/terms" target="_blank">
                                        terms and condition
                                      </a>{" "}
                                      of this service.
                                    </div>
                                    <div>
                                      <label>
                                        <Field
                                          type="checkbox"
                                          name="acceptpolicy"
                                        />
                                      </label>
                                      I accept the{" "}
                                      <a href="/privacy">Privacy Policy</a>
                                    </div>
                                  </div>
                                  <div className="DeductionFrom">
                                    {/* {careertype.toLowerCase() ===
                                    "government employee" ? (
                                      <div>
                                        <label>
                                          <Field
                                            type="checkbox"
                                            name="sharemyremita"
                                          />
                                        </label>
                                        I agree to share my Remita data on this
                                        platform
                                      </div>
                                    ) : null} */}
                                  </div>

                                  {/* Input row sectioin */}
                                  <div className="InputRow">
                                    <TextInput
                                      label="Full Name"
                                      name="agreefullname"
                                      type="text"
                                    />
                                    <div className="Space"></div>
                                    <TextInput
                                      label="Date"
                                      name="agreedate"
                                      type="date"
                                    />
                                  </div>

                                  {/* have boctrust agent */}
                                  <div>
                                    <Headline
                                      align="left"
                                      fontSize="20px"
                                      spacer="12px 0"
                                      color="#000"
                                      text="Do you have a loan Officer?"
                                    />
                                    <div className="RadioRow">
                                      <div className="RadioField">
                                        <label>
                                          <Field
                                            type="radio"
                                            name="haveagent"
                                            value="yes"
                                          />
                                        </label>
                                        Yes
                                      </div>
                                      <div className="RadioField">
                                        <label>
                                          <Field
                                            type="radio"
                                            name="haveagent"
                                            value="no"
                                          />
                                        </label>
                                        No
                                      </div>
                                    </div>
                                    {values.haveagent === "yes" && (
                                      <TextInput
                                        label="Loan Officer's Name"
                                        name="agentname"
                                        type="text"
                                      />
                                    )}
                                  </div>
                                  <hr />
                                </div>

                                {/* signature upload */}
                                <div className="Signature">
                                  <div>
                                    <Headline
                                      spacer="14px 28px"
                                      fontSize="22px"
                                      text="Upload Signature (Sign on white paper)"
                                    />
                                  </div>
                                  <div>
                                    <input
                                      type="file"
                                      name="signature"
                                      accept="image/png, .svg, .jpg, .jpeg, .pdf"
                                      className="UploadFile"
                                      onChange={(e) =>
                                        convertFile(e, setSignature)
                                      }
                                    />
                                  </div>
                                </div>

                                {/* selfi photoshot */}
                                <div className="SelfiCon">
                                  <Headline
                                    color="#000"
                                    text="Confirm your Identity"
                                  />
                                  <div id="CapturePhoto">
                                    <PhotoCapture func={setCaptureImg} />
                                  </div>
                                  <Headline
                                    fontSize="16px"
                                    text="Your identification document will help us to validate your identity."
                                  />
                                </div>
                                <div className="ButtonContainer">
                                  <button
                                    type="button"
                                    onClick={handlePrevious}
                                    className="BtnAction BtnPrimary"
                                  >
                                    Previous
                                  </button>
                                  {/* next form page btn */}
                                  {!values.acceptterms ||
                                  !values.acceptpolicy ? (
                                    <button
                                      type="button"
                                      disabled={true}
                                      className="BtnAction btnDisabled"
                                    >
                                      Review
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={handleNext}
                                      disabled={isSubmitting}
                                      className="BtnAction BtnSecondary"
                                    >
                                      Review
                                    </button>
                                  )}
                                </div>
                              </div>
                            </>
                          )}

                          {/* review and proceed */}
                          {step === 5 && (
                            <>
                              <div id="Step6">
                                <Headline
                                  spacer="28px 0 48px 0"
                                  color="#000"
                                  text="Review your Application Details to Proceed"
                                />
                                <Headline
                                  spacer="18px 08px 0"
                                  color="#000"
                                  text="Click to edit any information you want to change"
                                  fontSize="12px"
                                  align="left"
                                />

                                <div>
                                  <ConfirmData career={careertype} />
                                </div>

                                <div className="ButtonContainer">
                                  {/* proceed btn */}
                                  <button
                                    type="button"
                                    onClick={handleProceed}
                                    className="BtnAction BtnSecondary"
                                  >
                                    Proceed
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </Form>
                      </div>

                      {/* right loan step section */}
                      <div className="col-sm-12 col-md-4 Step">
                        <img src={stepImg} alt={step} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="CreateAccount">
                    <CreateAccount
                      handleSubmit={handleSubmit}
                      phoneNumber={ref.current?.values.phonenumber}
                      customerEmail={customerEmail}
                      customerName={customerName}
                    />
                  </div>
                )}
              </>
            )}
          </Formik>
        </div>
      </div>

      {/*  reconfirm modal */}
      {/* {showReconfirmBvn && (
        <ReconfirmBvn
          show={showReconfirmBvn}
          setShow={setShowReconfirmBvn}
          setFirstStepData={setFirstStepData}
        />
      )} */}
    </div>
  );
};

LoanForm.propTypes = {
  data: PropTypes.any,
};

export default LoanForm;
