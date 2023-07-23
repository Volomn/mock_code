import { Tabs } from "@/components/core";
import AppLayout from "@/components/app-layout";
import styles from "./style.module.scss";

export default function Competition() {
  return (
    <AppLayout isAuthenticated>
      <main className="max-w-7xl mx-auto">
        <div className={`px-8 py-5 ${styles.header} text-white rounded-lg`}>
          <span className="bg-secondary-100 px-2 py-1 rounded-md inline-block mb-10">
            Ongoing
          </span>
          <h2 className="text-secondary font-semibold text-3xl">
            Codecrunch Weekend
          </h2>
          <div>
            Lorem ipsum dolor sit amet consectetur. Turpis luctus vel amet
            pellentesque aliquam senectus molestie placerat. Gravida proin
            mollis a morbi erat vulputate rhoncus. Massa felis leo et feugiat
            pellentesque.
          </div>

          <div className="font-semibold mt-5">20+ teams</div>
        </div>

        <Tabs />
      </main>
    </AppLayout>
  );
}
