'use client';

import { useState, useEffect } from 'react';

async function checkEvents() {
  const response = await fetch(`/api/check`, { cache: 'no-store' });
  return response.json();
}

async function sendEmail() {
  const response = await fetch('/api/send', {
    method: 'POST',
  });
  return response.json();
}

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastButtonStates, setLastButtonStates] = useState<Record<number, string>>({});

  useEffect(() => {
    const checkAndUpdateEvents = async () => {
      try {
        const result = await checkEvents();
        setData(result);

        // Check each event's button text and send email if changed from "PHASE 1 SOLD OUT"
        result.result?.forEach((event: any) => {
          if (event.event_Group_Code === 2) {
            const previousState = lastButtonStates[event.event_Code];
            if (previousState === 'PHASE 1 SOLD OUT' && event.event_Button_Text !== 'PHASE 1 SOLD OUT') {
              sendEmail();
            }
            lastButtonStates[event.event_Code] = event.event_Button_Text;
          }
        });
        setLastButtonStates({...lastButtonStates});
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial check
    checkAndUpdateEvents();

    // Set up polling every minute
    const interval = setInterval(checkAndUpdateEvents, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Bangalore Events</h1>
        <div className="grid gap-6">
          {data?.result?.map((event: any) => (
            <div 
              key={event.event_Code}
              className="bg-card rounded-lg shadow-lg p-6 flex items-center gap-6"
            >
              <div className="flex items-center gap-4 flex-1">
                <img 
                  src={event.team_1_Logo} 
                  alt={event.team_1}
                  className="w-16 h-16 object-contain"
                />
                <span className="text-2xl font-bold">VS</span>
                <img 
                  src={event.team_2_Logo} 
                  alt={event.team_2}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{event.event_Name}</h2>
                <p className="text-muted-foreground">{event.event_Display_Date}</p>
                <p className="text-sm text-muted-foreground">{event.venue_Name}, {event.city_Name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-2">{event.event_Price_Range}</p>
                <button 
                  className={`px-4 py-2 rounded-md ${
                    event.event_Button_Text === 'PHASE 1 SOLD OUT'
                      ? 'bg-destructive text-destructive-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {event.event_Button_Text}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}