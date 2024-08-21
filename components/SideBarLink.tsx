import NextLink from 'next/link'
import { Link } from "@nextui-org/react";

export default function SideBarLink({ href, content, currentPath, tabIndex }: { href: string; content: string; currentPath: string; tabIndex: 0|-1 }) {
  return (
    <Link
      href={href}
      className={`text-xl text-white rounded-e-full px-8 py-3 w-[90%] self-start ${
        currentPath === href ? "bg-white/20" : "bg-white/5"
      }`}
      as={NextLink}
      tabIndex={tabIndex}
    >
      {content}
    </Link>
  );
}