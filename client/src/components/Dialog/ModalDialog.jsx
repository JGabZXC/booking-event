import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

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
              <DialogTitle
                as="h3"
                className="text-lg font-semibold text-pink-300"
              >
                {title}
              </DialogTitle>
              {description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {description}
                </p>
              )}
              <div className="mt-4">{children}</div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={close}
                  className="px-4 py-2 rounded bg-pink-900 text-white hover:bg-pink-700 transition"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
