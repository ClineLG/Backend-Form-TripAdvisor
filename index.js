const express = require("express");
const cors = require("cors");
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
const mailersend = new MailerSend({
  apiKey: process.env.APIKEY,
});
const sentFrom = new Sender(process.env.ADDRESS, process.env.NAME);

app.get("/", (req, res) => {
  res.status(201).json("Server is up");
});

app.post("/form", async (req, res) => {
  try {
    console.log(req.body);
    const { firstname, lastname, email, message } = req.body;
    const recipients = [new Recipient(email, `${firstname} ${lastname}`)];
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("Réponse au formulaire de contact TripAdvisor !")
      .setHtml(
        `Merci beaucoup, ${firstname} ${lastname} pour votre message :<br /> <br />` +
          "<strong>" +
          message +
          "</strong>" +
          "<br />  <br /> Nous allons traiter votre demande rapidement. <br /> Cordialement, <br />  <br />La Team TripAdvisor"
      )
      .setText(
        `Merci ${firstname} ${lastname} pour votre message : ` +
          message +
          " Nous allons traiter votre demande rapidement. Cordialement, La Team TripAdvisor"
      );

    const result = await mailersend.email.send(emailParams);

    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server is started 🏝️");
});
