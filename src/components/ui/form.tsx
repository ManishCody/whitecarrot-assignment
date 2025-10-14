"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  type FieldPath,
  type FieldValues,
  type ControllerProps,
} from "react-hook-form";
import { cn } from "@/lib/utils";

const Form = (props: React.ComponentProps<typeof FormProvider>) => (
  <FormProvider {...props} />
);
Form.displayName = "Form";

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)} {...props} />
  )
);
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn("text-sm font-medium", className)} {...props} />
));
FormLabel.displayName = LabelPrimitive.Root.displayName;

const FormControl = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ ...props }, ref) => <Slot ref={ref} {...props} />
);
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm font-medium text-destructive", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FormMessage.displayName = "FormMessage";

interface FormFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>
  extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  render: ControllerProps<TFieldValues, TName>["render"];
}

function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
  props: FormFieldProps<TFieldValues, TName>
) {
  return <Controller {...props} />;
}

export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };
