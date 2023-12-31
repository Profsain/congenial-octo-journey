const  initialValues = (loanamount, careertype, captureImg) => ({
    loanamount: loanamount,
    careertype: careertype,
    numberofmonth: "",
    loanpurpose: [],
    loanproduct: "",
    other: false,
    otherpurpose: "",
    bvnnumber: "",
    title: "",
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    dob: "",
    maritalstatus: "",
    noofdependent: "",
    educationlevel: "",
    howdidyouhearaboutus: "",
    houseaddress: "",
    stateofresidence: "",
    lga: "",
    stateoforigin: "",
    ippis: "",
    servicenumber: "",
    valididcard: "",
    idcardnotinclude: false,
    nkinfirstname: "",
    nkinlastname: "",
    nkinphonenumber: "",
    nkinrelationship: "",
    nkinresidentialaddress: "",
    employername: "",
    otheremployername: "",
    employeraddress: "",
    employmentstartdate: "",
    employmentletter: "",
    netmonthlyincome: "",
    totalannualincome: "",
    officialemail: "",
    uploadpayslip: "",

    // financial information
    salarybankname: "",
    salaryaccountnumber: "",
    bankcode: "",
    sameasaboveaccount: false,
    disbursementbankname: "",
    disbursementaccountnumber: "",
    hasloan: "",
    currentmonthlyplanrepaymentamount: "",
    estimatedmonthlylivingexpense: "",
    buyoverloan: "",
    beneficiaryname: "",
    beneficiarybank: "",
    beneficiaryaccountnumber: "",
    liquidationbalance: "",
    deductions: "",
    guarantee: "",

    // agree & sign
    acceptterms: false,
    acceptpolicy: false,
    sharemyremita: false,
    agreefullname: "",
    agreedate: "",
    signature: "",
    photocapture: captureImg,
    haveagent: "",
    agentname: "",
    username: "",
    password: "",
    confirmpassword: "",
});
            
export default initialValues;