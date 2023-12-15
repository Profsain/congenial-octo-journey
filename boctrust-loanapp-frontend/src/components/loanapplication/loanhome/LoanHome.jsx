import { useState, useEffect } from "react";
// formik and yup for form handling and validation
import { Formik } from "formik";
import * as Yup from "yup";
// animation library
import AOS from "aos";
import "aos/dist/aos.css";
import Button from "react-bootstrap/Button";
import "../Loan.css";
import Header from "../../shared/Header";
import Headline from "../../shared/Headline";
import LoanStep from "./LoanStep";
import BocTrustMsg from "./BocTrustMsg";
import Testimonial from "./Testimonial";
import EmailSection from "./EmailSection";
import LoanFirstStep from "../loanform/LoanFirstStep";

const LoanHome = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [startObject, setStartObject] = useState();

  useEffect(() => {
    AOS.init({
      duration: 2000,
    });
  }, []);

  // handle email apply button
  const handleApplyBtn = () => {
    setIsOpened(true);
    setStartObject({});
  };

  return (
    <>
      {isOpened ? (
        <LoanFirstStep data={startObject} />
      ) : (
        <div className="LoanHome">
          <Header imgurl="images/boctrustformheader.jpg" />
          <div className="TopSection">
            <div className="TopText">
              <Headline
                align="left"
                color="#fff"
                fontSize="2.5rem"
                text="Quick & easy loans for anyone"
              />
              <p>
                Take care of your personal needs or grow your small business
                with our quick loans
              </p>
            </div>
            <div>
              <Formik
                initialValues={{
                  loanamount: "",
                  careertype: "",
                }}
                validationSchema={Yup.object({
                  loanamount: Yup.string().required("Required"),
                  careertype: Yup.string().required("Required"),
                })}
                onSubmit={(values, { setSubmitting }) => {
                  // send value to next page
                  setStartObject(values);
                  setSubmitting(false);
                  setIsOpened(true);
                }}
              >
                {(formik) => (
                  <form onSubmit={formik.handleSubmit} className="HeroCard">
                    <Headline
                      fontSize="1.5rem"
                      spacer="0"
                      text="How much do you need?"
                    />
                    <img src="images/naira.png" alt="" className="NairaIcon" />
                    {/* <input
                      className="Field"
                      id="loanamount"
                      type="text"
                      value={Number(formik.values.loanamount).toLocaleString()}
                      {...formik.getFieldProps("loanamount")}
                    /> */}
                    <input
                      className="Field"
                      id="loanamount"
                      type="text"
                      value={formik.values.loanamount} // Keep the raw numeric value in state
                      onChange={(e) => {
                        // Handle the change event and update the state with the raw numeric value
                        const rawValue = e.target.value.replace(/,/g, ""); // Remove commas if present
                        formik.setFieldValue("loanamount", rawValue);
                      }}
                      onBlur={(e) => {
                        // Format the value with toLocaleString when the input loses focus
                        const rawValue = e.target.value.replace(/,/g, ""); // Remove commas if present
                        // formik.values.loanamount = Number(rawValue).toLocaleString();
                        formik.setFieldValue(
                          "loanamount",
                          Number(rawValue).toLocaleString()
                        );
                      }}
                    />

                    {formik.touched.loanamount && formik.errors.loanamount ? (
                      <p className="ErrorMsg">{formik.errors.loanamount}</p>
                    ) : null}

                    <Headline
                      fontSize="1.5rem"
                      spacer="18px 0"
                      text=" Business Owner or Employee?"
                    />
                    <select
                      className="Field"
                      id="careertype"
                      {...formik.getFieldProps("careertype")}
                    >
                      <option value="default">Select one</option>
                      <option value="government employee">
                        Government Employee
                      </option>
                      <option value="private employee">Private Employee</option>
                      <option value="business owner">Business Owner</option>
                    </select>
                    {formik.touched.careertype && formik.errors.careertype ? (
                      <p className="ErrorMsg">{formik.errors.careertype}</p>
                    ) : null}
                    <Button
                      className="ActionBtn"
                      variant="primary"
                      size="lg"
                      type="submit"
                    >
                      Apply Now
                    </Button>
                  </form>
                )}
              </Formik>
            </div>
          </div>

          {/* loan step section */}
          <div data-aos="fade-up">
            <LoanStep />
          </div>

          {/* Boctrust about section */}
          <div data-aos="fade-up">
            <BocTrustMsg />
          </div>

          {/* testimonial section */}
          <div data-aos="fade-up">
            <Testimonial />
          </div>

          {/* Email list section */}
          <div data-aos="fade-up">
            <EmailSection handleBtn={handleApplyBtn} />
          </div>
        </div>
      )}
    </>
  );
};

export default LoanHome;
