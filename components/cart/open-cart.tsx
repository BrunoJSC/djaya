import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <div
      className="group flex items-center justify-center transition-colors hover:text-neutral-900"
    >
      <div className="relative flex items-center justify-center">
        <ShoppingBagIcon
          className={clsx(
            "h-5 w-5 text-neutral-400 transition-all group-hover:text-neutral-900",
            className,
          )}
        />

        {quantity ? (
          <div className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[9px] font-medium text-white">
            {quantity}
          </div>
        ) : null}
      </div>
    </div>
  );
}
