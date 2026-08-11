import { useRef } from "react";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

export default function OTPInput({
  value,
  onChange,
  length = 6,
  disabled = false,
}: OTPInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, input: string) => {
    const digits = input.replace(/\D/g, "");

    if (digits.length > 1) {
      const pastedValue = digits.slice(0, length);
      onChange(pastedValue);
      inputRefs.current[Math.min(pastedValue.length, length - 1)]?.focus();
      return;
    }

    const current = value.padEnd(length, " ").split("");
    current[index] = digits || " ";

    const nextValue = current.join("").replace(/\s/g, "").slice(0, length);
    onChange(nextValue);

    if (digits && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (
    event: React.ClipboardEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    const digits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    onChange(digits);
    inputRefs.current[Math.min(digits.length, length - 1)]?.focus();
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();

      const current = value.split("");

      if (current[index]) {
        current[index] = "";
        onChange(current.join(""));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        current[index - 1] = "";
        onChange(current.join(""));
      }
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={value[index] ?? ""}
          disabled={disabled}
          onChange={(event) => handleChange(index, event.target.value)}
          onPaste={handlePaste}
          onKeyDown={(event) => handleKeyDown(index, event)}
          className="h-12 w-10 rounded-lg border border-gray-300 text-center text-xl font-semibold outline-none focus:border-blue-500"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}