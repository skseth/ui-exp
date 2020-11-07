import { Box, Chip, makeStyles } from '@material-ui/core'
import React from 'react'
import { ListItem } from '../model/ListItem'
import { ListItemEditForm } from './ListItemEditForm'

const useStyles = makeStyles((theme) => ({
  root: {}
}))

interface ItemProps {
  item: ListItem
  listColor?: string
  onUpdateItem: (item: ListItem) => void
}

const ListItemFieldBase: React.FC<ItemProps> = ({
  item,
  listColor,
  onUpdateItem
}) => {
  const classes = useStyles()
  const [editDialogVisible, setEditDialogVisible] = React.useState(false)
  const [editAnchorEl, setEditAnchorEl] = React.useState<HTMLElement>()

  const showEditDialog = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setEditAnchorEl(e.currentTarget)
    setEditDialogVisible(true)
  }

  return (
    <Box className={classes.root}>
      <Chip
        label={item.value}
        style={{ backgroundColor: item.color || '#00aa00', color: 'white' }}
        onClick={showEditDialog}
      />
      <ListItemEditForm
        item={item}
        open={editDialogVisible}
        anchorEl={editAnchorEl}
        onClose={() => setEditDialogVisible(false)}
        onUpdate={onUpdateItem}
      />
    </Box>
  )
}

export const ListItemField = React.memo(ListItemFieldBase)
