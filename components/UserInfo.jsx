"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function UserInfo() {

  const [punches, setPunches] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [totalHoursPerPunchOut, setTotalHoursPerPunchOut] = useState({});

  const handlePunchIn = async () => {
    try {
      const response = await fetch('/api/punches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          timestamp: new Date(),
          type: 'in',
        }),
      });
      if (response.ok) {
        setPunches((prevPunches) => [...prevPunches, { timestamp: new Date(), type: 'in' }]);
      } else {
        console.log('Punch in failed.');
      }
    } catch (error) {
      console.log('Error during punch in: ', error);
    }
  };

  const handlePunchOut = async () => {
    try {
      const response = await fetch('/api/punches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          timestamp: new Date(),
          type: 'out',
        }),
      });
      if (response.ok) {
        setPunches((prevPunches) => [...prevPunches, { timestamp: new Date(), type: 'out' }]);
        calculateTotalHoursPerPunchOut();
      } else {
        console.log('Punch out failed.');
      }
    } catch (error) {
      console.log('Error during punch out: ', error);
    }
  };

  const calculateTotalHoursPerPunchOut = () => {
    let totalHours = 0;
    let prevPunchInTimestamp = null;
    for (let i = 1; i < punches.length; i++) {
      if (punches[i - 1].type === 'in' && punches[i].type === 'out') {
        if (prevPunchInTimestamp !== null) {
          const timeDiff = punches[i].timestamp - prevPunchInTimestamp;
          totalHours += Math.floor(timeDiff / (1000 * 60 * 60));
        }
        prevPunchInTimestamp = punches[i - 1].timestamp;
      }
    }
    setTotalHoursPerPunchOut(totalHours);
  };

  useEffect(() => {

  }, [punches]);

  const { data: session } = useSession();

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col gap-2 my-6">
        <div className="items-center justify-center mx-auto">
          Welcome <span className="font-bold text-center">{session?.user?.name}!</span>
  
        <button
          onClick={() => signOut()}
          className="bg-slate-400 text-white font-bold px-3 py-1 mt-3 ml-5 "
        >
          Log Out
        </button>
        </div>
        <div>
         {/* Email: <span className="font-bold">{session?.user?.email}</span>*/} 
        </div>
    <div>
    {punches.map((punch, index) => (
      <div key={index}>
       {(punch.type === 'in') ? (
         <p>Punched in at {new Date(punch.timestamp).toLocaleTimeString()}</p>
       ) : (
        <div>
         <p>Punched out at {new Date(punch.timestamp).toLocaleTimeString()}</p>
         
             <p className="font-bold mb-3">Total hours worked: {totalHoursPerPunchOut} hours</p>
         
         </div>
       )}
     </div>
     ))}
     {(punches.length > 0) && (
       Object.keys(totalHoursPerPunchOut).map((timestamp, index) => (
         <div key={index}>
           <p>Punched out at {timestamp}: {totalHoursPerPunchOut[timestamp]} hours</p>
         </div>
       ))
     )}
    </div>
        <div className="items-center justify-center mx-auto">
          {(punches.length % 2 === 0) ? (
            <button
              onClick={handlePunchIn}
              className="bg-green-500 text-white font-bold px-6 py-2 my-5"
            >
              Punch In
            </button>
          ) : (
            <button
              onClick={handlePunchOut}
              className="bg-red-500 text-white font-bold px-6 py-2 my-5 ml-9"
            >
              Punch Out
            </button>
          )}
        </div>

      </div>
    </div>
  );
}