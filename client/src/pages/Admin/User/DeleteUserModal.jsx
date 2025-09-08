import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import ModalDialog from "../../../components/Dialog/ModalDialog";

export default function DeleteUserModal({ isOpen, setIsOpen, user, onDelete }) {
  if (!user) return null;

  const handleDelete = () => {
    onDelete(user);
    setIsOpen(false);
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Delete User"
      onConfirm={handleDelete}
    >
      <p>Are you sure you want to delete the user {user.email}?</p>
      <button
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded flex items-center gap-2 hover:bg-red-600"
        onClick={handleDelete}
      >
        <ExclamationCircleIcon className="size-5" />
        Delete
      </button>
    </ModalDialog>
  );
}
