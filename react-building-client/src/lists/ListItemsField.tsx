import {
  fade,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Typography
} from '@material-ui/core'
import React, { FunctionComponent, useCallback, useState } from 'react'
import AddIcon from '@material-ui/icons/Add'
import { ListItem } from '../model/ListItem'
import { ListItemField } from './ListItemField'
import { ListItemEditForm } from './ListItemEditForm'

const useStyles = makeStyles((theme) => ({
  chips: {
    display: 'flex',
    justifyContent: 'right',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5)
    },
    backgroundColor: fade('#000000', 0.1),
    padding: '4px'
  }
}))

interface ListItemsProps {
  value: ListItem[]
  defaultItemColor?: string
  onChange: (items: ListItem[]) => void
}

const ListItemsFieldBase: FunctionComponent<ListItemsProps> = ({
  value: items,
  defaultItemColor: listColor,
  onChange: onUpdateItems
}) => {
  const classes = useStyles()

  const [showAdd, setShowAdd] = useState(false)
  const [addAnchorEl, setAddAnchorEl] = useState<HTMLElement>()

  const startAdd = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setAddAnchorEl(e.currentTarget)
      setShowAdd(true)
    },
    [setAddAnchorEl, setShowAdd]
  )

  const updateItem = useCallback(
    (item: ListItem) => {
      const newItems = items.slice()
      newItems[item.index] = item
      onUpdateItems(newItems)
    },
    [items]
  )

  const addItem = useCallback(
    (item: ListItem) => {
      const newItems = items.slice()
      item.index = newItems.length
      newItems.push(item)
      onUpdateItems(newItems)
    },
    [items]
  )

  return (
    <React.Fragment>
      <Typography>Items</Typography>
      <Grid container spacing={1} alignItems="center" justify="flex-start">
        <Grid item xs={8}>
          <Paper className={classes.chips} {...({ margin: 'normal' } as any)}>
            {items.map((item, index) => (
              <ListItemField
                key={index}
                item={item}
                listColor={listColor}
                onUpdateItem={updateItem}
              />
            ))}
          </Paper>
        </Grid>
        <Grid item xs={1}>
          <IconButton
            style={{ backgroundColor: 'darkgrey', color: 'white' }}
            onClick={startAdd}
          >
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>
      <ListItemEditForm
        open={showAdd}
        anchorEl={addAnchorEl}
        onClose={() => setShowAdd(false)}
        onUpdate={addItem}
      />
    </React.Fragment>
  )
}

export const ListItemsField = React.memo(ListItemsFieldBase)
