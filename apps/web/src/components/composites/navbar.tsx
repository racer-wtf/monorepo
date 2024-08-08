import Link from "next/link";

import NavLink from "../primitives/navlink";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../primitives/tooltip";
import { RacerLettermark } from "../svgs/racer-lettermark";
import { ConnectButton } from "./connect-button";

export const Navbar = () => {
  return (
    <nav className="w-full flex py-4 max-w-7xl mx-auto px-4 gap-8">
      <div className="flex gap-12 items-center">
        <Link href="/">
          <RacerLettermark className="w-44" />
        </Link>
        <span className="hidden sm:flex gap-8 items-center">
          <NavLink href="/races">Races</NavLink>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <span className="text-gray-400 dark:text-gray-600 cursor-default">
                  Binaries
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Binaries will be added soon!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      </div>
      <ConnectButton />
    </nav>
  );
};
