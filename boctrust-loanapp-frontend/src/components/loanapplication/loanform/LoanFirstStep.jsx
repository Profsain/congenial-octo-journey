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
import Headline from "../../shared/Headline";
import TextInput from "./formcomponents/TextInput";
// import LoanForm from "./LoanForm";
import "./Form.css";
import calculatorfunc from "../../shared/calculatorfunc";

// bvn verification function
import { bvnVerification } from "./bvnVerification";

// loan form component
const LoanFirstStep = ({ data }) => {
  // fetch loan product
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProduct());
  }, [dispatch]);

  const loanProducts = useSelector(
    (state) => state.productReducer.products.products
  );

  // get loan amount and career type from loan home
  const loanamount = data?.loanamount;
  const careertype = data?.careertype;
  const [noofmonth, setNoofmonth] = useState(1);
  const [currentLoanAmount, setCurrentLoanAmount] = useState(loanamount);
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
  // const [bvn, setBvn] = useState("");

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
      parseInt(currentLoanAmount.replace(/,/g, "")),
      noofmonth * 30,
      loanRate
    );
    setInterestResult(loanCal);
  };

  useEffect(() => {
    calculateRepayment();
  }, [noofmonth, currentLoanAmount]);

  const loanTotal =
    parseInt(currentLoanAmount.replace(/,/g, "")) + interestResult;
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

  // handle bvn verification
  // const [showLoanForm, setShowLoanForm] = useState(false);

  const handleBvnVerification = async () => {
    const apiUrl = import.meta.env.VITE_BASE_URL;
    const bvn = ref.current?.values.bvnnumber;

    const raw = JSON.stringify({
      bvn,
      loanAmount: loanamount,
      careerType: careertype,
      numberOfMonths: noofmonth,
      loanTotalRepayment: loanRepaymentTotal,
      monthlyRepayment,
      loanProduct: product,
    });

    // send data to database and redirect to bvn verification page
    await fetch(`${apiUrl}/api/tempdata/tempdata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: raw,
    })
      .then((response) => response.json())
      .then((result) => {
        // search for bvn details and verify
        bvnVerification();

        // set show loan form to true
        // setShowLoanForm(true);
      });
  };

  const loanCalRef = useRef(null); // Create a ref for loanCal section
  // Scroll to loanCal section whenever calculateRepayment is called
  const scrollToLoanCal = () => {
    loanCalRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
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
              {({ isSubmitting }) => (
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
                                  {parseInt(
                                    currentLoanAmount.replace(/,/g, "")
                                  ) < 10000 ||
                                  parseInt(
                                    currentLoanAmount.replace(/,/g, "")
                                  ) > 5000000 ? (
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
                                    onClick={() => {
                                      calculateRepayment();
                                      scrollToLoanCal();
                                    }}
                                    className="BtnAction BtnSecondary"
                                  >
                                    Calculate Repayment
                                  </button>
                                </div>

                                {/* loan cal result */}
                                <div className="LoanCal" ref={loanCalRef}>
                                  <Headline
                                    fontSize="22px"
                                    align="left"
                                    text="Loan:"
                                  />
                                  <h4>
                                    <span className="CalNaira">
                                      <img src="images/naira.png" alt="" />
                                    </span>
                                    {isNaN(loanTotal)
                                      ? 0
                                      : loanTotal.toLocaleString() ||
                                        loanamount}{" "}
                                    <span> for </span>
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

                                    {isNaN(monthlyPay)
                                      ? 0
                                      : Number(monthlyPay).toLocaleString()}
                                  </h4>
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
    </>
  );
};

LoanFirstStep.propTypes = {
  data: PropTypes.shape({
    careertype: PropTypes.any,
    loanamount: PropTypes.any,
  }),
};
export default LoanFirstStep;
