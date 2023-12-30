import PropTypes from "prop-types";
import { useState } from "react";
import Headline from "../../../shared/Headline";
import BocButton from "../../shared/BocButton";

const ViewBySection = ({ setSearch }) => {
  const styles = {
    btnBox: {
      display: "flex",
      justifyContent: "center",
    },
    inputBox: {
      width: "40%",
      border: "1px solid #ecaa00",
      borderRadius: "25px",
      padding: "0.5rem 1rem",
      margin: "1rem",
    },
  };

  const [showSearchName, setShowSearchName] = useState(false);
  // const [searchTerms, setSearchTerms] = useState("");

  const handleSearchName = () => {
    // toggle search name input
    if (showSearchName) {
      setSearch("");
      setShowSearchName(false);
    } else {
      setShowSearchName(true);
    }
  };

  return (
    <div>
      <Headline text="View by:" />
      <div style={styles.btnBox} className="VBox">
        <BocButton margin="8px 18px" bgcolor="#ecaa00" bradius="25px">
          Applicant Today
        </BocButton>
        <BocButton margin="8px 18px" bgcolor="#ecaa00" bradius="25px">
          Date Range
        </BocButton>
        <BocButton
          margin="8px 18px"
          bgcolor="#ecaa00"
          bradius="25px"
          func={handleSearchName}
        >
          Specific Customer
        </BocButton>
      </div>
      <div style={styles.btnBox} className="searchByBox">
        {showSearchName && (
          <input
            type="text"
            placeholder="search by name"
            style={styles.inputBox}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
      </div>
    </div>
  );
};

ViewBySection.propTypes = {
  setSearch: PropTypes.func,
};

export default ViewBySection;
