const express = require("express");
const router = express.Router();
// import first central methods
const loginFirstCentral = require("../firstCentralMethods/loginFirstCentral");
const consumerMatch = require("../firstCentralMethods/getConsumerMatch");
const commercialMatch = require("../firstCentralMethods/getCommercialMatch");

router.post("/firstcentralreport", async (req, res) => {
  const { bvn } = req.body;

  // get first central login
  const login = await loginFirstCentral();
  const dataTicket = login[0].DataTicket;

  let consumer;
  if (dataTicket) {
    consumer = await consumerMatch(bvn, dataTicket);
  }

  const { MatchingEngineID, EnquiryID, ConsumerID } = consumer[0];
  console.log(
    MatchingEngineID,
    EnquiryID,
    ConsumerID,
    "MatchingEngineID, EnquiryID, ConsumerID"
  );
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    DataTicket: dataTicket,
    consumerID: ConsumerID,
    EnquiryID: EnquiryID,
    consumerMergeList: "",
    SubscriberEnquiryEngineID: MatchingEngineID,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://online.firstcentralcreditbureau.com/firstcentralrestv2/GetConsumerFullCreditReport",
      requestOptions
    );

    if (!response) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    res.status(200).json({
      message: "First central api called successfully",
      data: result,
    });
  } catch (error) {
    console.log(error, "firstcentralcreditbureau");
    throw new Error(error);
  }
});

// get commercial report
router.post("/firstcentralCommercialReport", async (req, res) => {
  const { bvn } = req.body;
  const businessName = bvn;

  // get first central login
  const login = await loginFirstCentral();
  const dataTicket = login[0].DataTicket;

  let commercial;
  if (dataTicket) {
    commercial = await commercialMatch(businessName, dataTicket);
  }

  const { MatchingEngineID, SubscriberEnquiryID, CommercialID } = commercial[0];

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    DataTicket: dataTicket,
    commercialID: CommercialID,
    EnquiryID: SubscriberEnquiryID,
    commercialMergeList: "",
    SubscriberEnquiryEngineID: MatchingEngineID,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://online.firstcentralcreditbureau.com/firstcentralrestv2/GetCommercialFullCreditReport",
      requestOptions
    );

    if (!response) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      res.status(200).json({
        message: "First central api called successfully",
        data: result,
      });
    } else {
      throw new Error("Response is not in JSON format");
    }
  } catch (error) {
    console.log(error);
  }
});

// export router
module.exports = router;
