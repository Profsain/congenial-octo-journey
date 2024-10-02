import { useState } from "react";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import NextPreBtn from "../../shared/NextPreBtn";
import BlogsList from "./BlogsList";
import AddNewBlog from "./AddNewBlog";

const WebsiteManagerDashboard = () => {
  const [showAddNew, setShowAddNew] = useState(false);
  const [searchTerms, setSearchTerms] = useState("");
  const [showCount, setShowCount] = useState(10);
  const handleAddNew = () => setShowAddNew(true);

  return (
    <div className="MainBox">
      {!showAddNew ? (
        <div className="BlogSection">
          <div className="AddBtn">
            <BocButton func={handleAddNew} bgcolor="#ecaa00" bradius="22px">
              <span>+</span> Add New Blog
            </BocButton>
          </div>
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

                {/* search bar input */}
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
            {/* blogs list  */}
            <BlogsList count={ showCount} searchTerms={searchTerms} />
            {/* next and previous button  */}
            <NextPreBtn />
          </div>
        </div>
      ) : (
        <AddNewBlog func={setShowAddNew} />
      )}
    </div>
  );
};

export default WebsiteManagerDashboard;
