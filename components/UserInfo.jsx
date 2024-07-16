"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function UserInfo() {
  const [punchIn, setPunchIn] = useState(false);

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
          setPunchIn(true);
        
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
          setPunchIn(true);
        
      } else {
          console.log('Punch out failed.');
      }
  } catch (error) {
      console.log('Error during punch out: ', error);
  }
};
  
  /*const handlePunchOut = async () => {
    const punch = await Punch.create({ userId: user._id, timestamp: new Date(), type: 'out' });
  };
*/
  const { data: session } = useSession();

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col gap-2 my-6">
        <div>
          Welcome <span className="font-bold text-center">{session?.user?.name}!</span>
  
        <button
          onClick={() => signOut()}
          className="bg-slate-400 text-white font-bold px-3 py-1 mt-3 ml-5"
        >
          Log Out
        </button>
        </div>
        <div>
          Email: <span className="font-bold">{session?.user?.email}</span>
        </div>
        <div>
        <button
          onClick={() => handlePunchIn()}
          className="bg-green-500 text-white font-bold px-6 py-2 mt-10 ml-5"
        >
         Punch In
        </button>
        </div>
        <div>
        <button
          onClick={() => handlePunchOut()}
          className="bg-red-500 text-white font-bold px-6 py-2 mt-10 ml-5"
        >
         Punch Out
        </button>
        </div>
      </div>
    </div>
 
  );
}