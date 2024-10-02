import { useState } from "react";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import NextPreBtn from "../../shared/NextPreBtn";
import UsersList from "./UsersList";
import { useNavigate } from "react-router-dom";

const UserManagerDashboard = () => {
  const [showCount, setShowCount] = useState(10);
  const [searchTerms, setSearchTerms] = useState("");

  const navigate = useNavigate()

  return (
    <div className="MainBox">
      <div className="BlogSection">
        <div className="AddBtn">
          <BocButton func={() => navigate("/dashboard/users/add")} bgcolor="#ecaa00" bradius="22px">
            <div className="d-flex gap-1 align-items-center">
              <span>+</span> Add New User
            </div>
          </BocButton>
        </div>
        {/* top search bar */}
        <div className="Search">
          <DashboardHeadline
            mspacer="40px 0"
            padding="0"
            height="70px"
            bgcolor="#d9d9d9"
          >
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
                  placeholder="Search"
                  value={searchTerms}
                  onChange={(e) => setSearchTerms(e.target.value)}
                />
                <img src="/images/search.png" alt="search-icon" />
              </div>
            </div>
          </DashboardHeadline>
        </div>
        <div>
          {/* users list  */}
          <UsersList count={showCount} searchTerms={searchTerms} />
          {/* next and previous button  */}
          <NextPreBtn />
        </div>
      </div>
    </div>
  );
};

export default UserManagerDashboard;
