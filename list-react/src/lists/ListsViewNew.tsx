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
import { List } from '../model/List'
import { ListPopup } from './ListPopup'
import { TableProp, useTableReducer } from '../controls/useControlReducer'

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650
  },
  chips: {
    display: 'flex',
    justifyContent: 'right',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5)
    }
  }
}))

const rowsInitialState: List[] = []

const adjustRows = (rows: List[]) => {
  rows.forEach((list) =>
    list.items.forEach((item, index) => {
      item.index = index
      if (!list.color) {
        list.color = '#00AA00'
      }
      if (!item.color) {
        item.color = list.color
      }
    })
  )
}

export const ListsView: FunctionComponent<TableProp<List>> = (props) => {
  const classes = useStyles()

  const [state, dispatch, tp] = useTableReducer('schemas/List', props)

  useEffect(() => {
    axios.get('http://localhost:7654/lists').then((res) => {
      const rows: List[] = res.data
      adjustRows(rows)
      dispatch({ type: 'fetched', value: rows })
    })
  }, [dispatch])

  const editIcon = (index: number) => (
    <React.Fragment>
      <IconButton onClick={() => tp.onBeginUpdate(index)}>
        <EditIcon />
      </IconButton>
      {index === state.editIndex ? (
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
