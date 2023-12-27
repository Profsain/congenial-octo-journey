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
import { useState } from "react";
import PhoneOtp from "../loanapplication/loanform/PhoneOtp";


const Home = () => {
  const [modalShow, setModalShow] = useState(true);
  const phoneNumber = "07051267253";
  useEffect(() => {
    AOS.init({
      duration: 2000,
    });
  }, []);

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

      {/* to be remove  */}
      <PhoneOtp
        show={modalShow}
        onHide={() => setModalShow(false)}
        phonenumber={phoneNumber}
      />
    </>
  );
};

export default Home;
