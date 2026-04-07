import { Input, ResponsiveValue, Textarea } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"

type DebouncedInputProps = {
  value: string | number
  onChange: (value: string | number) => void
  onFocus?: (value: string | number) => void
  debounce?: number
  controlled?: boolean
  optionalRef?: any
  placeholderText?: string
  textAlign?: ResponsiveValue<any>
  type?: "input" | "textarea" | "search"
  variant?: any
}

export default function DebouncedInput({
  value: initialValue,
  onChange,
  onFocus,
  type = "input",
  debounce = 300,
  controlled,
  optionalRef,
  placeholderText,
  textAlign = "center",
  variant = "flushed",
} : DebouncedInputProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue)
  const firstUpdate = useRef(true)
  const valueOptions = controlled
    ? {
        value: value,
      }
    : {
        defaultValue: value,
      }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])
  if (type === "input" || type === "search") {
    return (
      <Input
        type={type}
        textAlign={textAlign}
        ref={optionalRef}
        placeholder={placeholderText}
        variant={variant}
        {...valueOptions}
        onChange={(e) => setValue(e.target.value)}
        onFocus={onFocus ? (e) => onFocus(e.target.value) : undefined}
      />
    )
  }
  return (
    <Textarea
      ref={optionalRef}
      resize="none"
      defaultValue={value}
      onChange={(e) => setValue(e.target.value)}
      onFocus={onFocus ? (e) => onFocus(e.target.value) : undefined}
    />
  )
}
