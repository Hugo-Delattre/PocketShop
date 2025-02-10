"use client";

import { useGetCounts } from "@/lib/queries/kpis";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HomePageGrid() {
  const { data, error } = useGetCounts();

  if (error) {
    console.error(error);
  }

  return (
    <div className="grid grid-cols-2 w-[80%] mx-auto gap-6 mt-24">
      <Link
        href="/users"
        className="col-span-1 bg-gray-200 rounded-lg p-6 flex flex-col justify-between"
      >
        <div className="">
          <h2 className="text-xl font-bold font-crimson">
            {data?.totalUsers ? data.totalUsers : "Lots of new "} active users
          </h2>{" "}
          <p className="my-2 font-crimson">
            Click to see more on them and track their orders
          </p>
        </div>
        <ArrowRight className="ml-auto" />
      </Link>
      <Link
        href="/products"
        className="col-span-1 bg-gray-200 rounded-lg p-6 flex flex-col justify-between"
      >
        <div className="">
          <h2 className="text-xl font-bold font-crimson">
            {data?.totalProducts ? data.totalProducts : "Lots of "} products
          </h2>{" "}
          <p className="my-2 font-crimson">
            Click to see which are out of stock, where they are stored and much
            more
          </p>
        </div>
        <ArrowRight className="ml-auto" />
      </Link>
      <Link
        href="/reports"
        className="col-span-2 bg-blue text-white rounded-lg p-6 flex flex-col justify-between"
      >
        <div className="">
          <h2 className="text-xl font-bold font-crimson">Graph everywhere !</h2>{" "}
          <p className="my-2 font-crimson">
            Check the current progression on our kpis through our magnificent
            graphs ✨
          </p>
        </div>
        <ArrowRight className="ml-auto" />
      </Link>
    </div>
  );
}
