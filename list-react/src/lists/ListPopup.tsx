import { Divider, makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import React, { FunctionComponent } from "react";
import { ColorChangeHandler } from 'react-color';
import { RGBColorField } from "../controls/RGBColorField";
import { List } from "../model/List";
import { ListItem } from "../model/ListItem";
import { ListItemsField } from "./ListItemsField";


const useStyles = makeStyles((theme) => ({
  root: {},
}))

interface ListPopupProp {
  index: number;
  list: List;
  onEditComplete: (index: number, newList: List) => void;
}

export const ListPopup: FunctionComponent<ListPopupProp> = ({
  index,
  list,
  onEditComplete,
}) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(list.name);
  const [description, setDescription] = React.useState(list.description);
  const [items, setItems] = React.useState(list.items);
  const [color, setColor] = React.useState(list.color);
  const [isUpdated, setUpdated] = React.useState(false);

  const handleOpenPopup = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onEditComplete(index, Object.assign({}, list, {name, description, color}))
  };

  const handleUpdate = () => {
    setOpen(false);
    if (isUpdated) {
      onEditComplete(index, Object.assign({}, list, {name, description, color, items}))
    }
  };

  const handleReset = () => {
    if (isUpdated) {
      setName(list.name)
      setDescription(list.description)
      setColor(list.color)
      setItems(list.items)
      setUpdated(false)
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setUpdated(true)
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    setUpdated(true)
  };

  const handleColorChange: ColorChangeHandler = (color) => {
    setColor(color.hex);
    setUpdated(true)
  };

  const handleItemsChange = (items: ListItem[]) => {
    setItems(items)
    setUpdated(true)
  }

  return (
    <div className={classes.root}>
      <Button variant="contained" color="secondary" onClick={handleOpenPopup}>
        Edit
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit List</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit list {name}</DialogContentText>
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label="Name"
            value={name}
            fullWidth
            variant="filled"
            onChange={handleNameChange}
          />
          <TextField
            margin="normal"
            id="description"
            label="Description"
            fullWidth
            value={description}
            variant="filled"
            onChange={handleDescriptionChange}
          />
          <RGBColorField value={color || ""} id="color" label="Color" onChange={handleColorChange}/>
          <Divider style={{marginBottom: "5px", marginTop: "5px"}}/>
          <ListItemsField items={items} listColor={color} onUpdateItems={handleItemsChange}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReset} color="primary">
            Reset
          </Button>
          <Button variant="contained" onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
