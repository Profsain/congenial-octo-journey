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
// import ReactDOMServer from "react-dom/server";


const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 2000,
    });
  }, []);

  // const handleSendEmail = () => {
  //   const emailTemplateHtml = ReactDOMServer.renderToString(
  //     <EmailTemplate firstName="Husseini Mudi" />
  //   );
  //   const options = {
  //     email: "husseinimudiking@gmail.com",
  //     subject: "Loan Application Notification",
  //     html: emailTemplateHtml,
  //   };
  //   sendEmail(options);
  // };

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

      {/* <button onClick={handleSendEmail}>Send Email</button> */}
    </>
  );
};

export default Home;
