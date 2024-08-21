import Sidebar from "./Sidebar";
import { twMerge } from "tailwind-merge";

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {

  return (
    <div
      className={twMerge("w-screen min-h-screen overflow-x-hidden bg-dark flex flex-col gap-24 items-center p-20 max-[900px]:pt-20 max-[900px]:p-10", className)}
    >
      <Sidebar />
      {children}
    </div>
  );
}
