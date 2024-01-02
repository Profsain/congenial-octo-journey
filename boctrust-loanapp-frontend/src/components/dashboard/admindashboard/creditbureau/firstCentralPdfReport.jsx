/* eslint-disable no-undef */
import PropTypes from "prop-types";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    color: "black",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    textDecoration: "underline",
    color: "#145980",
  },
  viewer: {
    width: window.innerWidth, //the pdf viewer will take up all of the width and height
    height: window.innerHeight,
  },
});

const FirstCentralPdfReport = ({ report }) => {
  const creditReport = report[3].CreditAccountSummary[0];
  const bioData = report[1].PersonalDetailsSummary[0];

  // check if creditReport is not empty
  if (!creditReport) {
    return (
      <PDFViewer style={styles.viewer}>
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text style={styles.title}>First Central Credit Check</Text>
            </View>
            <View style={styles.section}>
              <Text>No data</Text>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    );
  }
  const {
    Amountarrear,
    LastJudgementDate,
    TotalAccount,
    TotalMonthlyInstalment,
    TotalOutstandingdebt,
  } = creditReport;

  // check if bioData is not empty
  if (!bioData) {
    return (
      <PDFViewer style={styles.viewer}>
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text style={styles.title}>First Central Credit Check</Text>
            </View>
            <View style={styles.section}>
              <Text>No data</Text>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    );
  }
  const { Header, BankVerificationNo, ConsumerID } = bioData;

  return (
    <PDFViewer style={styles.viewer}>
      {/* Start of the document*/}
      <Document>
        {/*render a single page*/}
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>First Central Credit Check</Text>
          </View>
          <View style={styles.section}>
            <Text>{Header}</Text>
          </View>
          <View style={styles.section}>
            <Text>Customer ID: {ConsumerID}</Text>
          </View>
          <View style={styles.section}>
            <Text>BVN: {BankVerificationNo}</Text>
          </View>
          <View style={styles.section}>
            <Text>
              Amount Arrear: {Amountarrear ? Amountarrear : "No data"}
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              Last Payment Date:{" "}
              {LastJudgementDate ? LastJudgementDate : "No data"}
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              Total Account: {TotalAccount ? TotalAccount : "No data"}
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              Total Monthly Installment:{" "}
              {TotalMonthlyInstalment ? TotalMonthlyInstalment : "No data"}
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              Total OutStanding Debt:{" "}
              {TotalOutstandingdebt ? TotalOutstandingdebt : "No data"}
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

FirstCentralPdfReport.propTypes = {
  report: PropTypes.shape({
    Amountarrear: PropTypes.any,
    LastJudgementDate: PropTypes.any,
    TotalAccount: PropTypes.any,
    TotalAccountarrear: PropTypes.any,
    TotalMonthlyInstalment: PropTypes.any,
    TotalOutstandingdebt: PropTypes.any,
    applicantName: PropTypes.string,
    searchBy: PropTypes.string,
    searchDate: PropTypes.string,
    searchType: PropTypes.string,
  }),
};

export default FirstCentralPdfReport;
