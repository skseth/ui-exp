export interface ControlProps {
  id: string
  value: any
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  autofocus?: boolean
  label: string
  errors?: string[]
  onChange: (value: any) => void
  onBlur?: (value: any) => void
  onFocus?: (value: any) => void
}
