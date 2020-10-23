import { ClickAwayListener, Popper, PopperPlacementType, TextField } from '@material-ui/core'
import React, { FunctionComponent, useState } from 'react'
import { ChromePicker, ColorChangeHandler } from 'react-color'

interface RGBColorFieldProps {
    id: string
    value: string
    label: string
    placeholder?: string
    placement?: PopperPlacementType
    onChange: ColorChangeHandler
}

export const RGBColorField: FunctionComponent<RGBColorFieldProps> = ({id, value, label, placeholder, placement, onChange}) => {
    const [showPicker, setShowPicker] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)

    const handleClick = (e: any) => {
        setAnchorEl(e.currentTarget)
        setShowPicker(true)
    }

    const handleChange: ColorChangeHandler = (color, e) => {
        console.log(color)
        onChange(color, e)
    }

    // from https://24ways.org/2010/calculating-color-contrast/
    const getContrast = (hexcolor: string) => {
        var r = parseInt(hexcolor.substr(1,2),16);
	    var g = parseInt(hexcolor.substr(3,2),16);
	    var b = parseInt(hexcolor.substr(5,2),16);
	    var yiq = ((r*299)+(g*587)+(b*114))/1000;
	    return (yiq >= 128) ? 'black' : 'white';
    }

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
                InputProps={{ style: { color: getContrast(value), backgroundColor: value } }}
                InputLabelProps={{style: { color: getContrast(value)}}}
                onChange={(e) => console.log('have changed')}
            />
            {showPicker && (
            <ClickAwayListener onClickAway={() => setShowPicker(false)}>
                <Popper open={showPicker} anchorEl={anchorEl} placement={placement || 'bottom-start'} style={{zIndex: 2000}}>
                    <ChromePicker
                        color={value}
                        onChange={handleChange}
                    />
                </Popper> 
            </ClickAwayListener>)}
        </>
  )
}
