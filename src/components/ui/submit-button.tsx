"use client";

import { Loader } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./button";

export type ButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

export const SubmitButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function SubmitButton(props, ref) {
    const { children, ...rest } = props;
    const { pending } = useFormStatus();

    return (
      <Button ref={ref} {...rest}>
        {pending ? <Loader className="size-4 animate-spin" /> : children}
      </Button>
    );
  },
);
