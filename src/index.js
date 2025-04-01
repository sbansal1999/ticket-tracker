import express from "express";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
const port = 3000;
const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/scrape", async (req, res) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("authorization", "Bearer " + process.env.TICKET_GENIE_API_KEY);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    const request = await fetch("https://rcbmpapi.ticketgenie.in/ticket/standslist/4", requestOptions);
    const responseJson = await request.json();

    console.log(responseJson);
    const eventName = responseJson.result.event_Name;
    const stands = responseJson.result.stands;

    if (stands.length > 1) {
      await resend.emails.send({
        from: "Ticket Tracker<onboarding@resend.dev>",
        to: "sbansal1999@gmail.com",
        subject: "CHECK TICKETS ASAP",
        text: "CHECK TICKETS ASAP",
      });
    }
    console.log(eventName);
    console.log(stands);

    res.json("data");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export { app };
