"use client";

import { forwardRef, useMemo, useState } from "react";
import PhoneInput, { type Country, type Value } from "react-phone-number-input";
import { getExampleNumber, validatePhoneNumberLength } from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  defaultCountry?: Country;
  required?: boolean;
  name?: string;
  variant?: "light" | "dark";
  shape?: "block" | "pill";
  className?: string;
};

function maxFormattedLength(country: Country | undefined): number {
  if (!country) return 22;
  try {
    const ex = getExampleNumber(country, examples);
    if (ex) return ex.formatInternational().length;
  } catch {
    /* ignore */
  }
  return 22;
}

export const PhoneField = forwardRef<HTMLDivElement, Props>(function PhoneField(
  {
    value,
    onChange,
    placeholder,
    defaultCountry = "UZ",
    required,
    name = "phone",
    variant = "light",
    shape = "block",
    className,
  },
  ref,
) {
  const [country, setCountry] = useState<Country | undefined>(defaultCountry);

  const maxLength = useMemo(() => maxFormattedLength(country), [country]);

  const classes = [
    "phone-field",
    "flex-1",
    "min-w-0",
    "w-full",
    "text-sm",
    shape === "pill" ? "phone-field--pill" : "",
    variant === "dark" ? "phone-field--dark text-white" : "text-foreground",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  function handleChange(v: string | undefined) {
    const next = (v ?? "") as string;
    if (next) {
      const issue = validatePhoneNumberLength(next, country);
      if (issue === "TOO_LONG" || issue === "INVALID_LENGTH") return;
    }
    onChange(next);
  }

  return (
    <div ref={ref} className={classes}>
      <PhoneInput
        international
        withCountryCallingCode
        countryCallingCodeEditable={false}
        defaultCountry={defaultCountry}
        value={value as Value}
        onChange={handleChange}
        onCountryChange={(c) => setCountry(c ?? undefined)}
        placeholder={placeholder}
        name={name}
        required={required}
        numberInputProps={{ maxLength, inputMode: "tel" }}
      />
    </div>
  );
});
