import { useState } from "react";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "./Customer.css";
import CustomersList from "./CustomersList";

const CustomersDashboard = () => {
  // handle search
  const [showCount, setShowCount] = useState(10);
  const [searchTerms, setSearchTerms] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  

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
              <img src="/images/search.png" alt="search-icon" />
            </div>
          </div>
        </DashboardHeadline>
      </div>
      <div>
        {/* customers list  */}
        <div className="ListSec">
          <CustomersList
            showCount={showCount}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            searchTerms={searchTerms}
          />
        </div>
       
      </div>
    </div>
  );
};

export default CustomersDashboard;
