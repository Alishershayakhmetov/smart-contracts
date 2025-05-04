import { IoChevronForwardSharp } from "react-icons/io5";
import ButtonWithIcon from "../ButtonWithIcon";
import { useRouter } from "next/navigation";
import Image from "next/image";
import homeAunthenticated from "../../../public/images/homeAuthenticated.png";
import HomeSectionTwo from "../HomeSectionTwo";
import { useSession } from "next-auth/react";

export default function HomeAunthenticated() {
    const {data: session, status } = useSession();
    const name = session?.user.name;
    const router = useRouter();
    return (
        <main className="mt-56">
            <section className="relative">
                <div className="container mx-auto pt-24">
                    <h1 className="text-green text-8xl text-center mb-12 font-bold">
                        Welcome, {name}!
                    </h1>
                    <p className="text-tertiary text-center text-2xl mb-12">
                        Guarantee the authenticity, security and transparency of
                        your smart contract certificates.
                    </p>
                    <div className="flex justify-center">
                        <ButtonWithIcon
                            icon={
                                <IoChevronForwardSharp
                                    size={29}
                                    color="#1e1e1e"
                                />
                            }
                            title={"Create Certificate"}
                            fontSize={"24px"}
                            onClick={() => {
                                router.push("/create-certificate");
                            }}
                        />
                    </div>
                </div>
                <Image
                    src={homeAunthenticated}
                    alt="bg"
                    className="absolute left-1/2 -translate-x-1/2 top-[-5px] object-contain h-[450px] -z-10"
                />
            </section>
            <HomeSectionTwo />
        </main>
    );
}
