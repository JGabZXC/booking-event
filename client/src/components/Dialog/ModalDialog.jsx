import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";

export default function ModalDialog({
  isOpen,
  setIsOpen,
  title,
  buttonName,
  buttonClassName = "",
  description,
  children,
}) {
  const close = () => setIsOpen(false);
  return (
    <>
      <button className={buttonClassName} onClick={() => setIsOpen(true)}>
        {buttonName}
      </button>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/60">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white dark:bg-gray-900 p-6 shadow-xl duration-300 ease-out"
            >
              <div className="flex justify-between items-center mb-4">
                <DialogTitle
                  as="h3"
                  className="text-lg font-semibold text-pink-300"
                >
                  {title}
                </DialogTitle>
                <XMarkIcon
                  className="size-6 fill-white bg-pink-300 rounded"
                  onClick={close}
                />
              </div>

              {description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {description}
                </p>
              )}
              <div className="mt-4">{children}</div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
