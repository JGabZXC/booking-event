import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

export default function ModalDialog({
  isOpen,
  setIsOpen,
  title,
  description,
  children,
}) {
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open dialog</button>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
            >
              <DialogTitle
                as="h3"
                className="text-base/7 font-medium text-white"
              >
                {title}
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-white/50">{description}</p>
              <div className="mt-4">{children}</div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
