"uce client";
import { Button } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import userIcon from "@/../public/user-solid.svg";

export default function Header() {
  const { data: session, status } = useSession();
  const RenderButton = () => {
    if (status === "unauthenticated")
      <Link href="signup" className="text-lime-400">
        <Button
          variant="outlined"
          className="text-lime-400 border-lime-400 hover:bg-lime-400 hover:text-black transition-all"
        >
          Sign up
        </Button>
      </Link>;
    return (
      <Link href="/certificates" className="text-lime-400">
        <Button
          sx={{ backgroundColor: "#8bd714", color: "black" }}
          className="text-lime-400 border-lime-400 hover:bg-lime-400 hover:text-black transition-all"
        >
          {session?.user.name}
          <Image
            src={userIcon}
            alt="User icon"
            width={12}
            height={12}
            className="ml-2"
          />
        </Button>
      </Link>
    );
  };

  return (
    <header className="flex justify-between items-center bg-[#0B0F0C] px-6 py-4 border border-gray-700 rounded-xl max-w-5xl mx-auto mb-12">
      <div className="flex items-center space-x-1 text-xl font-semibold">
        <span className="bg-lime-500 text-black px-1 rounded">Smart</span>
        <span>Contracts</span>
      </div>
      <nav className="flex items-center gap-8 text-sm">
        <Link href="/" className="hover:text-lime-400">
          Home
        </Link>
        <Link href="/create-certificate" className="text-lime-400">
          Create Certificate
        </Link>
        <Link href="/about">About us</Link>
      </nav>
      {RenderButton()}
    </header>
  );
}
