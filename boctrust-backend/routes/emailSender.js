const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/send-email', async (req, res) => {
    const { email, subject, html } = req.body;
    try {
        const transporter = nodemailer.createTransport({
            service: 'SMTP',
            name: 'mail.boctrustmfb.com',
            host: "mail.boctrustmfb.com",
            port: 2096,
            secure: true,
            auth: {
                user: 'ebusiness@boctrustmfb.com',
                pass: 'eBiz-9945@'
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        
        const mailOptions = {
            from: 'Boctrust MFB Ltd',
            to: email,
            subject: subject,
            html: html

        };
        
        await transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                res.status(500).json({ success: false, error: 'Internal Server Error, mail not sent' });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ success: true, message: 'Email sent successfully' });
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;
