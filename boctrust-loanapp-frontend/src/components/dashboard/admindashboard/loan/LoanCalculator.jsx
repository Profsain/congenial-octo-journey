import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProduct } from "../../../../redux/reducers/productReducer";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import axios from "axios";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  loanProduct: Yup.string().required("Loan product is required"),
  duration: Yup.number().min(1).required("Loan duration is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required"),
  purpose: Yup.string().required("Loan purpose is required"),
});

const initialValues = {
  loanProduct: "",
  duration: "",
  amount: "",
  purpose: "",
};

const LoanCalculator = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProduct());
  }, [dispatch]);

  // local state
  const [errorMessage, setErrorMessage] = useState("");
  const [totalRepayment, setTotalRepayment] = useState(0);
  const [monthlyRepayment, setMonthlyRepayment] = useState(0);
  const [paymentDuration, setPaymentDuration] = useState(0);

  // loan products
  const products = useSelector(
    (state) => state.productReducer.products.products
  );

  // calculate loan repayment
  const calculateRepayment = (amount, duration, rate) => {
    const interest = (amount * duration * rate) / 100;
    const total = Number(amount) + interest;
    const monthly = total / duration;
    setTotalRepayment(total);
    setMonthlyRepayment(monthly.toFixed(2));
  };

  const handleSubmit = (values, { resetForm }) => {
    // find single products by id
    const product = products.find(
      (product) => product._id === values.loanProduct
    );
    // loan product duration
    const productDuration = product.maxTerm;
    const productRate = product.interestRate;
    const amount = values.amount;
    const duration = values.duration;

    // check loan duration
    if (values.duration > productDuration) {
      setErrorMessage(
        "Number of month exceeds the maximum duration of the loan product"
      );
    } else {
      setErrorMessage("");
      setPaymentDuration(values.duration);
      // calculate loan repayment
      calculateRepayment(amount, duration, productRate);
      resetForm();
    }
  };

  const apiUrl = import.meta.env.VITE_BASE_URL;

  const [minLoanAmount, setMinLoanAmount] = useState("");
  const [minLoanAmountMessage, setMinLoanAmountMessage] = useState("");

  useEffect(() => {
    const fetchMinLoanAmount = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/settings/settings`);
        console.log("PAPAPAPAP",response.data);
        if (response.data && response.data.settings.minimumLoanAmount) {
          setMinLoanAmount(response.data.settings.minimumLoanAmount);
        }
      } catch (error) {
        console.error("Error fetching Minimum Loan Amount:", error);
      }
    };

    fetchMinLoanAmount();
  }, []);

  // Handler for submitting the Minimum Loan Amount
  const handleMinLoanAmountSubmit = async () => {
    if (!minLoanAmount || isNaN(minLoanAmount) || Number(minLoanAmount) <= 0) {
      setMinLoanAmountMessage("Please enter a valid minimum loan amount.");
      return;
    }
    try {
      const response = await axios.post(`${apiUrl}/api/settings/settings/minimumLoanAmount`, {
        minLoanAmount: Number(minLoanAmount),
      });
      setMinLoanAmountMessage("Minimum Loan Amount updated successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error sending Minimum Loan Amount:", error);
      setMinLoanAmountMessage("Failed to update Minimum Loan Amount.");
    }
  };

  return (
    <div className="TransContainer loan_calculator">
      <DashboardHeadline>Loan Calculator</DashboardHeadline>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="loanProduct">Loan Product</label>
              <Field
                as="select"
                name="loanProduct"
                id="loanProduct"
                className="Select"
              >
                <option value="" label="Select a product" />
                {products?.map((product) => (
                  <option
                    key={product._id}
                    value={product._id}
                    label={product.productName}
                  />
                ))}
              </Field>
              <ErrorMessage name="loanProduct" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="duration">Number of Months</label>
              <Field
                type="number"
                name="duration"
                id="duration"
                className="Input"
                min="1"
              />
              <ErrorMessage name="duration" component="div" />
              <div className="Error">{errorMessage}</div>
            </div>
          </div>
          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="amount">Amount</label>
              <Field type="text" name="amount" id="amount" className="Input" />
              <ErrorMessage name="amount" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="purpose">Purpose</label>
              <Field
                type="text"
                name="purpose"
                id="purpose"
                className="Input"
              />
              <ErrorMessage name="purpose" component="div" />
            </div>
          </div>
          <div className="ResultContainer">
            <p>
              Total Repayment: <span>N{totalRepayment}</span>
            </p>
            <p>
              Repayment Duration: <span>{paymentDuration}</span>
            </p>
            <p>
              Monthly Repayment: <span>N{monthlyRepayment}</span>
            </p>
          </div>
          <div className="BtnContainer">
            <BocButton
              fontSize="1.6rem"
              type="submit"
              width="220px"
              bgcolor="#ecaa00"
              bradius="18px"
            >
              Calculate
            </BocButton>
          </div>
        </Form>
      </Formik>
      <div className="MinLoanAmountContainer">
        <h3>Set Minimum Loan Amount</h3>
        <div className="FieldGroup">
          <label htmlFor="minLoanAmountInput">Minimum Loan Amount</label>
          <input
            type="number"
            id="minLoanAmountInput"
            className="Input"
            value={minLoanAmount}
            onChange={(e) => setMinLoanAmount(e.target.value)}
            min="1"
          />
        </div>
        <button
          className="BocButton"
          style={{
            fontSize: "1.6rem",
            width: "420px",
            backgroundColor: "#ecaa00",
            borderRadius: "18px",
          }}
          onClick={handleMinLoanAmountSubmit}
        >
          Update Minimum Loan
        </button>
        {minLoanAmountMessage && <p>{minLoanAmountMessage}</p>}
      </div>
    </div>
  );
};

export default LoanCalculator;
