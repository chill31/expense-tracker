"use client";

import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { BsList } from "react-icons/bs";

export default function Sidebar({ currentPath }: { currentPath: string }) {

  const [isOpen, setIsOpen] = useState(false);
  function checkAndClose(e: any) {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  }

  return (
    <>
      <button
        className={`cursor-pointer rounded-md fixed top-4 left-4 z-[5] p-3 flex items-center justify-center transition-colors focus:outline-2 outline-primary outline outline-0 outline-offset-2 ${
          isOpen ? "bg-dark" : "bg-dark-secondary"
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <BsList className="text-3xl" />
      </button>

      <div
        className={`fixed top-0 left-0 z-[3] h-screen w-screen bg-black/50 transition-opacity ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
        onClick={(e) => checkAndClose(e)}
      ></div>

      <div
        className={`fixed top-0 left-0 z-[4] w-64 h-screen flex flex-col items-center justify-center gap-8 max-sm:gap-6 bg-dark-secondary transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-[-100%]"
        }`}
      >
        <Image src="/logo.png" width={100} height={100} alt="logo" />
        <Link
          href="/"
          className={`text-xl text-white rounded-e-full px-8 py-3 w-[90%] self-start ${
            currentPath === "/" ? "bg-white/20" : "bg-white/5"
          }`}
          as={NextLink}
          tabIndex={isOpen ? 0 : -1}
        >
          Dashboard
        </Link>
        <Link
          href="/transactions"
          className={`text-xl text-white rounded-e-full px-8 py-3 w-[90%] self-start ${
            currentPath === "/transactions" ? "bg-white/20" : "bg-white/5"
          }`}
          as={NextLink}
          tabIndex={isOpen ? 0 : -1}
        >
          Transactions
        </Link>
        <Link
          href="/budgets"
          className={`text-xl text-white rounded-e-full px-8 py-3 w-[90%] self-start ${
            currentPath === "/budgets" ? "bg-white/20" : "bg-white/5"
          }`}
          as={NextLink}
          tabIndex={isOpen ? 0 : -1}
        >
          Budgets
        </Link>
      </div>
    </>
  );
}
