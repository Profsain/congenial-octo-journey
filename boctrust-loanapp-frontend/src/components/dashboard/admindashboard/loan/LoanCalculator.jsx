import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {  fetchSelectedProduct } from "../../../../redux/reducers/productReducer";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import axios from "axios";
import { calculateSimpleInterest } from "../../../shared/calculatorfunc";


// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  loanproduct: Yup.string().required("Loan product is required"),
  numberofmonth: Yup.string().required("Loan Duration is required"),
  loanamount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required"),
 
});

const initialValues = {
  loanproduct: "",
  interestRate: "",
  numberofmonth: "",
  loanamount: "",
  monthlyrepayment: "",
  loantotalrepayment: "",

};

const LoanCalculator = () => {

  const [choosenProduct, setChoosenProduct] = useState(null);
  

  const ref = useRef();

  // fetch loan product
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSelectedProduct());
  }, [dispatch]);

  const calculateRepayment = () => {
    if (
      ref.current?.values.loanproduct &&
      ref.current?.values.interestRate &&
      ref.current?.values.numberofmonth &&
      ref.current?.values.loanamount
    ) {
      // const loanRate = choosenProduct?.interestRate;

      const { totalPayment, monthlyPayment } = calculateSimpleInterest(
        Number(ref.current?.values.loanamount),
        Number(ref.current?.values.interestRate),
        Number(ref.current?.values.numberofmonth)
      );

      ref.current?.setFieldValue("monthlyrepayment", monthlyPayment);
      ref.current?.setFieldValue("loantotalrepayment", totalPayment);
    }
  };

  useEffect(() => {
    calculateRepayment();
  }, [choosenProduct]);

  const loanProducts = useSelector((state) => state.productReducer.products);

  return (
    <div className="apply__forLoan">
      <div className="TransContainer SecCon">
        <DashboardHeadline>Loan Calculator</DashboardHeadline>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          innerRef={ref}
        >
          <Form className="appForm">
            <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="loanproduct">Loan Product</label>

                <Field name="loanproduct" id="loanproduct">
                  {({ field, form }) => (
                    <select
                      {...field}
                      onChange={(event) => {
                        field.onChange(event);

                        const found = loanProducts.find(
                          (product) => product?._id == event.target.value
                        );

                        setChoosenProduct(found);
                      }}
                      onBlur={(event) => {
                        field.onBlur(event);

                        if (choosenProduct) {
                          form.setFieldValue(
                            "interestRate",
                            choosenProduct?.interestRate
                          );
                        }
                      }}
                      id="loanproduct"
                      className="Select"
                    >
                      <option value="" label="Select a product" />
                      {/* <option>Select Product</option> */}
                      {loanProducts?.map((product) => (
                        <option key={product?.productCode} value={product?._id}>
                          {product.productTitle}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>

                <ErrorMessage
                  name="loanproduct"
                  className="error__msg"
                  component="div"
                />
              </div>

              <div className="FieldGroup">
                <label htmlFor="interestRate">Interest Rate</label>
                <Field
                  type="text"
                  name="interestRate"
                  id="interestRate"
                  className="Input"
                  disabled
                />

                <ErrorMessage
                  name="interestRate"
                  className="error__msg"
                  component="div"
                />
              </div>
            </div>
            <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="loanamount">Loan Amount</label>

                <Field name="loanamount" id="loanamount">
                  {({ field }) => (
                    <input
                      {...field}
                      type="text"
                      name="loanamount"
                      id="loanamount"
                      className="Input"
                      onBlur={(e) => {
                        field.onBlur(e);
                        calculateRepayment();
                      }}
                    />
                  )}
                </Field>

                <ErrorMessage
                  name="loanamount"
                  className="error__msg"
                  component="div"
                />
              </div>

              <div className="FieldGroup">
                <label htmlFor="numberofmonth">Number of months</label>

                <Field name="numberofmonth" id="numberofmonth">
                  {({ field }) => (
                    <input
                      {...field}
                      type="text"
                      name="numberofmonth"
                      id="numberofmonth"
                      className="Input"
                      onBlur={(e) => {
                        field.onBlur(e);
                        calculateRepayment();
                      }}
                    />
                  )}
                </Field>

                <ErrorMessage
                  name="numberofmonth"
                  className="error__msg"
                  component="div"
                />
              </div>
            </div>
            
            <div className="FieldRow autoFill">
              <div className="FieldGroup">
                <label htmlFor="monthlyrepayment">Monthly Repayment</label>
                <Field
                  type="text"
                  name="monthlyrepayment"
                  id="monthlyrepayment"
                  className="Input"
                  disabled
                />
                <ErrorMessage
                  name="monthlyrepayment"
                  className="error__msg"
                  component="div"
                />
              </div>

              <div className="FieldGroup">
                <label htmlFor="loantotalrepayment">Loan Total Repayment</label>
                <Field
                  type="text"
                  name="loantotalrepayment"
                  id="loantotalrepayment"
                  className="Input"
                  disabled
                />
                <ErrorMessage
                  name="loantotalrepayment"
                  className="error__msg"
                  component="div"
                />
              </div>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default LoanCalculator;
