import * as Yup from "yup";
// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  photo: Yup.string().required("Photo is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^\d{11}$/, "Invalid phone number format")
    .required("Phone number is required"),
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Password must contain at least 8 characters, one letter, one number, and one special character"
    ),
  userType: Yup.string().required("User type is required"),
  userRole: Yup.string().required("Admin role is required"),
});


export default validationSchema;