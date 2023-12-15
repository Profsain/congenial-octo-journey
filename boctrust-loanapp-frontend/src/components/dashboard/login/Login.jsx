import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../redux/reducers/adminAuthReducer";
import { Modal } from "react-bootstrap";
// import { login } from "../../../redux/reducers/userSlice";
import { Form, Button } from "react-bootstrap";
import loginUserOnServer from "./loginUserOnServer";
import loginCustomerOnServer from "./loginCustomerOnServer";
import HeadLine from "../../shared/Headline";
import "./Login.css";

const Login = ({ setLogin }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    loginAs: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  //   modal
  const [forgotUsername, setForgotUsername] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [show, setShow] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const handleClose = () => setShow(false);
  const handleForgotPassword = () => setShow(true);

  // handle forgot password submit
  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (formData.loginAs === "staff") {
      console.log("staff");
    } else if (formData.loginAs === "customer") {
      console.log("customer");
    }
    console.log(forgotUsername, forgotEmail);

    // clear fields
    setForgotUsername("");
    setForgotEmail("");

    // close modal
    setShow(false);
    setShowEmailSent(true);
   };

  //   handle on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //   clear fields
  const clearField = () => {
    setFormData({
      username: "",
      password: "",
      loginAs: "",
    });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, loginAs } = formData;

    if (loginAs === "staff") {
      const response = await loginUserOnServer(username, password);
      if (response.success) {
        clearField();
        // Dispatch the login action with the user data.
        dispatch(loginUser(response));
        setLogin(true);
      } else {
        // Handle login failure.
        setErrorMessage("Invalid username or password");
      }
    } else if (loginAs === "customer") {
      const response = await loginCustomerOnServer(username, password);
      if (response.success) {
        clearField();
        // Dispatch the login action with the user data.
        dispatch(loginUser(response));
        setLogin(true);
      } else {
        // Handle login failure.
        setErrorMessage("Invalid username/password or account not activated");
      }
    }
  };

  return (
    <div className="LogContainer">
      <div>
        <HeadLine text="Login to your Dashboard" />
        <p className="Error">{errorMessage}</p>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="my-4">
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <p className="asText">Login as:</p>
            <div className="asBox">
              <div>
                <input
                  type="radio"
                  name="loginAs"
                  className="radio"
                  value="staff"
                  onChange={handleChange}
                />
                <label className="Remember">Staff </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="loginAs"
                  className="radio"
                  value="customer"
                  onChange={handleChange}
                />
                <label className="Remember">Customer </label>
              </div>
            </div>
          </Form.Group>

          <Button type="submit" className="LoginBtn">
            Login
          </Button>
        </Form>
        {!showEmailSent ? (
          <p className="Forget" onClick={handleForgotPassword}>
            Forgot Password
          </p>
        ) : (
          <p className="Forget" style={{ width: "290px" }}>
            A password reset link has been sent to your email. Click on the link
            to resent your password
          </p>
        )}
      </div>

      {/* popup modal for forgot password */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            It seems you&apos;ve forgotten your password. No worries, it happens
            to the best of us! To reset your password and regain access to your
            account, please enter your username and email below.
          </p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="forgotUsername"
                value={forgotUsername}
                onChange={(e) => setForgotUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </Form.Group>
              <p>I am a</p>
            <div className="asBox" style={{marginBottom: "18px"}}>
              <div>
                <input
                  type="radio"
                  name="loginAs"
                  className="radio"
                  value="staff"
                  onChange={handleChange}
                />
                <label className="Remember">Staff </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="loginAs"
                  className="radio"
                  value="customer"
                  onChange={handleChange}
                />
                <label className="Remember">Customer </label>
              </div>
            </div>
            <Button
              variant="primary"
              type="submit"
              onClick={(e) => handleForgotPasswordSubmit(e)}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

Login.propTypes = {
  setLogin: PropTypes.func,
};

export default Login;
