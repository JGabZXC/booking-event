import { Icons } from "../icons/icons";

export default function Loading({ message = "Loading" }) {
  return (
    <div role="status" className="h-100 my-10 mx-auto w-50">
      <div className="flex items-center gap-2">
        {Icons.LoadingIconPink}
        <span className="text-pink-700 font-semibold">{message}</span>
      </div>
    </div>
  );
}
