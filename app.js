const express = require("express");
const puppeteer = require("puppeteer");
const axios = require("axios");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const app = express();

app.get("/", async (req, res) => {
  const url = "https://www.redtickets.uy/pago/9877/no-vcache";

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  const text = await page.evaluate(() => {
    return document.querySelector("label.id-radio-tile-label.label-small")
      .textContent;
  });
  await browser.close();
  // if text is "Agotado" then send email
  if (text == "Agotado") {
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: "Test Email",
      text: "Hello World!",
    };

    // send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }

  res.send(
    `<p>${text}</p> <a href='https://www.redtickets.uy/evento/Kase.o--28Jazz-Magnetism-10-C2-BA-aniversario-29/9877?no-vcache&__cf_chl_tk=4EJD_1IDpMJoPaKROXiBlg8EvsGH6nsCEY.Qp9xJabA-1677100075-0-gaNycGzNCpA'>Chequear manualmente x las dudas jeje</a>`
  );
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
