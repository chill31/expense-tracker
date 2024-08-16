import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {

  const path = usePathname();

  return (
    <div
      className={`w-screen min-h-screen overflow-x-hidden bg-dark flex flex-col gap-24 items-center p-20 max-[900px]:pt-20 max-[900px]:p-10 ${className}`}
    >
      <Sidebar currentPath={path} />
      {children}
    </div>
  );
}
