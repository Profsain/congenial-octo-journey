/* eslint-disable no-undef */
import PropTypes from "prop-types"
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/reducers/adminAuthReducer";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import "./Navigation.css";
import { Link } from "react-router-dom";

const TopNav = ({ settings }) => {
  const { siteTitle } = settings;

  // change navbar color on scroll
  window.addEventListener("scroll", function () {
    const nav = document.querySelector(".Nav");
    nav.classList.toggle("Sticky", window.scrollY > 0);
  });

  // handle logout
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // get current admin
  const currentUser = useSelector((state) => state.adminAuth.user);

  return (
    <div className="TopNavContainer">
      <div className="StackDiv">
        <div>
          <div className="Topnav">
            <div className="BrandCon">
              <Link to="/">
                <img
                  src="../images/boclogo.jpeg"
                  alt="Boctrust Microfinance Bank Logo"
                  width="150px"
                />
              </Link>
            </div>
            <div className="Hero">
              <h1 className="Welcome">
                {siteTitle
                  ? siteTitle
                  : "Welcome to BOCTRUST Microfinance Bank Limited"}
              </h1>
              <p className="Licence">Licenced by Central Bank of Nigeria</p>
            </div>
            <div>
              <button className="CallUs">Licenced by CBN</button>
              <img src="images/cbn.jpeg" alt="cbn" height={40} />
            </div>
          </div>
        </div>

        <div className="BottomStyle">
          {/* navbar section start */}
          <Navbar variant="dark" expand="lg" className="Nav">
            <Container>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto">
                  <Nav.Link href="/" className="mx-4">
                    Home
                  </Nav.Link>

                  {/* about dropdown */}
                  <NavDropdown title="About" id="basic-nav-dropdown">
                    <div className="DropSpace"></div>
                    <NavDropdown.Item className="DropItem" href="/about">
                      Company Overview
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/board" className="DropItem">
                      Our Board
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/careers" className="DropItem">
                      Careers
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                  </NavDropdown>

                  {/* our product dropdown */}
                  <NavDropdown
                    className="DropBox"
                    title="Our Products"
                    id="basic-nav-dropdown"
                  >
                    {/* savings dropdown start*/}
                    <NavDropdown
                      title="Savings"
                      id="basic-nav-dropdown"
                      className="DropBox"
                    >
                      <NavDropdown.Item href="/regular-savings">
                        Regular Savings
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="/target-savings">
                        Target Savings
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="/ajo-plus-account">
                        Ajo Plus Account
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </NavDropdown>
                    {/* saving dropdown end */}

                    {/* Investment dropdown start*/}
                    <NavDropdown
                      title="Investment"
                      id="basic-nav-dropdown"
                      className="DropBox"
                    >
                      <NavDropdown.Item href="/fixed-investment">
                        Fixed Deposit
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="/investment-note">
                        Investment Notes
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </NavDropdown>
                    {/* investment dropdown end */}

                    {/* loans dropdown start*/}
                    <NavDropdown
                      title="Loans"
                      id="basic-nav-dropdown"
                      className="DropBox"
                    >
                      <NavDropdown.Item href="/salary-advance">
                        Salary Advance
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="/personal-loan">
                        Personal Loan
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="/sme-loan">
                        SME Loan
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/asset-backed-financing">
                        Asset Backed Financing
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </NavDropdown>
                    {/* loans dropdown end */}

                    {/* advisory dropdown start*/}
                    <NavDropdown
                      title="Advisory Services"
                      id="basic-nav-dropdown"
                      className="DropBox"
                    >
                      <NavDropdown.Item href="/small-business-advisory">
                        Small Business Advisory
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="/micro-insurance-advisory">
                        Micro Insurance Advisory
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="/financial-advisory">
                        Financial Advisory
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </NavDropdown>
                    {/* advisory dropdown end */}
                  </NavDropdown>

                  {/* top level menu item */}
                  <Nav.Link href="/loan" className="mx-4">
                    Apply for Loan
                  </Nav.Link>
                  <Nav.Link href="/support" className="mx-4">
                    Support
                  </Nav.Link>
                  <Nav.Link href="/blogs" className="mx-4">
                    Blogs
                  </Nav.Link>
                  <Nav.Link href="/contact" className="mx-4">
                    Contact
                  </Nav.Link>
                  {currentUser ? (
                    <Nav.Link
                      href="/login"
                      onClick={handleLogout}
                      className="mx-4"
                    >
                      Logout
                    </Nav.Link>
                  ) : (
                    <Nav.Link href="/login" className="mx-4">
                      Login
                    </Nav.Link>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
      </div>
    </div>
  );
};

TopNav.propTypes = {
  settings: PropTypes.any
}

export default TopNav;
