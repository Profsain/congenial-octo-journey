import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Overview.css";

const OurBoard = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="VisionLeft col-md-6 col-sm-12">
          <h3>Meet Our Board</h3>
          <div>
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography sx={{ width: "53%", flexShrink: 0 }}>
                  Isaac OROLUGBAGBE
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  - Chairman
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Isaac Orolugbagbe (FCA) is the Chairman, Board of Directors,
                  BOCTRUST Microfinance Bank Limited, Nigeria’s reputable Bank
                  for the active poor. He is also the Chief Executive Officer of
                  Isaac Development Company, a leading company with expertise in
                  Management, Strategy, Leadership & Organization Development
                  and Business Incubation Consultancy. He sits on the Board of
                  Sifax Group Nigeria a company with interests in Ports & Cargo,
                  Aviation Handling, Shipping, Haulage, Oil & Gas and Marine.
                  His other Directorship/Board appointments include Red Star
                  Express Plc., Beta Computers Limited; Western Cape Wines
                  Limited and Obafemi Awolowo University Advancement Board and
                  was on the Board of Thomas Wyatt Nigeria Plc., Isaac is a
                  graduate of Chemistry from University of Ife (now Obafemi
                  Awolowo University), Nigeria; Fellow of the Institute of
                  Chartered Accountants of Nigeria (FCA), Fellow, Institute of
                  Directors (FIoD), an Associate of the Nigerian Institute of
                  management (ANIMN) & Chartered Institute of Taxation of
                  Nigeria (ACITN) and a Member of the Society for Corporate
                  Governance Nigeria (SCGN). He is an alumna of the Master of
                  Business Leadership (MBL), University of South Africa, South
                  Africa, a Business Strategy Instructor of the Society for
                  Corporate Governance Lagos Business School and an Adjunct
                  Faculty (Business Strategy/Governance) of Strathmore Business
                  School, Nairobi Kenya. An erudite Executive trained in FedEx
                  EMEA Brussels, Wits Business School, Johannesburg and Lagos
                  Business School amongst others. Over the course of his
                  sterling career, he has garnered diverse expertise in
                  Accounting and Internal Controls, Auditing & Taxation
                  Services, Treasury and Financial Management, Corporate
                  Governance, Corporate Strategy Development and Implementation,
                  Corporate Finance and Business/Financial Advisory. He
                  transformed Red Star Express Plc (FEDEX) from a revenue of
                  N180m to N3b between 1997 and 2007 and eventual listing of the
                  company on the floor of the Nigeria Stock Exchange (NSE) as
                  Managing Director/CEO. He was the MD/CEO Skyway Aviation
                  Handling Company Limited (SAHCOL) January 2010 to December,
                  2011 and Executive Director, Projects & Group Services SIFAX
                  Group Nigeria between January 2012 and October, 2013 He is
                  happily married with four wonderful children.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <Typography sx={{ width: "53%", flexShrink: 0 }}>
                  Dr. Kunle Alonge
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  - Director
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="AccordionContent">
                  <div className="AccordionContentImg">
                    <img
                      src="/images/board/DrKunle.jpg"
                      alt=" Dr. Kunle Alonge"
                    />
                  </div>
                  <Typography>
                    Kunle holds a BSc Accounting from Obafemi Awolowo
                    University, a Master’s degree in Finance from Texas Tech
                    University USA, Ph.D. in finance from the University of
                    Lagos and is a Fellow of the Institute of Chartered
                    Accountants of Nigeria. He worked in Nigeria with Oceanic
                    Bank and Reliance Bank and also worked in the USA with 3
                    Fortune500 companies namely Wells Fargo Bank, KPMG LLP and
                    JPMorgan Chase. He has nearly 30 years of diverse experience
                    in treasury services, operations/risk management, business
                    management and advisory. He has a solid background in global
                    financial markets analysis, economic policy
                    formulation/implications, business development, financial
                    analysis and relationship management. He is a proven
                    entrepreneur, an astute leader and mentor and he is the CEO
                    of Sonora Capital and Investment Limited.
                  </Typography>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
              >
                <Typography sx={{ width: "53%", flexShrink: 0 }}>
                  Odunmbaku Akinlawon Olamide
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  - Director
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="AccordionContent">
                  <div className="AccordionContentImg">
                    <img
                      src="/images/board/OlamideOdunmbaku.jpg"
                      alt="Odunmbaku Akinlawon Olamide"
                    />
                  </div>
                  <div>
                    <Typography>
                      Mr. Olamide A. Odunmbaku (HND, PGD, CPD, MBA, EMBA, MCIB,
                      ACA) officially joined BOCTRUST MFB March 2024, as the
                      MD/CEO.
                    </Typography>
                    <Typography>
                      He is an astute professional with over 17 yearsI&apos;
                      core experience in Credit Analysis and management, Credit
                      Restructuring, financial analysis and interpretation,
                      facility structuring, people management, Management of Key
                      risk indicators of the organization, Risk register,
                      compliance to major regulatory provisions et al. In the
                      course of his professional journey, Mr. Odunmbaku has
                      worked in the following organizations: Integrated
                      Microfinance Bank Limited, Fina Trust Microfinance Bank
                      Limited, Personal Trust Microfinance Bank Limited,
                      Purplemoney Microfinance Bank Limited, IBILE Microfinance
                      Bank Limited and Moneyfield Microfinance Bank Limited. Mr.
                      Odunmbaku is a graduate of Biochemistry from Yaba College
                      of Technology - YABATECH Lagos and holds a Post Graduate
                      Diploma (PGD) in Accounting and a Master of Business
                      Administration (Finance) from Ladoke Akintola University
                      of Technology, Ogbomosho Oyo State. He also holds a
                      Certified Professional Diploma (CPD) in Credit Management
                      from Postgraduate School of Credit and Financial
                      Management. Olamide is an Associate Member of Institute of
                      Chartered Accountant of Nigeria (ICAN), an Affiliate
                      Member of Global Association of Risk Professionals (GARP),
                      a Member of Chartered Institute of Loan and Risk
                      Management of Nigeria (CILRMN) and a Certified
                      Microfinance Professional (MCP). He recently (May 2023)
                      bagged an Executive MBA from Quantic School of Business
                      and Technology, Washington DC, USA.
                    </Typography>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === "panel4"}
              onChange={handleChange("panel4")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4bh-content"
                id="panel4bh-header"
              >
                <Typography sx={{ width: "53%", flexShrink: 0 }}>
                  Nkolika Nebechi Okoli (Ms)
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  - Director
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="AccordionContent">
                  <div className="AccordionContentImg">
                    <img
                      src="/images/board/Nkoli.jpg"
                      alt=" Nkolika Nebechi Okoli (Ms)"
                    />
                  </div>
                  <div>
                    <Typography>
                      With experience in the Financial services sector spanning
                      over 25 years, Nkoli has had a distinguished career in
                      Banking with expertise in Retail (Consumer and SME) and
                      Commercial banking, Credit, Operations and Strategy. With
                      an MBA (Distinction) from the University of Durham
                      Business School, United Kingdom; Nkoli’s wide career
                      experience encompasses 15 years in Executive Management,
                      18 years in relationship management across various
                      customer segments as well as customer services, product
                      development/management and corporate governance.
                    </Typography>
                    <Typography>
                      She has served on the board of Stanbicibtc Insurance
                      Brokers as a Non-Executive Director and as the Country
                      Head (Nigeria), Personal Banking Business, Stanbicibtc
                      Bank where she was responsible for the Profit and Loss as
                      well as driving strategic decisions of the banks Personal
                      Banking Business.
                    </Typography>
                    <Typography>
                      Prior to this, she was the Group Head, Retail (Personal &
                      SME) bank, for a leading Tier 2 bank where she
                      collaborated with IFC specialists to develop a 5 year
                      strategy to drive the banks Retail business.
                    </Typography>
                    <Typography>
                      Nkolika is passionate about social impact and loves
                      supporting orphanages and other groups focused on
                      children’s education and medical aid to the
                      underprivileged.
                    </Typography>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === "panel4"}
              onChange={handleChange("panel4")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4bh-content"
                id="panel4bh-header"
              >
                <Typography sx={{ width: "53%", flexShrink: 0 }}>
                  Abiola Olowude
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  - Director
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="AccordionContent">
                  <div className="AccordionContentImg">
                    <img
                      src="/images/board/Olowude.jpeg.jpg"
                      alt="Abiola Olowude"
                    />
                  </div>
                  <div>
                    <Typography>
                      Abiola Olowude is a seasoned Wealth and Fund Management
                      Consultant whose career journey exemplifies versatility
                      and excellence.
                    </Typography>
                    <Typography>
                      Her professional path began in the field of education,
                      where she dedicated a decade to teaching at both secondary
                      and tertiary levels.
                    </Typography>
                    <Typography>
                      She then transitioned seamlessly into the banking sector,
                      where she honed her skills across various domains,
                      including Banking Operations, Retail and Commercial
                      Banking, and Funds & Relationship Management, over the
                      course of two decades.
                    </Typography>
                    <Typography>
                      During her tenure in banking, Abiola rose to the Senior
                      Management echelon within a leading commercial bank before
                      embarking on a new chapter at Radix Capital, an esteemed
                      independent Investment Banking institution.
                    </Typography>
                    <Typography>
                      At Radix Capital, she distinguished herself by overseeing
                      the Private Funds and Wealth Management Unit,
                      demonstrating her adeptness in financial strategy and
                      client engagement.
                    </Typography>
                    <Typography>
                      Mrs. Olowude currently consults for private clients on
                      growing and managing wealth and real estate.
                    </Typography>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>

        <div className="VisionRight col-md-6 col-sm-12">
          <img
            className="TopImg"
            src="images/boctrust-staff1.avif"
            alt="bocstrust-microfinance-staff"
          />
        </div>
      </div>
    </div>
  );
};

export default OurBoard;
