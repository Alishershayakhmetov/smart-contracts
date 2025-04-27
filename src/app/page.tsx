"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Profile() {
  const { data: session } = useSession();

  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <div>
      {session?.user && (
        <>
          <h1>Welcome, {session.user.name}</h1>
          <p>Email: {session.user.email}</p>
          {session.user.image && (
            <img
              src={session.user.image}
              alt="Profile"
              className="w-20 h-20 rounded-full"
            />
          )}
        </>
      )}
    </div>
  );
}
