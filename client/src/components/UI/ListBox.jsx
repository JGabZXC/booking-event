import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export default function ListBox({ types, title, value, onChange }) {
  return (
    <div className="w-full max-w-md">
      <label className="text-sm font-medium text-pink-900 block mb-1">
        {title}
      </label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <ListboxButton
            className={clsx(
              "mt-3 relative w-full cursor-pointer rounded-lg border border-pink-200 bg-white py-2 pl-3 pr-10 text-left text-sm text-pink-900",
              "focus:outline-none focus:ring-2 focus:ring-pink-400"
            )}
          >
            <span className="block truncate">{value.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDownIcon
                className="w-4 h-4 text-pink-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>
          <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
            {types.map((type) => (
              <ListboxOption
                key={type.value}
                value={type}
                className={({ active, selected }) =>
                  clsx(
                    "cursor-pointer select-none py-2 pl-10 pr-4",
                    active ? "bg-pink-100 text-pink-900" : "text-pink-900",
                    selected && "font-semibold"
                  )
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={clsx(
                        "block truncate",
                        selected ? "font-semibold" : "font-normal"
                      )}
                    >
                      {selected ? (
                        <span className="left-3 top-2 text-pink-900">
                          &#10003;
                        </span>
                      ) : null}{" "}
                      {type.label}
                    </span>
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
