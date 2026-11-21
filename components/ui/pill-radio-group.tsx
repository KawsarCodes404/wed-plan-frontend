"use client"

type Option = { value: string; label: string }

export function PillRadioGroup({
  name,
  label,
  options,
  defaultValue,
  gridClassName = "",
  variant: _variant,
}: {
  name: string
  label: string
  options: readonly Option[]
  defaultValue: string
  gridClassName?: string
  variant?: string
}) {
  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm text-white/70">{label}</legend>
      <div className={`grid ${gridClassName}`}>
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-3 text-sm text-white/80 has-[:checked]:border-[#bd7c89] has-[:checked]:bg-[#8e263b]/20"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={option.value === defaultValue}
              className="accent-[#8e263b]"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
