import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../../../redux/reducers/productReducer";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import interestRate from "../../../shared/calculatorfunc";
import apiClient from "../../../../lib/axios";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  loanProduct: Yup.string().required("Loan product is required"),
  duration: Yup.string().required("Loan duration is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required"),
  note: Yup.string().required("Note is required"),
});

const initialValues = {
  loanProduct: "",
  duration: "",
  amount: "",
  note: "",
};

const ApplyLoan = () => {
  const [message, setMessage] = useState("");

  // fetch loan product
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProduct());
  }, [dispatch]);

  const loanProducts = useSelector(
    (state) => state?.productReducer?.products?.products
  );

  // get current login user
  const user = useSelector((state) => state.adminAuth.user);
  const isAccountCreated = user?.banking.isAccountCreated;

  // update message
  const updateMessage = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // handle loan submission
  const handleSubmit = async (values, { resetForm }) => {
    const customerId = user._id;

    if (!isAccountCreated) {
      updateMessage(
        "Your account is being processed. You would be contacted when it is activated"
      );
      return;
    }

    // find selected product using id
    const selectedProduct = loanProducts.find(
      (product) => product._id === values.loanProduct
    );
    const rate = selectedProduct.interestRate;
    const loanProductName = selectedProduct.productName;
    const principal = parseInt(values.amount);
    const time = parseInt(values.duration) * 30;

    // calculate total repayment
    const totalRepayment = interestRate(principal, time, rate);

    // Handle form submission logic here
    // create a new loan application object
    const loanApplication = {
      loanId: Math.floor(Math.random() * 1000),
      loanProduct: values.loanProduct,
      loanProductName: loanProductName,
      interestRate: rate,
      duration: values.duration,
      amount: values.amount,
      note: values.note,
      loanStatus: "pending",
      isLoanApproved: false,
      totalRepayment: totalRepayment + principal,
    };
    // send the object to the backend
    try {
      const { data } = await apiClient.post(
        `/loan/${customerId}`,
        loanApplication
      );

      // reset form
      resetForm();
      updateMessage("Loan application submitted successfully");

      return data;
    } catch (error) {
      updateMessage("An error occurred. Please try again");
      throw new Error(error);
    }
  };

  return (
    <div className="TransContainer SecCon">
      <DashboardHeadline>Apply for New Loan</DashboardHeadline>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="FieldRow">
            <div className="FieldGroup" style={{ marginBottom: "18px" }}>
              <label htmlFor="loanProduct">Loan Product</label>
              <Field
                as="select"
                name="loanProduct"
                id="loanProduct"
                className="Select"
              >
                <option value="" label="Select a product" />
                {loanProducts?.map((option) => (
                  <option
                    key={option._id}
                    value={option._id}
                    label={option.productName}
                  />
                ))}
              </Field>
              <ErrorMessage name="loanProduct" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="duration">Duration</label>
              <Field
                type="text"
                name="duration"
                id="duration"
                className="Input"
              />
              <ErrorMessage name="duration" component="div" />
            </div>
          </div>
          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="amount">Amount</label>
              <Field type="text" name="amount" id="amount" className="Input" />
              <ErrorMessage name="amount" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="note">Note</label>
              <Field type="text" name="note" id="note" className="Input" />
              <ErrorMessage name="note" component="div" />
            </div>
          </div>

          {message && (
            <div style={{ color: "orange", textAlign: "center" }}>
              {message}
            </div>
          )}
          <div className="BtnContainer">
            <BocButton
              fontSize="1.6rem"
              type="submit"
              bgcolor="#ecaa00"
              bradius="18px"
            >
              Submit Application
            </BocButton>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default ApplyLoan;
