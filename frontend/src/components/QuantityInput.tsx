import { useEffect, useState } from "react";
import type { CartItem } from "../api/types";

type QuantityInputProps = {
  item: CartItem;
  disabled: boolean;
  onCommit: (item: CartItem, newQuantity: number) => void;
};

export function QuantityInput({ item, disabled, onCommit }: QuantityInputProps) {
  const [value, setValue] = useState(String(item.quantity));
  useEffect(() => {
    setValue(String(item.quantity));
  }, [item.quantity]);

  function commit() {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) {
      setValue(String(item.quantity));
      return;
    }

    if (parsed === item.quantity) return;

    onCommit(item, parsed);
  }

  return (
    <input
      type="number"
      className="qty-input"
      value={value}
      min={1}
      disabled={disabled}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur();
      }}
    />
  );
}
