import Header from "../shared/Header";
import "./OurBoardPage.css";

const OurBoardPage = () => {
  const container = {
    fontSize: "18px",
    letterSpacing: "1.5px",
    lineHeight: "32px",
  };
  return (
    <>
      <Header imgurl="images/bocboard.jpg" />

      {/* our board accordion section */}
      <div
        className="accordion accordion-flush"
        id="accordionFlushExample"
        style={container}
      >
        {/* =============================== */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseOne"
              aria-expanded="false"
              aria-controls="flush-collapseOne"
            >
              Isaac OROLUGBAGBE - Chairman
            </button>
          </h2>
          <div
            id="flush-collapseOne"
            className="accordion-collapse collapse show"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body px-5">
              <p>
                Isaac Orolugbagbe (FCA) is the Chairman, Board of Directors,
                BOCTRUST Microfinance Bank Limited, Nigeria’s reputable Bank for
                the active poor. He is also the Chief Executive Officer of Isaac
                Development Company, a leading company with expertise in
                Management, Strategy, Leadership & Organization Development and
                Business Incubation Consultancy. He sits on the Board of Sifax
                Group Nigeria a company with interests in Ports & Cargo,
                Aviation Handling, Shipping, Haulage, Oil & Gas and Marine. His
                other Directorship/Board appointments include Red Star Express
                Plc., Beta Computers Limited; Western Cape Wines Limited and
                Obafemi Awolowo University Advancement Board and was on the
                Board of Thomas Wyatt Nigeria Plc., Isaac is a graduate of
                Chemistry from University of Ife (now Obafemi Awolowo
                University), Nigeria; Fellow of the Institute of Chartered
                Accountants of Nigeria (FCA), Fellow, Institute of Directors
                (FIoD), an Associate of the Nigerian Institute of management
                (ANIMN) & Chartered Institute of Taxation of Nigeria (ACITN) and
                a Member of the Society for Corporate Governance Nigeria (SCGN).
              </p>
              <p>
                He is an alumna of the Master of Business Leadership (MBL),
                University of South Africa, South Africa, a Business Strategy
                Instructor of the Society for Corporate Governance Lagos
                Business School and an Adjunct Faculty (Business
                Strategy/Governance) of Strathmore Business School, Nairobi
                Kenya. An erudite Executive trained in FedEx EMEA Brussels, Wits
                Business School, Johannesburg and Lagos Business School amongst
                others. Over the course of his sterling career, he has garnered
                diverse expertise in Accounting and Internal Controls, Auditing
                & Taxation Services, Treasury and Financial Management,
                Corporate Governance, Corporate Strategy Development and
                Implementation, Corporate Finance and Business/Financial
                Advisory.
              </p>
              <p>
                He transformed Red Star Express Plc (FEDEX) from a revenue of
                N180m to N3b between 1997 and 2007 and eventual listing of the
                company on the floor of the Nigeria Stock Exchange (NSE) as
                Managing Director/CEO. He was the MD/CEO Skyway Aviation
                Handling Company Limited (SAHCOL) January 2010 to December, 2011
                and Executive Director, Projects & Group Services SIFAX Group
                Nigeria between January 2012 and October, 2013 He is happily
                married with four wonderful children.
              </p>
            </div>
          </div>
        </div>
        {/* ================================== */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseTwo"
              aria-expanded="false"
              aria-controls="flush-collapseTwo"
            >
              Dr Kunle Alonge - Director
            </button>
          </h2>
          <div
            id="flush-collapseTwo"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="BoardMember">
              <div className="BoardMemberImg">
                <img
                  className="w-100"
                  src="/images/board/DrKunle.jpg"
                  alt=" Dr. Kunle Alonge"
                />
              </div>
              <div className="accordion-body px-5">
                <p>
                  Has over 27years(with twelve at senior executive management
                  levels) experience in banking (Corporate and Retail),
                  Corporate Finance, SME, etc, in Nigeria and Africa. Previously
                  served as Managing Director/Regional Head of Commercial
                  Clients for Africa at Standard Chartered Bank Africa -
                  covering countries in West, East and Southern Africa. Prior to
                  that, served as Deputy CEO at FCMB, and Regional Director
                  Client Relationships at Standard Chartered Bank East Africa -
                  covering Kenya, Uganda and Tanzania.
                </p>
                <p>
                  He also served at various middle and senior level positions in
                  Standard Chartered Bank Nigeria, Zenith Bank and erstwhile
                  Chartered Bank Nigeria Limited Segun was a University of Lagos
                  Scholar, graduating with both Bachelors and Masters of Science
                  degrees in Banking and Finance from the University. He has
                  attended various leadership and specialized courses in top
                  notch universities such as HARVARD BUSINESS SCHOOL, OXFORD
                  UNIVERSITY (SAID BUSINESS SCHOOL) AND LONDON BUSINESS SCHOOL.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseThree"
              aria-expanded="false"
              aria-controls="flush-collapseThree"
            >
              Odunmbaku Akinlawon Olamide (HND, PGD, CPD, MBA, EMBA, MCIB, ACA.)
              - Director
            </button>
          </h2>
          <div
            id="flush-collapseThree"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="BoardMember">
              <div className="BoardMemberImg">
                <img
                  className="w-100"
                  src="/images/board/OlamideOdunmbaku.jpg"
                  alt=" Dr. Kunle Alonge"
                />
              </div>
              <div className="accordion-body px-5">
                <p>
                  Mr. Olamide A. Odunmbaku officially joined BOCTRUST MFB March
                  2024, as the MD/CEO.
                </p>
                <p>
                  He is an astute professional with over 17 years’ core
                  experience in Credit Analysis and management, Credit
                  Restructuring, financial analysis and interpretation, facility
                  structuring, people management, Management of Key risk
                  indicators of the organization, Risk register, compliance to
                  major regulatory provisions et al.
                </p>
                <p>
                  In the course of his professional journey, Mr. Odunmbaku has
                  worked in the following organizations: Integrated Microfinance
                  Bank Limited, Fina Trust Microfinance Bank Limited, Personal
                  Trust Microfinance Bank Limited, Purplemoney Microfinance Bank
                  Limited, IBILE Microfinance Bank Limited and Moneyfield
                  Microfinance Bank Limited.
                </p>
                <p>
                  Mr. Odunmbaku is a graduate of Biochemistry from Yaba College
                  of Technology - YABATECH Lagos and holds a Post Graduate
                  Diploma (PGD) in Accounting and a Master of Business
                  Administration (Finance) from Ladoke Akintola University of
                  Technology, Ogbomosho Oyo State. He also holds a Certified
                  Professional Diploma (CPD) in Credit Management from
                  Postgraduate School of Credit and Financial Management.
                  Olamide is an Associate Member of Institute of Chartered
                  Accountant of Nigeria (ICAN), an Affiliate Member of Global
                  Association of Risk Professionals (GARP), a Member of
                  Chartered Institute of Loan and Risk Management of Nigeria
                  (CILRMN) and a Certified Microfinance Professional (MCP).
                </p>
                <p>
                  He recently (May 2023) bagged an Executive MBA from Quantic
                  School of Business and Technology, Washington DC, USA
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseFive"
              aria-expanded="false"
              aria-controls="flush-collapseFive"
            >
              Nkolika Nebechi Okoli (Ms) - Director
            </button>
          </h2>
          <div
            id="flush-collapseFive"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="BoardMember">
              <div className="BoardMemberImg">
                <img
                  className="w-100"
                  src="/images/board/Nkoli.jpg"
                  alt=" Dr. Kunle Alonge"
                />
              </div>
              <div className="accordion-body px-5">
                <p>
                  With experience in the Financial services sector spanning over
                  25 years, Nkoli has had a distinguished career in Banking with
                  expertise in Retail (Consumer and SME) and Commercial banking,
                  Credit, Operations and Strategy. With an MBA (Distinction)
                  from the University of Durham Business School, United Kingdom;
                  Nkoli’s wide career experience encompasses 15 years in
                  Executive Management, 18 years in relationship management
                  across various customer segments as well as customer services,
                  product development/management and corporate governance.
                </p>
                <p>
                  She has served on the board of Stanbicibtc Insurance Brokers
                  as a Non-Executive Director and as the Country Head (Nigeria),
                  Personal Banking Business, Stanbicibtc Bank where she was
                  responsible for the Profit and Loss as well as driving
                  strategic decisions of the banks Personal Banking Business.
                </p>
                <p>
                  Prior to this, she was the Group Head, Retail (Personal & SME)
                  bank, for a leading Tier 2 bank where she collaborated with
                  IFC specialists to develop a 5 year strategy to drive the
                  banks Retail business.
                </p>
                <p>
                  Nkolika is passionate about social impact and loves supporting
                  orphanages and other groups focused on children’s education
                  and medical aid to the underprivileged.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseSix"
              aria-expanded="false"
              aria-controls="flush-collapseSix"
            >
              Abiola Olowude - Director
            </button>
          </h2>
          <div
            id="flush-collapseSix"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="BoardMember">
              <div className="BoardMemberImg">
                <img
                  className="w-100"
                  src="/images/board/Olowude.jpg"
                  alt=" Dr. Kunle Alonge"
                />
              </div>
              <div className="accordion-body px-5">
                <p>
                  Abiola Olowude is a seasoned Wealth and Fund Management
                  Consultant whose career journey exemplifies versatility and
                  excellence.
                </p>
                <p>
                  Her professional path began in the field of education, where
                  she dedicated a decade to teaching at both secondary and
                  tertiary levels.
                </p>
                <p>
                  She then transitioned seamlessly into the banking sector,
                  where she honed her skills across various domains, including
                  Banking Operations, Retail and Commercial Banking, and Funds &
                  Relationship Management, over the course of two decades.
                </p>
                <p>
                  During her tenure in banking, Abiola rose to the Senior
                  Management echelon within a leading commercial bank before
                  embarking on a new chapter at Radix Capital, an esteemed
                  independent Investment Banking institution.
                </p>
                <p>
                  At Radix Capital, she distinguished herself by overseeing the
                  Private Funds and Wealth Management Unit, demonstrating her
                  adeptness in financial strategy and client engagement.
                </p>
                <p>
                  Mrs. Olowude currently consults for private clients on growing
                  and managing wealth and real estate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurBoardPage;
