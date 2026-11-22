"use client"

import { useEffect, useRef } from "react"
import { Check, ChevronDown, type LucideIcon } from "lucide-react"

export type FilterOption = {
  value: string
  label: string
}

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  icon: Icon,
  className = "",
}: {
  label: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
  icon?: LucideIcon
  className?: string
}) {
  const dropdownRef = useRef<HTMLDetailsElement>(null)
  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (
        event.target instanceof Node &&
        !dropdownRef.current?.contains(event.target)
      ) {
        if (dropdownRef.current) dropdownRef.current.open = false
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && dropdownRef.current?.open) {
        dropdownRef.current.open = false
        dropdownRef.current.querySelector("summary")?.focus()
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick)
    document.addEventListener("keydown", closeOnEscape)

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [])

  return (
    <details className={`filter-dropdown ${className}`} ref={dropdownRef}>
      <summary className="filter-dropdown-trigger" aria-label={label}>
        {Icon && <Icon size={16} aria-hidden="true" />}
        <span>{selectedOption?.label}</span>
        <ChevronDown className="filter-dropdown-chevron" size={15} />
      </summary>
      <div className="filter-dropdown-menu" role="listbox" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.value}
            className="filter-dropdown-option"
            type="button"
            role="option"
            aria-selected={value === option.value}
            onClick={() => {
              onChange(option.value)
              if (dropdownRef.current) dropdownRef.current.open = false
            }}
          >
            <span className="filter-dropdown-option-check">
              {value === option.value && <Check size={14} />}
            </span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </details>
  )
}
