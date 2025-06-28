
import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout({children}) {
  return (
    <div className="px-5">
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        {children}
      </Suspense>
    </div>
  );
}
