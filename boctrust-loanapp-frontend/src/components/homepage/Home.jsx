import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContent } from "../../redux/reducers/siteContentReducer";
// animation library
import AOS from "aos";
import "aos/dist/aos.css";
// components
import ExploreBoctrust from "./explore/ExploreBoctrust";
import HomeCarousel from "./carousel/HomeCarousel";
import Overview from "./overview/Overview";
import Calculator from "./calculator/Calculator";
import BlogList from "./blogexperience/BlogList";
import DashboardHome from "../dashboard/dashboardcomponents/DashboardHome";
// import TopNavber from "../dashboard/topnavbar/TopNavber"

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 2000,
    });
  }, []);

  // fetch site content
  const dispatch = useDispatch();
  const siteContent = useSelector((state) => state.siteContent.siteContent);

  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  return (
    <>
      <HomeCarousel content={siteContent} />
      <div data-aos="fade-up">
        <ExploreBoctrust content={siteContent} />
      </div>
      <div data-aos="fade-up">
        <Overview content={siteContent} />
      </div>
      <div data-aos="fade-up">
        <Calculator />
      </div>
      <div data-aos="fade-up">
        <BlogList />
      </div>

      {/* <TopNavber /> */}

      <DashboardHome />
    </>
  );
};

export default Home;
