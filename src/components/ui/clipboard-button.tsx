"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "./button";

type ClipboardButtonProps = Readonly<{ text: string }> &
  Omit<React.ComponentProps<typeof Button>, "onClick">;

export const ClipboardButton = React.forwardRef<
  HTMLButtonElement,
  ClipboardButtonProps
>(function ClipboardButton(props, ref) {
  async function onClick(): Promise<void> {
    await navigator.clipboard.writeText(props.text);
    toast.success("Copied to clipboard");
  }

  return <Button ref={ref} {...props} onClick={onClick} />;
});
