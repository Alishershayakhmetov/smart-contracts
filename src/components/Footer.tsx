import Link from "next/link";
import Logo from "./icons/Logo";

export default function Footer() {
    return (
        <footer className="flex flex-col items-center py-5 gap-5 mt-24 mb-12 bg-[#4d4d4d10] rounded-lg border-[#444444] backdrop-blur-xl border-[3px] container mx-auto bottom-12">
            <div className="flex gap-5">
                <div className="self-center">
                    <Logo />
                </div>
                <div className="w-[3px] min-h-full bg-borderdefault"></div>
                <div>
                    <nav>
                        <ul className="flex flex-col gap-5">
                            <li className="cursor-pointer">
                                <Link href="/">Home</Link>
                            </li>
                            <li>
                                <Link href="/create-certificate">
                                    Create Certificate
                                </Link>
                            </li>
                            <li>
                                <Link href="/about-us">About us</Link>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/Alishershayakhmetov/smart-contracts"
                                    target="_blank"
                                >
                                    Github
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <span className="text-tertiary">Made by Abdigaliyev Z., and Shayakhmetov A.</span>
        </footer>
    );
}
