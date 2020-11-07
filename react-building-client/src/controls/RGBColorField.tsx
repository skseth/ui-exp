import {
  ClickAwayListener,
  Popper,
  PopperPlacementType,
  TextField
} from '@material-ui/core'
import React, { FunctionComponent, useCallback, useMemo, useState } from 'react'
import {
  ChromePicker,
  ColorChangeHandler,
  ColorResult,
  RGBColor
} from 'react-color'

interface RGBColorFieldProps {
  id: string
  value?: string
  label: string
  placeholder?: string
  placement?: PopperPlacementType
  onChange: (value: string) => void
}

const RGBColorFieldBase: FunctionComponent<RGBColorFieldProps> = ({
  id,
  value,
  label,
  placeholder,
  placement,
  onChange
}) => {
  const [showPicker, setShowPicker] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = useCallback(
    (e: any) => {
      setAnchorEl(e.currentTarget)
      setShowPicker(true)
    },
    [setAnchorEl, setShowPicker]
  )

  function rgba2hex({ a, r, g, b }: RGBColor) {
    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}${Math.round(
      (a || 0) * 255
    ).toString(16)}`
  }

  const handleChange: ColorChangeHandler = (color, e) => {
    //console.log(color)
    onChange(rgba2hex(color.rgb))
  }

  // from https://24ways.org/2010/calculating-color-contrast/
  const getContrast = useCallback((value?: string) => {
    const hexcolor = value || '#000000'
    var r = parseInt(hexcolor.substr(1, 2), 16)
    var g = parseInt(hexcolor.substr(3, 2), 16)
    var b = parseInt(hexcolor.substr(5, 2), 16)
    var yiq = (r * 299 + g * 587 + b * 114) / 1000
    return yiq >= 128 ? 'black' : 'white'
  }, [])

  const inputProps: any = useMemo(
    () => ({
      style: {
        color: getContrast(value),
        backgroundColor: value
      }
    }),
    [value]
  )

  const inputLabelProps: any = useMemo(
    () => ({
      style: {
        color: getContrast(value)
      }
    }),
    [value]
  )

  const logChanged = useCallback((e) => {
    console.log('have changed')
  }, [])

  return (
    <>
      <TextField
        id={id}
        label={label}
        placeholder={placeholder}
        onClick={handleClick}
        variant="filled"
        margin="normal"
        value={value}
        InputProps={inputProps}
        InputLabelProps={inputLabelProps}
        onChange={logChanged}
      />
      {showPicker && (
        <ClickAwayListener onClickAway={() => setShowPicker(false)}>
          <Popper
            open={showPicker}
            anchorEl={anchorEl}
            placement={placement || 'bottom-start'}
            style={{ zIndex: 2000 }}
          >
            <ChromePicker color={value} onChange={handleChange} />
          </Popper>
        </ClickAwayListener>
      )}
    </>
  )
}

export const RGBColorField = React.memo(RGBColorFieldBase)
