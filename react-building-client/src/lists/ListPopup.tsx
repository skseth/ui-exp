import { Divider, makeStyles } from '@material-ui/core'
import React, { FunctionComponent } from 'react'
import { RGBColorField } from '../controls/RGBColorField'
import { StringControl } from '../controls/StringControl'
import { DialogProp, useFormReducer } from '../controls/useControlReducer'
import { List } from '../model/List'
import { FormDialog } from '../templates/FormDialog'
import { ListItemsField } from './ListItemsField'

const useStyles = makeStyles((theme) => ({
  root: {}
}))

export const ListPopup: FunctionComponent<DialogProp<List>> = (props) => {
  const classes = useStyles()

  const [state, dispatch, { cp, fp }] = useFormReducer('schemas/List', props)

  return (
    <FormDialog
      open={props.open}
      onReset={fp.onReset}
      onUpdate={fp.onComplete}
      onCancel={fp.onCancel}
    >
      <StringControl
        {...cp.name}
        value={state.value.name}
        margin="normal"
        autofocus={true}
      />
      <StringControl
        {...cp.description}
        value={state.value.description}
        margin="normal"
        fullWidth
      />
      <RGBColorField
        value={state.value.color}
        id="color"
        label="Color"
        onChange={cp.color.onChange}
      />
      <Divider style={{ marginBottom: '5px', marginTop: '5px' }} />
      <ListItemsField
        value={state.value.items}
        defaultItemColor={state.value.color}
        onChange={cp.items.onChange}
      />
    </FormDialog>
  )
}
