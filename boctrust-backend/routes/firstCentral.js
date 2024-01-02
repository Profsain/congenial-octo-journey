const express = require('express');
const router = express.Router();
// import first central methods
const loginFirstCentral = require("../firstCentralMethods/loginFirstCentral");
const consumerMatch = require("../firstCentralMethods/getConsumerMatch");


router.post('/firstcentralreport', async (req, res) => {

  const { bvn } = req.body;

  // get first central login
  const login = await loginFirstCentral();
  const dataTicket = login[0].DataTicket;

  let consumer;
  if (dataTicket) {
    consumer = await consumerMatch(bvn, dataTicket);
  }

  const { MatchingEngineID, EnquiryID, ConsumerID } = consumer[0];

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "DataTicket": dataTicket,
    "consumerID": ConsumerID,
    "EnquiryID": EnquiryID,
    "consumerMergeList": "",
    "SubscriberEnquiryEngineID": MatchingEngineID,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  try {
    const response = await fetch("https://online.firstcentralcreditbureau.com/firstcentralrestv2/GetConsumerFullCreditReport", requestOptions);

    if (!response) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    res.status(200).json({
      message: "First central api called successfully",
      data: result
    });

  } catch (error) {
    throw new Error(error);
  }

});

// export router
module.exports = router;
