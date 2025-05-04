import { IoChevronForwardSharp } from "react-icons/io5";
import ButtonWithIcon from "../ButtonWithIcon";
import { useRouter } from "next/navigation";
import Image from "next/image";
import homeBgLeft from "../../../public/images/homeBgLeft.png";
import homeBgRight from "../../../public/images/homeBgRight.png";
import HomeSectionTwo from "../HomeSectionTwo";

export default function HomeUnauthenticated() {
    const router = useRouter();
    return (
        <main className="mt-56">
            <section className="relative">
                <div className="container mx-auto pt-24">
                    <h1 className="text-green text-8xl text-center mb-12 font-bold">
                        Create and manage
                        <br />
                        digital certificates using blockchain
                    </h1>
                    <p className="text-tertiary text-center text-2xl mb-12">
                        Guarantee the authenticity, security and transparency of
                        your smart contract certificates.
                    </p>
                    <div className="flex justify-center">
                        <ButtonWithIcon
                            icon={
                                <IoChevronForwardSharp
                                    size={15}
                                    color="#1e1e1e"
                                />
                            }
                            title={"Sign up"}
                            fontSize={"24px"}
                            onClick={() => {
                                router.push("/signup");
                            }}
                        />
                    </div>
                </div>
                <Image
                    src={homeBgLeft}
                    alt="bg"
                    className="absolute left-0 top-[-70px] object-contain h-[1024px] -z-10"
                />
                <Image
                    src={homeBgRight}
                    alt="bg"
                    className="absolute right-0 top-[-70px] object-contain h-[1024px] -z-10"
                />
            </section>
            <HomeSectionTwo />
        </main>
    );
};