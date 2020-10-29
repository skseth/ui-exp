import { IconButton, makeStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import React, { FunctionComponent, useCallback } from 'react'

const useStyles = makeStyles((theme) => ({
  root: {}
}))

interface FormDialogProp {
  open: boolean
  onReset: () => void
  onUpdate: () => void
  onCancel: () => void
}

interface FormDialogActionsProps {
  onClose: () => void
  onReset: () => void
  onUpdate: () => void
}

const FormDialogActionsBase: FunctionComponent<FormDialogActionsProps> = ({
  onClose,
  onReset,
  onUpdate
}) => {
  return (
    <React.Fragment>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onReset} color="primary">
        Reset
      </Button>
      <Button variant="contained" onClick={onUpdate} color="primary">
        Update
      </Button>
    </React.Fragment>
  )
}

const FormDialogActions = React.memo(FormDialogActionsBase)

export const FormDialog: FunctionComponent<FormDialogProp> = ({
  open,
  onReset,
  onUpdate,
  onCancel,
  children
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={onCancel}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit List</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <FormDialogActions
            onClose={onCancel}
            onReset={onReset}
            onUpdate={onUpdate}
          />
        </DialogActions>
      </Dialog>
    </div>
  )
}
