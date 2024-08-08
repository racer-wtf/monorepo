import Link, { LinkProps } from "next/link";
import React, { AnchorHTMLAttributes, RefObject } from "react";
import { twMerge } from "tailwind-merge";

type Props = LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    ref?: RefObject<HTMLAnchorElement>;
  };

const NavLink = ({ className, ref, ...rest }: Props) => (
  <Link
    {...rest}
    ref={ref}
    className={twMerge(
      "hover:bg-gray-100 dark:hover:bg-gray-900 px-2 py-1 transition-colors dark:text-gray-100 text-gray-900",
      className,
    )}
  />
);

NavLink.displayName = "NavLink";

export default NavLink;
