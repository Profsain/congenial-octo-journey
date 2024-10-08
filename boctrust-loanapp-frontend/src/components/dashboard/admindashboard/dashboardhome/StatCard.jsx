import PropTypes from "prop-types";
const StatCard = ({ day, date, stat, datecolor }) => {
  const styles = {
    container: {
      width: "100%",
      height: "115px",
      padding: "1rem",
      backgroundColor: "#fff",
      textAlign: "right",
    },
    top: {
      display: "flex",
      justifyContent: "space-between",
        alignItems: "center",
      borderBottom: "1px solid #ccc",
    },
    day: {
      fontWeight: "900",
      fontSize: "1rem",
    },
    date: {
      fontSize: "0.8rem",
      backgroundColor: datecolor,
      color: "#fff",
      padding: "0.2rem 0.5rem",
      borderRadius: "5px",
    },
    stat: {
      fontSize: "1.5rem",
    },
  };
  return (
    <div style={styles.container}>
      <div style={styles.top}>
        <p style={styles.day}>{day}</p>
        <p style={styles.date}>{date}</p>
      </div>
      <p style={styles.stat}>{stat}</p>
    </div>
  );
};

StatCard.propTypes = {
  date: PropTypes.string,
  day: PropTypes.string,
  stat: PropTypes.string,
  datecolor: PropTypes.string,
};

export default StatCard;
