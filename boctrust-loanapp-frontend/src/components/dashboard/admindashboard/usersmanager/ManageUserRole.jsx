import { useState } from "react";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import NextPreBtn from "../../shared/NextPreBtn";
import RoleList from "./RoleList";
import { Modal, Button } from "react-bootstrap";

const ManageUserRole = () => {
  const [showAddNew, setShowAddNew] = useState(false);
  const [showCount, setShowCount] = useState(10);
  const [searchTerms, setSearchTerms] = useState("");
  const handleAddNew = () => setShowAddNew(true);

  return (
    <div className="MainBox">
      <div className="BlogSection">
        <div className="AddBtn">
          <BocButton func={handleAddNew} bgcolor="#ecaa00" bradius="22px">
            <div className="d-flex gap-1 align-items-center">
              <span>+</span> Add New Role
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
                <img src="images/search.png" alt="search-icon" />
              </div>
            </div>
          </DashboardHeadline>
        </div>
        <div>
          {/* users list  */}
          <RoleList count={showCount} searchTerms={searchTerms} />
          {/* next and previous button  */}
          <NextPreBtn />
        </div>
      </div>

      <div>
        <Modal show={showAddNew} backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>{"Create New Role"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="new__roleForm">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  aria-describedby="name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  aria-label="description"
                ></textarea>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddNew(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowAddNew(true)}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ManageUserRole;
