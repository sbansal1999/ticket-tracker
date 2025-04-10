import express from "express";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
const port = 3000;
const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/scrape", async (req, res) => {
  try {
    const overallStandRequest = await fetch("https://rcbmpapi.ticketgenie.in/ticket/eventlist/O");
    const overallStandRequestJson = await overallStandRequest.json();

    console.log(overallStandRequestJson);
    const results = overallStandRequestJson.result;

    if(results.length > 2){
      await resend.emails.send({
        from: "Ticket Tracker<onboarding@resend.dev>",
        to: "sbansal1999@gmail.com",
        subject: "CHECK TICKETS ASAP - NEW MATCH ADDED",
        text: "CHECK TICKETS ASAP",
      });
    }

    res.json("data");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export { app };
