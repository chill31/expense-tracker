'use client'

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function Container({ children, className }: { children: React.ReactNode, className?: string }) {

  const transactions = localStorage.getItem("transactions");
  const budgets = localStorage.getItem("budgets");

  if (!transactions) {
    localStorage.setItem("transactions", JSON.stringify([]));
  }
  if(!budgets) {
    localStorage.setItem("budgets", JSON.stringify([]));
  }

  const path = usePathname();
  console.log(path);

  return (
    <div className={`w-screen min-h-screen overflow-x-hidden bg-dark ${className}`}>
      <Sidebar currentPath={path} />
      {children}
    </div>
  );
}