import Image from "next/image";
import styles from "@/app/home.module.css";
import BannerVector from "@/public/banner-vector.png";
import SideShape from "@/public/shape.svg";
import AppLayout from "@/components/app-layout";

export default function Home() {
  return (
    <AppLayout>
      <main
        className={`flex flex-grow flex-col gap-10 py-5 items-center justify-center dark:text-white relative ${styles.bannerBackground}`}
      >
        <div className="max-w-[652px] mx-auto text-center flex flex-col gap-4">
          <h1 className="text-5xl font-secondary font-semibold -tracking-[2px] dark:text-white text-primary-01">
            Code like a hero, change the world like a legend.
          </h1>
          <article className="text-shade-01 dark:text-neutral-01 !font-light text-lg gap-4">
            Lorem ipsum dolor sit amet consectetur. Turpis ipsum etiam id nisi
            tempus sed elementum at. Pellentesque morbi imperdiet egestas.
          </article>

          <div className="mt-4 mb-2 w-fit flex gap-4 mx-auto font-medium">
            <button className="px-8 py-5 rounded-lg border border-primary-01 dark:border-white">
              Signup with Google
            </button>
            <button className="px-8 py-5 rounded-lg border border-primary-01 dark:border-white">
              Signup with Github
            </button>
          </div>
        </div>
        <Image src={BannerVector} alt="vector" />

        <div className="absolute bottom-0 left-0">
          <Image src={SideShape} alt="vector" />
        </div>
      </main>
    </AppLayout>
  );
}
