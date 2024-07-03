/* eslint-disable no-undef */

const GoogleAnalytics = () => {
  const styles = {
    button: {
      backgroundColor: "#145098",
      border: "none",
      color: "white",
      padding: "15px 32px",
      textAlign: "center",
      textDecoration: "none",
    },
  };
  // useEffect(() => {
  //   // Open Google Analytics URL in a new tab when component mounts
  //   window.open(
  //     "https://analytics.google.com/analytics/web/#/p432229551/reports/intelligenthome",
  //     "_blank"
  //   );
  // }, []);

  return (
    <div>
      <h2>Redirecting to Google Analytics...</h2>
      <h3>Instructions</h3>
      <p>
        1. If you are not logged in, you will be asked to log in. Please use the
        following credentials:
      </p>
      <p>
        Username: <strong> boctrustebusiness@gmail.com </strong>
      </p>
      <p>
        Password: <strong> ********* </strong>
      </p>

      <p>2. Click on the link below to open Google Analytics in a new tab.</p>

      <a
        href="https://analytics.google.com/analytics/web/#/p432229551/reports/intelligenthome"
        target="_blank"
        rel="noopener noreferrer"
      ></a>

      <div>
        <button
          style={styles.button}
          onClick={() => {
            window.open(
              "https://analytics.google.com/analytics/web/#/p432229551/reports/intelligenthome",
              "_blank"
            );
          }}
        >
          Open Google Analytics
        </button>
      </div>
    </div>
  );
};

export default GoogleAnalytics;
