import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
// import { authentication } from "../../../firebase-config";
import { auth } from "../../../firebase/setup";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import sendSMS from "../../../../utilities/sendSms";
import EmailTemplate from "../../shared/EmailTemplate";
import sendEmail from "../../../../utilities/sendEmail";
import ReactDOMServer from "react-dom/server";
import { toast } from "react-toastify";

const styles = {
  error: {
    color: "#f64f4f",
    fontSize: "0.8rem",
  },
  btnBox: {
    display: "flex",
    justifyContent: "flex-end",
  },
};

const PhoneOtp = (props) => {
  const number = props.phonenumber;
  const emailAddress = props.customerEmail;
  const customerName = props.customerName;
  const handleSubmit = props.handleSubmit;
  const [confirmOtp, setConfirmOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [updatePhone, setUpdatePhone] = useState(number);
  const [otp, setOtp] = useState("");
  const [flag, setFlag] = useState(false);

  const navigate = useNavigate();

  // generate recaptcha
  const setUpRecaptcha = async (number) => {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved
          console.log("reCAPTCHA solved");
        },
        "expired-callback": () => {
          // Response expired
          console.log("reCAPTCHA expired");
        },
      }
    );

    return await signInWithPhoneNumber(auth, number, recaptchaVerifier);
  };

  // handle otp request
  const requestOtp = async (e) => {
    e.preventDefault();
    const phone = "+234" + updatePhone.slice(1);

    setErrorMsg("");

    if (updatePhone === "" || updatePhone === undefined)
      return setErrorMsg("Please enter a valid phone number");
    try {
      const response = await setUpRecaptcha(phone);

      setConfirmOtp(response);
      setFlag(true);
    } catch (error) {
      // setErrorMsg(`Invalid phone number: ${error.message}`);
      console.log(error);
      toast.error("Error setting up reCAPTCHA:");
      // throw new Error("Error setting up reCAPTCHA:", error);
    }
  };

  // send email notification
  const handleSendEmail = async () => {
    try {
      const emailTemplateHtml = ReactDOMServer.renderToString(
        <EmailTemplate
          firstName={customerName}
          content="Your loan application has been received. We will get back to you shortly."
        />
      );
      const options = {
        email: emailAddress,
        subject: "Loan Application Notification",
        html: emailTemplateHtml,
      };
      sendEmail(options);
    } catch (error) {
      console.log(error);
    }
  };

  // handle otp verification
  const verifyOtp = async (e) => {
    e.preventDefault();
    if (otp === "" || otp.length !== 6)
      return setErrorMsg("Please enter a valid OTP");
    try {
      setErrorMsg("");
      await confirmOtp.confirm(otp);
      props.onHide(false);
      // submit customer details
      await handleSubmit();

      // send loan application email and sms notification
      await sendSMS(
        number,
        "Your loan application has been received. We will get back to you shortly."
      );
      await handleSendEmail();

      navigate("/login");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrorMsg(`Error verifying OTP: ${error.message}`);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
      id="sign-in-button"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          OTP Verification
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p style={styles.error}>{errorMsg}</p>
        <div style={{ display: !flag ? "block" : "none" }}>
          <p>A 6 digit OTP will be sent to your phone number</p>
          <Form onSubmit={(e) => requestOtp(e)}>
            <Form.Group className="mb-3" controlId="formPhone">
              <Form.Control
                type="text"
                value={updatePhone}
                onChange={(e) => setUpdatePhone(e.target.value)}
              />
              <Form.Text className="text-muted">
                Please, confirm your phone number or change.
              </Form.Text>
            </Form.Group>
            <div id="recaptcha-container" className="mb-3"></div>
            <div style={styles.btnBox}>
              <Button variant="secondary" onClick={() => props.onHide(false)}>
                Cancel
              </Button>{" "}
              &nbsp; &nbsp; &nbsp; &nbsp;
              <Button variant="primary" type="submit">
                Send OTP
              </Button>
            </div>
          </Form>
        </div>

        {/* otp 6 digit */}
        <div style={{ display: flag ? "block" : "none" }}>
          <p>Enter the 6 digit OTP sent to your phone</p>
          <Form onSubmit={verifyOtp}>
            <Form.Group className="mb-3" controlId="formOtp">
              <Form.Control
                type="text"
                onChange={(e) => setOtp(e.target.value)}
              />
              <Form.Text className="text-muted">e.g: 384756</Form.Text>
            </Form.Group>
            <div style={styles.btnBox}>
              <Button variant="secondary" onClick={() => setFlag(false)}>
                Resend OTP
              </Button>{" "}
              &nbsp; &nbsp; &nbsp; &nbsp;
              <Button variant="primary" type="submit">
                Verify OTP
              </Button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

PhoneOtp.propTypes = {
  onHide: PropTypes.func,
  phonenumber: PropTypes.string,
  customerEmail: PropTypes.string,
  customerName: PropTypes.string,
  handleSubmit: PropTypes.func,
};

export default PhoneOtp;
