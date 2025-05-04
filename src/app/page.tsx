"use client";
import HomeAunthenticated from "@/components/pages/HomeAuthenticated";
import HomeUnauthenticated from "@/components/pages/HomeUnauthenticated";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter();
    return (
        <main>
            {status === "authenticated" ? (
                <HomeAunthenticated />
            ) : (
                <HomeUnauthenticated />
            )}
        </main>
    );
}
