"use client";

import { Loader } from "lucide-react";
import React, { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "./button";

export type ButtonProps = React.ComponentPropsWithoutRef<typeof Button> &
  Readonly<{ successMessage?: string }>;

export const SubmitButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function SubmitButton(props, ref) {
    const { children, successMessage, ...rest } = props;
    const { pending, data } = useFormStatus();

    useEffect(() => {
      if (successMessage && data) toast.success(successMessage);
    }, [data, successMessage]);

    return (
      <Button ref={ref} {...rest}>
        {pending ? <Loader className="size-4 animate-spin" /> : children}
      </Button>
    );
  },
);
