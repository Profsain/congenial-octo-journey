import PropTypes from "prop-types";
<<<<<<< HEAD

const NextPreBtn = ({
  currentPage,
  totalPages,
  goToNextPage,
  goToPreviousPage,
}) => {
  const styles = {
    container: {
=======
import "../Dashboard.css";

const NextPreBtn = ({ prevFunc, numberOfPages, nextFunc, count }) => {
  const styles = {
    container: {
      // width: "100%",
>>>>>>> user-area
      display: "flex",
      justifyContent: "flex-end",
    },
    btnBox: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "19px",
    },
    btn: {
      padding: "5px 15px",
      border: "none",
      backgroundColor: "#145098",
<<<<<<< HEAD
      color: "#fff",
      cursor: "pointer",
=======
    },
    btnP: {
      borderRaduis: "25px 0 0 25px",
>>>>>>> user-area
    },
    img: {
      width: "20px",
      height: "20px",
    },
    p: {
      padding: "0 20px",
    },
  };
<<<<<<< HEAD

  return (
    <div style={styles.container}>
      <div style={styles.btnBox}>
        <button
          style={styles.btn}
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          <img style={styles.img} src="/images/arrowleft.png" alt="prev" />
        </button>
        <p style={styles.p}>{`Page ${currentPage} of ${totalPages}`}</p>
        <button
          style={styles.btn}
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
=======
  return (
    <div style={styles.container}>
      <div style={styles.btnBox}>
        <button    disabled={count == 1} style={styles.btn} id="PrevBtn" value="prev" onClick={prevFunc}>
          <img style={styles.img} src="/images/arrowleft.png" alt="prev" />{" "}
        </button>
        <p style={styles.p}>{count}</p>
        <button
          disabled={count == numberOfPages}
          style={styles.btn}
          id="NextBtn"
          value="next"
          onClick={(e) => nextFunc(e)}
>>>>>>> user-area
        >
          <img style={styles.img} src="/images/arrowright.png" alt="next" />
        </button>
      </div>
    </div>
  );
};

NextPreBtn.propTypes = {
<<<<<<< HEAD
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  goToNextPage: PropTypes.func.isRequired,
  goToPreviousPage: PropTypes.func.isRequired,
=======
  nextFunc: PropTypes.func,
  prevFunc: PropTypes.func,
  count: PropTypes.number,
>>>>>>> user-area
};

export default NextPreBtn;
