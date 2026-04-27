import ChildrenWrapper from "./children-wrapper";
import { Suspense } from "react";

export default function SearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="bg-background px-4 pb-10 pt-8 sm:px-6 lg:px-12">
      <div className="mx-auto min-h-screen w-full max-w-screen-2xl">
        <Suspense fallback={null}>
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </Suspense>
      </div>
    </section>
  );
}
