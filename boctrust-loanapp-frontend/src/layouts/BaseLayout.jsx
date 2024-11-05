import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSetting } from "../redux/reducers/settingReducer";
import { useState } from "react";
import TopNav from "../components/navigation/TopNav";
import Footer from "../components/footer/Footer";
import { Outlet } from "react-router-dom";

const BaseLayout = () => {
  const dispatch = useDispatch();

  
  const settings = useSelector(
    (state) => state?.settingReducer?.settings?.settings
  );

  useEffect(() => {
    dispatch(fetchSetting());
  }, [dispatch]);

  const [appSettings, setAppSettings] = useState({});
  useEffect(() => {
    if (settings) {
      setAppSettings(settings[0]);
    } else {
      setAppSettings({});
    }
  }, [settings]);
  return (
    <div>
      <TopNav settings={appSettings} />

      <Outlet />
      <Footer settings={appSettings} />
    </div>
  );
};

export default BaseLayout;
