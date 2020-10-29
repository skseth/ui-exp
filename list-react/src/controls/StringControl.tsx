import React, { useEffect, useRef, useState } from 'react'

import TextField, {
  FilledTextFieldProps as TextFieldProps
} from '@material-ui/core/TextField'

import { ControlProps } from './ControlProps'

export type StringControlProps = ControlProps &
  Partial<Omit<TextFieldProps, 'onBlur' | 'onFocus' | 'onChange'>>

export const StringControl = ({
  id,
  required = false,
  readonly = false,
  disabled = false,
  label,
  value,
  onChange,
  onBlur = () => {},
  onFocus = () => {},
  autofocus = false,
  errors = [],
  variant = 'filled',
  ...textFieldProps
}: StringControlProps) => {
  const isFirstRun = useRef(true)
  const cursor = useRef(0)
  const inputRef = useRef<HTMLInputElement>()
  const prevValue = useRef(value)
  const [dummy, setDummy] = useState(0)

  const _updateCursor = () => {
    cursor.current = inputRef.current?.selectionStart || 0
  }

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDummy(dummy + 1)
    onChange(e.target.value)
  }

  const _onBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    onBlur(e.target.value)

  const _onFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    onFocus(e.target.value)

  useEffect(() => {
    console.log({
      value,
      prevValue: prevValue.current,
      isFirstRun: isFirstRun.current,
      cursor: cursor.current
    })
    if (value === prevValue.current && !isFirstRun.current) {
      inputRef.current?.setSelectionRange(cursor.current, cursor.current)
    } else {
      prevValue.current = value
      if (isFirstRun.current) {
        isFirstRun.current = false
      }
    }
  })

  return (
    <TextField
      id={id}
      inputRef={inputRef}
      label={label}
      autoFocus={autofocus}
      required={required}
      disabled={disabled || readonly}
      value={value}
      error={errors.length > 0}
      onKeyDown={_updateCursor}
      onClick={_updateCursor}
      onChange={_onChange}
      onBlur={_onBlur}
      onFocus={_onFocus}
      {...(textFieldProps as TextFieldProps)}
      variant={variant}
    />
  )
}
