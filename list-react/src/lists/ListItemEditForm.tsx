import { Box, Grid, IconButton, makeStyles, Popover } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import CheckIcon from "@material-ui/icons/Check";
import React, { FunctionComponent, useState } from "react";
import { RGBColor } from 'react-color';
import { RGBColorField } from "../controls/RGBColorField";
import { ListItem } from "../model/ListItem";

const useStyles = makeStyles((theme) => ({
  popup: {
    zIndex: 2000,
    opacity: "0.8"
  },
  root: {
    padding: theme.spacing(3),
    backgroundColor: "lightyellow",
    opacity: "0.8"
  },
}))

function rgba2hex({a,r,g,b}: RGBColor) {
  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}${Math.round((a||0)*255).toString(16)}`
}

interface ListItemProp {
  open: boolean
  item?: ListItem
  anchorEl?: HTMLElement
  onClose: () => void
  onUpdate: (updatedItem: ListItem) => void
}

export const ListItemEditForm: FunctionComponent<ListItemProp> = ({open, item, anchorEl, onClose, onUpdate}) => {
  if (!item) {
    item = {
        index: 99,
        value: "",
        description: "",
        color: "#00AA00"
    }
  }

  const classes = useStyles()
  const [itemValue, setItemValue] = useState(item.value)
  const [color, setColor] = useState(item.color || "#00AA00")

  const handleOk = () => {
    onUpdate(Object.assign({}, item, {value: itemValue, color}))
    onClose()
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemValue(e.target.value)
  }

  return (
    <React.Fragment>{ open && (
        <Popover 
            open={open} 
            anchorEl={anchorEl} 
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center"
            }}            
            className={classes.popup}
            onClose={onClose}
        >
          <Box className={classes.root}>
            <Grid container spacing={3} direction="column" justify="flex-start">
                <TextField
                  autoFocus
                  label="Value"
                  value={itemValue}
                  fullWidth
                  type="string"
                  variant="filled"
                  onChange={handleValueChange}
                />
              <RGBColorField id="color" label="Color" placement="right" value={color || "#fff"} onChange={(color) => setColor(rgba2hex(color.rgb))}/>
              <IconButton onClick={handleOk}>
                <CheckIcon/>
              </IconButton>
            </Grid>
          </Box>
        </Popover>    
      )}
    </React.Fragment>
  )
}