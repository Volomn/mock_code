import Image from "next/image";
import Competition2 from "@/public/competition2.png";
import Link from "next/link";

export function Competition() {
  return (
    <Link href="/competition">
      <div className="shadow rounded-xl">
        <div className="h-32 relative">
          <Image
            className="rounded-t-xl object-cover"
            fill
            src={Competition2}
            alt=""
          />
        </div>
        <div className="p-5 flex flex-col gap-2">
          <h4 className="text-primary-01 dark:text-neutral-00 font-semibold font-secondary">
            Codecrunch weekend
          </h4>
          <article className="text-shade-01 dark:text-neutral-01 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
            adipisci perferendis.
          </article>
        </div>
      </div>
    </Link>
  );
}
