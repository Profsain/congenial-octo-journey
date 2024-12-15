import { useState } from "react";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import RepaymentList from "./RepaymentList";
import NextPreBtn from "../../shared/NextPreBtn";

// custom hook
import usePagination from "../../../../customHooks/usePagination";

const LoanDashboard = () => {
  // handle search
  const [showCount, setShowCount] = useState(5);
  const [searchTerms, setSearchTerms] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPages);

  return (
    <div className="MainBox">
      {/* top search bar */}
      <div className="Search">
        <DashboardHeadline padding="0" bgcolor="#d9d9d9">
          <div className="SearchBar">
            <div className="FormGroup">
              <label htmlFor="show">Show</label>
              <input
                name="showCount"
                type="number"
                step={5}
                min={5}
                value={showCount}
                onChange={(e) => setShowCount(e.target.value)}
              />
            </div>
            <div className="FormGroup SBox">
              <input
                name="search"
                placeholder="branch name"
                value={searchTerms}
                onChange={(e) => setSearchTerms(e.target.value)}
              />
              <img src="/images/search.png" alt="search-icon" />
            </div>
          </div>
        </DashboardHeadline>
      </div>

      <div className="ListSec">
        {/* repayment list  */}
        <RepaymentList
          count={showCount}
          searchTerms={searchTerms}
          setTotalPages={setTotalPages}
          currentPage={currentPage}
        />

        {/* next and previous button */}
        <NextPreBtn
          currentPage={currentPage}
          totalPages={totalPages}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
        />
      </div>
    </div>
  );
};

export default LoanDashboard;
