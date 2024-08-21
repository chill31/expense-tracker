"use client";

import { Image } from "@nextui-org/image";
import { useState } from "react";
import { BsList } from "react-icons/bs";
import SideBarLink from "./SideBarLink";
import { usePathname } from "next/navigation";

const pages = [
  { href: "/", content: "Dashboard" },
  { href: "/transactions", content: "View Transactions" },
  { href: "/add", content: "Add Transactions" },
  { href: "/budgets", content: "Budgets" },
];

export default function Sidebar() {

  const currentPath = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  function checkAndClose(e: any) {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  }

  return (
    <>
      <button
        className={`cursor-pointer rounded-md fixed top-4 left-4 z-[50] p-3 flex items-center justify-center transition-colors focus:outline-2 outline-primary outline outline-0 outline-offset-2 border-2 border-dark ${
          isOpen ? "bg-dark" : "bg-dark-secondary"
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <BsList className="text-3xl" />
      </button>

      <div
        className={`fixed top-0 left-0 z-[30] min-h-screen w-screen bg-black/50 transition-opacity overflow-x-auto ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
        onClick={(e) => checkAndClose(e)}
      ></div>

      <div
        className={`fixed top-0 left-0 z-[40] w-72 h-screen flex flex-col items-center justify-center gap-8 max-sm:gap-6 bg-dark-secondary transition-transform overflow-x-auto ${
          isOpen ? "translate-x-0" : "translate-x-[-100%]"
        }`}
      >
        <Image src="/logo.png" width={100} height={100} alt="logo" />

        {pages.map((page, index) => (
          <SideBarLink
            key={index}
            href={page.href}
            content={page.content}
            currentPath={currentPath}
            tabIndex={isOpen ? 0 : -1}
          />
        ))}
      </div>
    </>
  );
}
