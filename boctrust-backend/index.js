// include dependency
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const blogRoutes = require("./routes/blog");
const wikiRoutes = require("./routes/wiki");
const productRoutes = require("./routes/product");
const inquiryRoutes = require("./routes/inquiry");
const contactRoutes = require("./routes/contactForm");
const branchRoutes = require("./routes/branches");
const roleRoute = require("./routes/role");
const loanRoute = require("./routes/loan");
const customersLoansRoute = require("./routes/customerLoans");
const customerRoutes = require("./routes/customer");
const updateCustomerRoutes = require("./routes/customerUpdate");
const accountRoutes = require("./routes/account");
const disbursementRoutes = require("./routes/disbursementMethod");
const adminRoutes = require("./routes/adminUser");
const bankoneAccountOfficers = require("./routes/bankoneAccountOfficers");
const employersManagerRoutes = require("./routes/employersManager");
// bankone operation routes
const bankOneOperationRoutes = require("./routes/bankingOperation");
const bankOneProductsRoutes = require("./routes/bankoneProducts");
// remita operation routes
const remitaOperationRoutes = require("./routes/remitaOperation");
const sendEmail = require("./routes/emailSender");
// crc register routes
const crcRegisterRoutes = require("./routes/crcRegister");
// credit registry route
const creditRegistryRoutes = require("./routes/creditRegistry");
// first central routes
const firstCentralRoutes = require("./routes/firstCentral");
const tempDataRoutes = require("./routes/tempData");
const bvnVerificationRoutes = require("./routes/bvnVerification");
const career = require("./routes/career");
const settings = require("./routes/settings");

// configure dotenv
dotenv.config();

// connect to database
mongoose
    .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then(() => { 
    console.log("Connected to database successfully");
        // create new instance of express
        const app = express();

        // use cors
        const corsOptions = {
            origin: "*",
            methods: 'GET, PUT, POST, DELETE',
            allowedHeaders: ['Content-Type'],
        }

        app.use(cors(corsOptions));

        app.use(cookieParser());

        // use express json
        app.use(express.json());

        // Serve static files from the "uploads" directory
        app.use('/uploads', express.static('uploads'));

        // Serve static files from the "public/filesUpload" directory
        app.use('/public/filesUpload', express.static('public/filesUpload'));
        
        // Middleware
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        // use routes
        app.use('/api/blog', blogRoutes);
        app.use('/api/wiki', wikiRoutes);
        app.use('/api/product', productRoutes);
        app.use('/api/inquiry', inquiryRoutes);
        app.use('/api/contact', contactRoutes);
        app.use('/api/branch', branchRoutes);
        app.use('/api/customer', customerRoutes);
        app.use('/api/customers-loans', customersLoansRoute);
        app.use('/api/role', roleRoute);
        app.use('/api/loans', loanRoute);
        app.use('/api/updatecustomer', updateCustomerRoutes);
        app.use('/api/account', accountRoutes);
        app.use('/api/disbursement', disbursementRoutes);
        app.use('/api/agency', employersManagerRoutes);
        // admin routes
        app.use('/api/admin', adminRoutes);
        app.use('/api/account-officers', bankoneAccountOfficers);
        // bankone operation routes
        app.use('/api/bankone', bankOneOperationRoutes);
        app.use('/api/bankone-products', bankOneProductsRoutes);
        // remita operation routes
        app.use('/api/remita', remitaOperationRoutes);
        // email sender routes
        app.use('/api/email', sendEmail);
        // crc register routes
        app.use('/api/crc', crcRegisterRoutes);
        // credit registry routes
        app.use('/api/creditregistry', creditRegistryRoutes);
        // first central routes
        app.use('/api/firstcentral', firstCentralRoutes);

        // temp data routes
        app.use('/api/tempdata', tempDataRoutes);

        // bvn verification routes
        app.use('/api/bvn', bvnVerificationRoutes);

        // career routes
        app.use('/api/career', career);

        // settings routes
        app.use('/api/settings', settings);

        app.listen(process.env.PORT || 3030, () => console.log("Server running on port 3030"));
    })
    .catch((err) => console.log(err));

