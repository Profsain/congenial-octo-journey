const EmailTemplate = ({
  headline = "Boctrust Loan Application",
  salutation = "Dear",
  firstName = "Customer",
  content = "We are happy to inform you that your loan application was successful and it will be disbursed in 2 working days. In the meantime, check out our customer-first product. Click below:",
  buttonText = "Learn more",
  buttonLink = "https://boctrustmfb.com/",
  cta = "In the meantime, check out our customer-first product",
  closingRemarks = "Thank you for choosing Boctrust MFB Ltd",
}) => {
  return `

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${headline}</title>
    <style>
      .logo__image {
        width: "100px";
        margin: "auto";
        display: "block";
        border-radius: "5%";
      }

      .container {
        font-family: "Arial, sans-serif";
        background-color: "#f4f4f4";
        color: "#333";
        max-width: "600px";
        margin: "auto";
        padding: "20px";
        border: "1px solid #ddd";
        border-radius: "10px";
        box-shadow: "0px 2px 4px rgba(0, 0, 0, 0.1)";
      }
      .header {
        text-align: "center";
        margin: "20px";
        font-size: "24px";
        font-weight: "700";
      }

      .content {
        text-align: "left";
        line-height: "1.6px";
      }
      .button {
        display: "inline-block";
        padding: "10px 20px";
        background-color: "#007bff";
        color: "#fff";
        text-decoration: "none";
        border-radius: "5px";
        margin-top: "20px";
        transition: "background-color 0.3s";
      }
      .button:hover {
        background-color: "#0056b3";
      }
    </style>
  </head>

  <body>
    <div class="container">
      <img
        src="https://boctrustmfb.com/images/boclogo.jpeg"
        alt="Boctrust MFB Ltd"
        class="logo__image"
      />
      <h1 class="header">${headline}</h1>
      <div class="content">
        <p>
          ${salutation}, ${firstName}. <br />
          ${content}
        </p>
        <p>${cta}</p>
        <a href="${buttonLink}" class="button"> ${buttonText} </a>
      </div>
      <p class="content">${closingRemarks}</p>
    </div>
  </body>
</html>


`;
};

module.exports = EmailTemplate;
