import { Icons } from "../icons/icons";

export default function Loading({ message = "Loading" }) {
  return (
    <div role="status" className="flex justify-center my-10">
      <div className="flex items-center gap-2">
        {Icons.LoadingIconPink}
        <span className="text-pink-700 font-semibold">{message}</span>
      </div>
    </div>
  );
}
