/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Career.css";

const JobApplicationForm = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null,
    vacancy: location.state ? location.state.vacancy : null,
  });

    useEffect(() => {
    if (location.state && location.state.vacancy) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        vacancy: location.state.vacancy,
      }));
    }
    }, [location.state]);
  

 const handleChange = (e) => {
   const { name, value, files } = e.target;
   setFormData({
     ...formData,
     [name]: files ? files[0] : value,
   });
 };

 const handleSubmit = async (e) => {
   e.preventDefault();
   const form = new FormData();
   form.append("name", formData.name);
   form.append("email", formData.email);
   form.append("phone", formData.phone);
   form.append("coverLetter", formData.coverLetter);
   form.append("resume", formData.resume);
   form.append("vacancy", JSON.stringify(formData.vacancy));

   console.log("FormData", formData)
  //  try {
  //    const response = await axios.post("http://localhost:5000/apply", form, {
  //      headers: {
  //        "Content-Type": "multipart/form-data",
  //      },
  //    });
  //    alert("Application submitted successfully!");
  //  } catch (error) {
  //    console.error("There was an error submitting the application!", error);
  //  }
 };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Full-Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Phone:
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Cover Letter:
        <textarea
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleChange}
          required
          rows={8}
        ></textarea>
      </label>
      <label>
        Resume:
        <input type="file" name="resume" onChange={handleChange} required />
      </label>
      <button type="submit">Submit Application</button>
    </form>
  );
};

export default JobApplicationForm;
