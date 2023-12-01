/* eslint-disable no-undef */
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
// formik and yup for form data management
import { Formik, Form, Field } from "formik";
import validationSchema from "./formvalidation";
import initialValues from "./formInitialValue";
// fetch data from api
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../../redux/reducers/productReducer";
import { fetchEmployers } from "../../../redux/reducers/employersManagerReducer";
import Headline from "../../shared/Headline";
import TextInput from "./formcomponents/TextInput";
import "./Form.css";
import calculatorfunc from "../../shared/calculatorfunc";
// import idpRedirect from "./bvnIDPAuth"
import bvnVerification from "./bvnVerification";

// loan form component
const LoanFirstStep = ({ data }) => {
  // fetch loan product
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProduct());
    dispatch(fetchEmployers());
  }, [dispatch]);

  const loanProducts = useSelector(
    (state) => state.productReducer.products.products
  );

  // get loan amount and career type from loan home
  const loanamount = data?.loanamount;
  const careertype = data?.careertype;
  const [noofmonth, setNoofmonth] = useState(1);
  const [currentLoanAmount, setCurrentLoanAmount] = useState(
    parseInt(loanamount)
  );
  const [interestResult, setInterestResult] = useState(0);

  const [step, setStep] = useState(1);
  const [stepImg, setStepImg] = useState("images/step1.png");

  // get current formik value
  const ref = useRef();

    
  // scroll to the top of the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // calculate interest rate
  const [loanRepaymentTotal, setLoanRepaymentTotal] = useState(0);
  const [monthlyRepayment, setMonthlyRepayment] = useState(0);

  const calculateRepayment = () => {
    // get product id from formik values
    const productId = ref.current?.values.loanproduct;
    const noOfMonths = ref.current?.values.numberofmonth;
    setNoofmonth(noOfMonths);

    // find product
      const product = loanProducts?.find((product) => product._id === productId);
      
    // get interest rate
    const loanRate = product?.interestRate;

    // calculator loan amount
    const loanCal = calculatorfunc(
      parseInt(currentLoanAmount),
      noofmonth * 30,
      loanRate
    );
    setInterestResult(loanCal);
  };

  useEffect(() => {
    calculateRepayment();
  }, [noofmonth, currentLoanAmount]);

  const loanTotal = parseInt(currentLoanAmount) + interestResult;
  const monthlyPay = (loanTotal / parseInt(noofmonth)).toFixed();
  // update repayment
  useEffect(() => {
    setLoanRepaymentTotal(loanTotal);
    setMonthlyRepayment(monthlyPay);
  }, [loanTotal, monthlyPay]);

  // handle next step, check validation schema and move to next step
  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      setStepImg("images/step2.png");
    }
  };

    // send data to redux store
    const productId = ref.current?.values.loanproduct;
    const product = loanProducts?.find((product) => product._id === productId);
    console.log(product)
    const startData = {
        loanamount,
        careertype,
        noofmonth,
        loanRepaymentTotal,
        monthlyRepayment,
        product
  };
  // handle bvn verification
    const handleBvnVerification = () => {
        // store startData to local storage
  
    localStorage.setItem("startData", JSON.stringify(startData));
    dispatch(addData(startData));
    // idpRedirect();
    bvnVerification();
  };

  const loanStartData = useSelector((state) => state.startData);
  console.log(loanStartData);
  return (
    <div className="container-fluid FormContainer">
      <div>
        {/* formik form */}
        <div>
          <Formik
            initialValues={initialValues(loanamount, careertype)}
            validationSchema={validationSchema}
            //   onSubmit={handleSubmit}
            innerRef={ref}
            encType="multipart/form-data"
          >
            {({ isSubmitting, values }) => (
              <>
                <div className="container">
                  <div className="row">
                    {/* left loan form section */}
                    <div className="col-sm-12 col-md-8 FormInputBox">
                      <Form>
                        {/* loan first step section */}
                        {step === 1 && (
                          <>
                            <div id="Step1">
                              <Headline
                                spacer="12px 0"
                                color="#000"
                                text="Select loan amount and duration"
                              />
                              <Headline
                                spacer="0"
                                fontSize="16px"
                                text="This is required to process this application"
                              />
                              <img
                                src="images/naira.png"
                                alt=""
                                className="NairaI"
                              />
                              <div>
                                <label htmlFor="loanamount">
                                  How much you want to borrow
                                </label>
                                <Field
                                  type="text"
                                  name="loanamount"
                                  className="TextInput"
                                  value={currentLoanAmount}
                                  onChange={(e) =>
                                    setCurrentLoanAmount(e.target.value)
                                  }
                                />
                                {currentLoanAmount === "" ? (
                                  <p className="ErrorMsg">Required</p>
                                ) : null}
                                {parseInt(currentLoanAmount) < 10000 ||
                                parseInt(currentLoanAmount) > 2000000 ? (
                                  <p className="ErrorMsg">
                                    Enter loan amount between 10000 to 2000000
                                    Naira only
                                  </p>
                                ) : null}
                              </div>

                              {/* repayments months */}
                              <div>
                                <TextInput
                                  label="Enter Number of Repayment Months"
                                  name="numberofmonth"
                                  type="number"
                                />
                              </div>

                              {/* loan product */}
                              <div>
                                <label htmlFor="loanproduct">
                                  Select Loan Product
                                </label>
                                {/* select loan product list */}
                                <Field
                                  as="select"
                                  name="loanproduct"
                                  className="TextInput"
                                >
                                  <option value=""></option>
                                  {loanProducts?.map((product) => (
                                    <option
                                      key={product._id}
                                      value={product._id}
                                    >
                                      {product.productName}
                                    </option>
                                  ))}
                                </Field>
                              </div>
                              {/* calculate repayment btn */}
                              <div className="ButtonContainer">
                                <button
                                  type="button"
                                  onClick={calculateRepayment}
                                  className="BtnAction BtnSecondary"
                                >
                                  Calculate Repayment
                                </button>
                              </div>

                              {/* loan cal result */}
                              <div className="LoanCal">
                                <Headline
                                  fontSize="22px"
                                  align="left"
                                  text="Loan:"
                                />
                                <h4>
                                  <span className="CalNaira">
                                    <img src="images/naira.png" alt="" />
                                  </span>
                                  {loanTotal || loanamount} <span> for </span>
                                  {noofmonth}
                                  {noofmonth > 1 ? (
                                    <span> months</span>
                                  ) : (
                                    <span> month</span>
                                  )}
                                </h4>
                                <Headline
                                  fontSize="22px"
                                  align="left"
                                  text="Monthly Repayment:"
                                />
                                <h4>
                                  <span className="CalNaira">
                                    <img src="images/naira.png" alt="" />
                                  </span>

                                  {isNaN(monthlyPay) ? 0 : monthlyPay}
                                </h4>
                              </div>
                              <div className="Purpose">
                                <Headline
                                  fontSize="24px"
                                  spacer="28px 0 0 0"
                                  align="left"
                                  color="#000"
                                  text="Purpose of Loan"
                                />

                                <div className="CheckboxContainer">
                                  <label className="CheckboxGroup">
                                    <Field
                                      type="checkbox"
                                      name="loanpurpose"
                                      value="school fees"
                                    />
                                    School Fees
                                  </label>
                                  <label className="CheckboxGroup">
                                    <Field
                                      type="checkbox"
                                      name="loanpurpose"
                                      value="business support"
                                    />
                                    Business Support
                                  </label>
                                  <label className="CheckboxGroup">
                                    <Field
                                      type="checkbox"
                                      name="loanpurpose"
                                      value="travel"
                                    />
                                    Travel
                                  </label>
                                </div>
                                <div className="CheckboxContainer">
                                  <label className="CheckboxGroup">
                                    <Field
                                      type="checkbox"
                                      name="loanpurpose"
                                      value="car"
                                    />
                                    Car
                                  </label>
                                  <label className="CheckboxGroup">
                                    <Field
                                      type="checkbox"
                                      name="loanpurpose"
                                      value="personal"
                                    />
                                    Personal
                                  </label>
                                  <label className="CheckboxGroup">
                                    <Field type="checkbox" name="other" />
                                    Other
                                  </label>
                                </div>
                                {values.other && (
                                  <div>
                                    <TextInput
                                      label="Please specify"
                                      name="otherpurpose"
                                      type="text"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* next form page btn */}
                            <div className="ButtonContainer">
                              <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleNext}
                                className="BtnAction BtnSecondary"
                              >
                                Next
                              </button>
                            </div>
                          </>
                        )}

                        {/* customer details section */}
                        {step === 2 && (
                          <>
                            <div id="Step2">
                              <Headline
                                spacer="12px 0"
                                color="#000"
                                text="Start your application process"
                              />
                              <div id="BvnVarification">
                                <TextInput
                                  label="Please enter your BVN to proceed"
                                  name="bvnnumber"
                                  type="text"
                                />
                                <div className="ButtonContainer">
                                  <button
                                    className="BtnAction BtnPrimary"
                                    type="button"
                                    onClick={handleBvnVerification}
                                  >
                                    Verify your BVN
                                  </button>
                                </div>
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
              </>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

LoanFirstStep.propTypes = {
  data: PropTypes.shape({
    careertype: PropTypes.any,
    loanamount: PropTypes.any,
  }),
};
export default LoanFirstStep;
