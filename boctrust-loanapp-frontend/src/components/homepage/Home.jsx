import { useEffect } from "react";
// animation library
import AOS from "aos";
import "aos/dist/aos.css";
// components
import ExploreBoctrust from "./explore/ExploreBoctrust";
import HomeCarousel from "./carousel/HomeCarousel";
import Overview from "./overview/Overview";
import Calculator from "./calculator/Calculator";
import BlogList from "./blogexperience/BlogList";
// import LoanForm from "../loanapplication/loanform/LoanForm";
// import sendEmail from "../../../utilities/sendEmail";

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 2000,
    });
  }, []);

  // const emailTemplate = () => {
  //   return `
  //   <div>
  //     <h1>Test Email</h1>
  //     <p>This is a test email</p>
  //     <button>Click Me</button>
  //   </div>
  //   `;
  // }
  // const handleSendEmail = () => {
  //   sendEmail("profsainhm@gmail.com", "Test Email from Boctrust", emailTemplate());
  // }

  return (
    <>
      <HomeCarousel />
      <div data-aos="fade-up">
        <ExploreBoctrust />
      </div>
      <div data-aos="fade-up">
        <Overview />
      </div>
      <div data-aos="fade-up">
        <Calculator />
      </div>
      <div data-aos="fade-up">
        <BlogList />
      </div>

      <div>
        {/* <LoanForm /> */}
        {/* <button onClick={handleSendEmail}>Send Email</button> */}
      </div>
    </>
  );
};

export default Home;
