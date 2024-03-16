/* eslint-disable no-undef */
import { useEffect } from "react";

const GoogleAnalytics = () => {
  useEffect(() => {
    // Open Google Analytics URL when component mounts
    window.location.href =
      "https://analytics.google.com/analytics/web/#/p432229551/reports/intelligenthome";
  }, []);

  return (
    <div>
      <h2>Opening Google Analytics</h2>
      {/* You can add additional content if needed */}
    </div>
  );
};

export default GoogleAnalytics;

// import React from 'react'

// const GoogleAnalytics = () => {
//   return (
//     <div>GoogleAnalytics</div>
//   )
// }

// export default GoogleAnalytics