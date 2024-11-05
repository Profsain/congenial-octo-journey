import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import NextPreBtn from "../../shared/NextPreBtn";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import CareerList from "./CareerList";
import apiClient from "../../../../lib/axios";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  jobtitle: Yup.string().required("Jobs title is required"),
  description: Yup.string().required("Description is required"),
  image: Yup.string().required("Image url is required"),
  dateposted: Yup.string().required("Job posted date is required"),
  deadline: Yup.string().required("Job closing date is required"),
});

const initialValues = {
  jobtitle: "",
  description: "",
  image: "",
  dateposted: "",
  deadline: "",
};

const PostJobs = () => {
  const [showAddNew, setShowAddNew] = useState(false);
  const handleAddNew = () => setShowAddNew(true);
  const handleClose = () => setShowAddNew(false);
  const [showCount, setShowCount] = useState(10);
  const [searchTerms, setSearchTerms] = useState("");

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const apiUrl = import.meta.env.VITE_BASE_URL;
    // Handle form submission logic here
    try {
      await apiClient.post(`/wiki/wikis`, values);
      
      setSubmitting(false);
      resetForm(initialValues);
      setShowAddNew(false);
    } catch (error) {
      throw Error(error);
    }
  };

  return (
    <div className="MainBox">
      {!showAddNew ? (
        <div className="BlogSection">
          <div className="AddBtn">
            <BocButton func={handleAddNew} bgcolor="#ecaa00" bradius="22px">
              <span>+</span> Post Jobs
            </BocButton>
          </div>
          {/* top search bar */}
          <div className="Search">
            <DashboardHeadline padding="0" height="70px" bgcolor="#d9d9d9">
              <div className="SearchBar">
                <div className="FormGroup">
                  <label htmlFor="show">Show</label>
                  <input
                    name="showCount"
                    type="number"
                    step={10}
                    min={10}
                    value={showCount}
                    onChange={(e) => setShowCount(e.target.value)}
                  />
                </div>

                {/* search bar input */}
                <div className="FormGroup SBox">
                  <input
                    name="search"
                    placeholder="Search"
                    value={searchTerms}
                    onChange={(e) => setSearchTerms(e.target.value)}
                  />
                  <img src="/images/search.png" alt="search-icon" />
                </div>
              </div>
            </DashboardHeadline>
          </div>
          <div>
            {/* wiki list  */}
            <CareerList count={showCount} searchTerms={searchTerms} />
            {/* next and previous button  */}
            <NextPreBtn />
          </div>
        </div>
      ) : (
        <div className="TransContainer">
          <DashboardHeadline>Post New Jobs</DashboardHeadline>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <div className="FieldRow">
                <div className="FieldGroup">
                  <label htmlFor="jobtitle">Job Title</label>
                  <Field
                    type="text"
                    name="jobtitle"
                    id="jobtitle"
                    className="Input"
                  />
                  <ErrorMessage
                    name="jobtitle"
                    component="div"
                    className="Error"
                  />
                </div>
                <div className="FieldGroup">
                  <label htmlFor="image">Image Url</label>
                  <Field
                    type="text"
                    name="image"
                    id="image"
                    className="Input"
                  />
                  <ErrorMessage
                    name="image"
                    component="div"
                    className="Error"
                  />
                </div>
              </div>

              <div className="FieldRow">
                <div className="FieldGroup">
                  <label htmlFor="dateposted">Posted Date</label>
                  <Field
                    type="date"
                    name="dateposted"
                    id="dateposted"
                    className="Input"
                  />
                  <ErrorMessage
                    name="dateposted"
                    component="div"
                    className="Error"
                  />
                </div>
                <div className="FieldGroup">
                  <label htmlFor="deadline">Closing Date</label>
                  <Field
                    type="date"
                    name="deadline"
                    id="deadline"
                    className="Input"
                  />
                  <ErrorMessage
                    name="deadline"
                    component="div"
                    className="Error"
                  />
                </div>
              </div>

              <div className="DescriptionJob">
                <div className="FieldGroup">
                  <label htmlFor="answer">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    cols="30"
                    rows="10"
                    style={{
                      marginTop: "10px",
                      borderRadius: "8px",
                      padding: "18px",
                    }}
                  ></textarea>
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="Error"
                  />
                </div>
              </div>

              <div className="row text-center my-4">
                <div className="col-sm-12 col-md-6">
                  <BocButton
                    fontSize="1.6rem"
                    type="button"
                    width="220px"
                    margin="1rem 0"
                    bgcolor="gray"
                    bradius="18px"
                    func={handleClose}
                  >
                    Cancel
                  </BocButton>
                </div>
                <div className="col-sm-12 col-md-6">
                  <BocButton
                    fontSize="1.6rem"
                    type="submit"
                    width="220px"
                    margin="1rem 0"
                    bgcolor="#ecaa00"
                    bradius="18px"
                  >
                    Submit
                  </BocButton>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      )}
    </div>
  );
};

export default PostJobs;
