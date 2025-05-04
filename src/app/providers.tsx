"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/signup";

    return (
        <SessionProvider>
            {!isAuthPage && <Header />}
            {children}
            {!isAuthPage && <Footer />}
        </SessionProvider>
    );
}