import { useState } from "react"; 
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import AllLoans from "./AllLoans";

const LoanDashboard = () => {
  // handle search
  const [showCount, setShowCount] = useState(10);
  const [searchTerms, setSearchTerms] = useState("");

  return (
    <div className="MainBox">
      {/* top search bar */}
      <div className="Search">
        <DashboardHeadline padding="0" height="70px" bgcolor="#d9d9d9">
          <div className="SearchBar">
            <div className="FormGroup">
              <label htmlFor="show">Show</label>
              <input 
                name="showCount" 
                type="number"
                step={10}
                min={10}
                value={showCount}
                onChange={(e) => setShowCount(e.target.value)}
              />
            </div>
            <div className="FormGroup SBox">
              <input 
                name="search" 
                placeholder="Search by name"
                onChange={(e) => setSearchTerms(e.target.value)}
              />
              <img src="images/search.png" alt="search-icon" />
            </div>
          </div>
        </DashboardHeadline>
      </div>
      <div>
        <div className="ListSec">
          {/* Loans list  */}
          <AllLoans showCount={ showCount} searchTerms={searchTerms} />
        </div>
      </div>
    </div>
  );
};

export default LoanDashboard;
