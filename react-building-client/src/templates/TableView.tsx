import {
  Chip,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import axios from 'axios'
import React, { FunctionComponent, useCallback, useEffect } from 'react'
import { FunctionBody } from 'typescript'
import { TableProp, useTableReducer } from '../controls/useControlReducer'

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650
  }
}))

type TableViewColumn {
    header: React.ReactNode
    item: (column: number) => React.ReactNode
}

type TableViewProp = {
    columns: TableViewColumn[]
    onEdit: (index: number) => void
    onRemove: (index: number) => void
    onCancel: (index: number) => void
    editDialog: (index: number) => React.ReactNode
    editIndex: number
}

export const TableView: FunctionComponent<TableViewProp> = ({columns, onEdit, onRemove, onCancel, editIndex}) => {
  const classes = useStyles()

  const editIcon = (index: number) => (
    <React.Fragment>
      <IconButton onClick={() => onEdit(index)}>
        <EditIcon />
      </IconButton>
      {index === editIndex ? (
        <ListPopup
          value={state.value[index]}
          onChange={tp.onUpdate}
          onCancel={tp.onCancelEdit}
          open={true}
        />
      ) : (
        <></>
      )}
    </React.Fragment>
  )

  const deleteIcon = (index: number) => (
    <IconButton onClick={() => tp.onDelete(index)}>
      <DeleteIcon color="primary" />
    </IconButton>
  )

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="lists table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Id</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Items</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state.value.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.description}</TableCell>
              <TableCell align="right" className={classes.chips}>
                {row.items.map((item, index) => (
                  <Chip
                    key={index}
                    label={item.value}
                    style={{
                      backgroundColor: item.color,
                      color: 'white'
                    }}
                  />
                ))}
              </TableCell>
              <TableCell>{editIcon(index)}</TableCell>
              <TableCell>{deleteIcon(index)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
