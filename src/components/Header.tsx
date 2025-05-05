"use client";
import Link from "next/link";
import Button from "./Button";
import Logo from "./icons/Logo";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import ProfileDropdown from "./ProfileDropdown";

export default function Header() {
  const { data: session, status } = useSession();
  console.log("🚀 ~ Header ~ session:", session);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="flex justify-between items-center p-5 bg-[#4d4d4d10] rounded-lg border-borderdefault backdrop-blur-xl border-[3px] absolute container left-1/2 -translate-x-1/2 top-12">
      <Logo />
      <nav>
        <ul className="flex items-center gap-12">
          <li
            style={{ color: pathname === "/" ? "#8CD813" : "" }}
            className="cursor-pointer"
          >
            <Link href="/">Home</Link>
          </li>
          <li
            style={{
              color: pathname === "/create-certificate" ? "#8CD813" : "",
            }}
          >
            <Link href="/create-certificate">Create Certificate</Link>
          </li>
          <li
            style={{
              color: pathname === "/about-us" ? "#8CD813" : "",
            }}
          >
            <Link href="/about-us">About us</Link>
          </li>
        </ul>
      </nav>
      {status === "authenticated" ? (
        <ProfileDropdown name={session.user.name} />
      ) : (
        <Button onClick={() => router.push("/signup")} title="Sign up" />
      )}
    </header>
  );
}
