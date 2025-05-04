import Image from "next/image";
import homeHowItWorks from "../../public/images/homeHowItWorks.png";
import homeWhoIsItFor from "../../public/images/homeWhoIsItFor.png";

export default function HomeSectionTwo() {
    return (
        <section className="mt-80">
            <div className="container mx-auto w-fit h-[475] flex">
                <Image src={homeHowItWorks} alt="icon" className="w-fit" />
                <div className="container w-fit h-fit self-center mx-auto flex flex-col p-5 gap-5 rounded-lg border-borderdefault backdrop-blur-xl bg-[#4d4d4d10] border-[3px]">
                    <h2 className="text-bold text-green text-8xl">
                        How it works?
                    </h2>

                    <ol className="flex flex-col gap-5 font-bold text-2xl list-decimal list-inside">
                        <li>Authorize</li>
                        <li>
                            Fill in the details - recipient's name, rate, date,
                            etc.
                        </li>
                        <li>Create and sign a certificate</li>
                    </ol>
                </div>
            </div>
            <div className="container mx-auto w-fit h-[400] flex">
                <div className="container w-fit h-fit self-center mx-auto flex flex-col p-5 gap-5 rounded-lg border-borderdefault backdrop-blur-xl bg-[#4d4d4d10] border-[3px]">
                    <h2 className="text-bold text-green text-8xl">
                        Who is it for?
                    </h2>
                    <ul className="flex flex-col gap-5 font-bold text-2xl list-disc list-inside">
                        <li>Online courses and schools</li>
                        <li>Universities</li>
                        <li>Corporate trainings</li>
                        <li>Freelancers and coaches</li>
                    </ul>
                </div>
                <Image src={homeWhoIsItFor} alt="icon" className="w-fit" />
            </div>
        </section>
    );
}