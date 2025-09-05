import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link } from "react-router-dom";
import {
  ChevronDownIcon,
  Square2StackIcon,
  ArchiveBoxXMarkIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  CreditCardIcon,
} from "@heroicons/react/20/solid";

export default function DesktopDropDown() {
  return (
    <div className="relative md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse z-[10000]">
      <Menu>
        <MenuButton className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-pink-700 bg-pink-900 flex items-center gap-1 focus:outline-none">
          Admin
          <ChevronDownIcon className="size-4 text-white" />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom start"
          className="w-52 origin-top-right rounded-xl mt-1 border-0 outline-none bg-pink-900/70 z-999"
        >
          <MenuItem>
            <Link
              to="/admin/check-user"
              className="group flex w-full items-center gap-2 rounded-lg text-white/80 px-3 py-1.5 data-focus:bg-white/10"
            >
              <UserIcon className="size-4 fill-white/80" />
              Check User
            </Link>
          </MenuItem>
          <div className="my-1 h-px bg-white/50" />
          <MenuItem>
            <Link
              to="/admin/payment"
              className="group flex w-full items-center gap-2 rounded-lg text-white/80 px-3 py-1.5 data-focus:bg-white/10"
            >
              <CreditCardIcon className="size-4 fill-white/80" />
              Payment
            </Link>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
}
