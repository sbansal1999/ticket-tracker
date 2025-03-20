'use client';

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: process.env.EMAIL_ADDRESS!,
      subject: 'Ticket Status Update - Bangalore Events',
      html: `
        <h1>Ticket Status Update</h1>
        <p>The ticket status for one or more events has changed from "PHASE 1 SOLD OUT".</p>
        <p>Please check the website for the latest ticket availability.</p>
        <p>Visit: <a href="https://bangalore-events.com">Bangalore Events</a></p>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}