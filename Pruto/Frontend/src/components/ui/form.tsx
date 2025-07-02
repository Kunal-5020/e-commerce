// components/ui/form.tsx
import * as React from "react";
import {
  FormProvider,
  UseFormReturn,
  Controller,
  ControllerProps,
} from "react-hook-form";
import type { FieldValues, Path } from "react-hook-form";

export interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  children: React.ReactNode;
}

export function Form<TSchema extends FieldValues>({
  form,
  children,
}: FormProps<TSchema>) {
  return <FormProvider {...form}>{children}</FormProvider>;
}

export interface FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  render: (props: {
    field: import("react-hook-form").ControllerRenderProps<TFieldValues, TName>;
    fieldState: import("react-hook-form").ControllerFieldState;
    formState: import("react-hook-form").FormState<TFieldValues>;
  }) => React.ReactElement;
}

export function FormField<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>({ control, name, render }: FormFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={(props) => render(props) as React.ReactElement}
    />
  );
}
