import AppLayout from "@/components/app-layout";
import styles from "@/app/home.module.css";
import Image from "next/image";

import Competition1 from "@/public/competition1.png";
import { Competition } from "@/components/competition";

export default function Dashboard() {
  return (
    <AppLayout isAuthenticated>
      <section className={styles.bannerBackground}>
        <div className="max-w-7xl mx-auto py-5">
          <h1 className="text-primary-01 dark:text-neutral-00 text-5xl font-semibold font-secondary mt-2">
            Challenges
          </h1>
          <p className="font-light text-shade-01 dark:text-neutral-01 text-lg mt-4">
            Lorem ipsum dolor sit amet consectetur. Turpis luctus vel amet
            pellentesque aliquam senectus molestie placerat. Gravida proin
            mollis a morbi erat vulputate rhoncus. Massa felis leo et feugiat
            pellentesque.
          </p>

          <div className="max-w-[1000px] mt-12">
            <input
              placeholder="Search for challenges"
              className="w-full px-6 py-5 border dark:border-[#F3F5F733] rounded-lg bg-transparent outline-none"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-5">
          <h3 className="text-primary-01 dark:text-neutral-00 text-2xl font-semibold font-secondary">
            Active Competitions
          </h3>

          <section className="grid grid-cols-4 gap-10 mt-6">
            <Competition />
            <Competition />
            <Competition />
            <Competition />
          </section>
        </div>

        <div className="max-w-7xl mx-auto mt-10">
          <h3 className="text-primary-01 dark:text-neutral-00 text-2xl font-semibold font-secondary">
            All Competitions
          </h3>

          <section className="grid grid-cols-4 gap-10 mt-6">
            <Competition />
            <Competition />
            <Competition />
            <Competition />
            <Competition />
            <Competition />
            <Competition />
            <Competition />
          </section>
        </div>
      </section>
    </AppLayout>
  );
}
