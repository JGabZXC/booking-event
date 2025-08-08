import { Icons } from "../icons/icons";

export default function Loading({ message = "Loading" }) {
  return (
    <div role="status" className="h-100 my-10 mx-auto w-100">
      <div className="flex justify-center items-center gap-2">
        {Icons.LoadingIconPink}
        <span className="text-pink-700 font-semibold">{message}</span>
      </div>
    </div>
  );
}
