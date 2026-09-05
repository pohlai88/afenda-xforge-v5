import { render, screen } from "@testing-library/react";
import { Field, FieldError, FieldLabel } from "@xforge/design/components/field";
import { Input } from "@xforge/design/components/input";
import { describe, expect, it } from "vitest";

const Example = ({ error }: Readonly<{ error?: string }>) => (
  <Field data-invalid={Boolean(error)}>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input
      aria-describedby={error ? "email-error" : undefined}
      aria-invalid={Boolean(error)}
      id="email"
      type="email"
    />
    {error ? <FieldError id="email-error">{error}</FieldError> : null}
  </Field>
);

describe("Field error contract", () => {
  it("is valid and undescribed by default", () => {
    render(<Example />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("marks the input invalid and associates the error text as its description", () => {
    render(<Example error="Enter a valid email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Enter a valid email");
  });
});
