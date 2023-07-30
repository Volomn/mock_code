import Image from "next/image";
import styles from "@/app/home.module.css";
import BannerVector from "@/public/banner-vector.png";
import SideShape from "@/public/shape.svg";
import AppLayout from "@/components/app-layout";
import { GithubAuth, GoogleAuth } from "@/components/auth";

// const baseURL = process.env.API_BASE_URL;
// async function getGoogleAuthDetails() {
//   const res = await fetch(`${baseURL}/auth/google`, { cache: "no-cache" });

//   if (!res.ok) throw new Error("Unable to fetch Google auth details");
//   return res.json();
// }

// async function getGithubAuthDetails() {
//   const res = await fetch(`${baseURL}/auth/github`, { cache: "no-cache" });

//   if (!res.ok) throw new Error("Unable to fetch Github auth details");
//   return res.json();
// }

export default async function Home() {
  // const googleAuthDetails = await getGoogleAuthDetails();
  // const githubAuthDetails = await getGithubAuthDetails();

  return (
    <AppLayout>
      <main
        className={`min-h-[80vh] flex flex-grow flex-col gap-10 py-16 items-center justify-between dark:text-white relative ${styles.bannerBackground}`}
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
            <GoogleAuth>
              <button className="px-8 py-5 rounded-lg border border-primary-01 dark:border-white">
                Signup with Google
              </button>
            </GoogleAuth>
            <GithubAuth>

              <button className="px-8 py-5 rounded-lg border border-primary-01 dark:border-white">
                Signup with Github
              </button>
            </GithubAuth>
          </div>
        </div>
        <div className="w-[600px]">
          <Image src={BannerVector} alt="vector" />
        </div>

        <div className="absolute bottom-0 left-0">
          <Image src={SideShape} alt="vector" />
        </div>
      </main>
    </AppLayout>
  );
}
