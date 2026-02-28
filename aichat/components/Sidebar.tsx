import { assets } from "@/assets/assets";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useAppContext } from "@/context/AppContext";
import ChatLabel from "./ChatLabel";

interface SidebarProps {
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = ({ expanded, setExpanded }: SidebarProps) => {
  const { openSignIn } = useClerk();
  const { user } = useAppContext();
  const [openMenu, setOpenMenu] = useState({ id: 0, open: false });

  return (
    <div
      className={`flex flex-col justify-between bg-[#212327] pt-7 transition-all z-50 max-md:absolute max-md:h-screen ${expanded ? "p-4 w-64" : "md:w-20 w-0 max-md:overflow-hidden"}`}
    >
      <div>
        <div
          className={`flex ${expanded ? "flex-row gap-10" : "flex-col items-center gap-8"}`}
        >
          <Image
            src={expanded ? assets.logo_text : assets.logo_icon}
            alt="logo"
            className={expanded ? "w-36" : "w-10"}
          />
          <div
            onClick={() => setExpanded(!expanded)}
            className="group relative flex items-center justify-center hover:bg-gray-500/20 transition-all duration-300 h-9 w-9 aspect-square rounded-lg cursor-pointer"
          >
            <Image
              src={assets.menu_icon}
              alt="menu icon"
              className="md:hidden"
            />
            <Image
              src={expanded ? assets.sidebar_close_icon : assets.sidebar_icon}
              alt="sidebar icon"
              onClick={() => setExpanded(!expanded)}
              className="hidden md:block w-7"
            />
            <div
              className={`absolute w-max ${expanded ? "left-1/2 -translate-x-1/2 top-12" : "-top-12 left-0"} opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none`}
            >
              {expanded ? "Close sidebar" : "Open sidebar"}
            </div>
            <div
              className={`w-3 h-3 absolute bg-black rotate-45 ${expanded ? "left-1/2 -top-1.5 -translate-x-1/2" : "left-4 -bottom-1.5"}`}
            ></div>
          </div>
        </div>
        <button
          className={`mt-8 flex items-center justify-center cursor-pointer ${expanded ? "bg-primary hover:opacity-90 rounded-2xl gap-2 p-2.5 w-max" : "group relative h-9 w-9 mx-auto hover:bg-gray-500/30 rounded-lg"}`}
        >
          <Image
            src={expanded ? assets.chat_icon : assets.chat_icon_dull}
            alt="chat icon"
            className={expanded ? "w-6" : "w-7"}
          />
          <div className="absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100 transition bg-block text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none">
            New chat
            <div className="w-3 h-3 absolute bg-block rotate-45 left-4 -bottom-1.5"></div>
          </div>
          {expanded && <p className="text-white text font-medium">New Chat</p>}
        </button>

        <div
          className={`mt-8 text-white/25 text-sm ${expanded ? "block" : "hidden"}`}
        >
          <p className="my-1">Recents</p>
          <ChatLabel openMenu={openMenu} setOpenMenu={setOpenMenu} />
        </div>
      </div>

      <div>
        <div
          className={`flex items-center curssor pointer group relative ${expanded ? "gap-1 text-white/80 text-sm p-2.5 border border-primary rounded-lg hover:bg-white/10 cursor-pointer" : "h-10 w-10 mx-auto hover:bg-gray-500/30 rounded-lg"}`}
        >
          <Image
            src={expanded ? assets.phone_icon : assets.phone_icon_dull}
            alt="phone icon"
            className={expanded ? "w-5" : "w-6.5 mx-auto"}
          />
          <div
            className={`absolute -top-60 pb-8 ${!expanded && "-right-40"} opacity-0 group-hover:opacity-100 hidden group-hover:block transition`}
          >
            <div className="relative w-max bg-block text-white text-sm p-3 rounded-lg shadow-lg">
              <Image src={assets.qrcode} alt="qr code" className="w-44" />
              <p>Scan to get Deepskeek App</p>
              <div
                className={`w-3 h-3 absolute bg-black rotate-45 ${expanded ? "right-1/2" : "left-4"} -bottom-1.5`}
              ></div>
            </div>
          </div>
          {expanded && (
            <>
              <span>Get App</span>
              <Image src={assets.new_icon} alt="new icon" />
            </>
          )}
        </div>
        <div
          onClick={() => (user ? null : openSignIn())}
          className={`flex items-center ${expanded ? "hover:bg-white/10 rounded-lg" : "justify-center w-full"} gap-3 text-white/60 text-sm p-2 mt-2 cursor-pointer`}
        >
          {user ? (
            <UserButton />
          ) : (
            <Image
              src={assets.profile_icon}
              alt="profile icon"
              className="w-7"
            />
          )}

          {expanded && <span>My Profile</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
