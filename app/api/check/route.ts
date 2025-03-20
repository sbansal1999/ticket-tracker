import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://rcbmpapi.ticketgenie.in/ticket/eventlist/O');
    const data = await response.json();
    
    if (data.status === 'Success') {
      const events = data.result;
      
      events.forEach((event: any) => {
        if (event.event_Code === 2 && event.event_Button_Text !== 'PHASE 1 SOLD OUT') {
          console.log(`Alert: Event ${event.event_Name} has button text "${event.event_Button_Text}" instead of "PHASE 1 SOLD OUT"`);
        }
      });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching event data:', error);
    return NextResponse.json({ error: 'Failed to fetch event data' }, { status: 500 });
  }
}