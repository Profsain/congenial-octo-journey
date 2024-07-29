import PropTypes from "prop-types";
const BocButton = ({
  fontSize = "1rem",
  type,
  width,
  height,
  bgcolor = "#f64f4f",
  bradius,
  cursor,
  margin,
  func,
  disable,
  id,
  children,
}) => {
  const style = {
    backgroundColor: bgcolor,
    color: "#fff",
    textAlign: "center",
    border: "none",
    borderRadius: bradius,
    padding: "16px",
    display: "grid",
    placeContent: "center",
    fontSize: fontSize,
    fontWeight: "500",
    cursor: cursor,
    width: width,
    height: height || "40px",
    margin: margin,
    textTransform: "capitalize",
  };

  return (
    <button id={id} onClick={func} disabled={disable} type={type} style={style}>
      {children}
    </button>
  );
};

BocButton.propTypes = {
  id: PropTypes.string,
  bgcolor: PropTypes.string,
  bradius: PropTypes.string,
  children: PropTypes.string,
  cursor: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  type: PropTypes.string,
  fontSize: PropTypes.string,
  margin: PropTypes.string,
  func: PropTypes.func,
  disable: PropTypes.bool,
};

export default BocButton;
