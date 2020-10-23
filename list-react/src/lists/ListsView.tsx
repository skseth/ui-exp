import { Chip, IconButton, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import axios from 'axios'
import React, { useEffect } from 'react'
import { List } from '../model/List'
import { ListPopup } from './ListPopup'

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  chips: {
    display: 'flex',
    justifyContent: 'right',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}))

const rowsInitialState: List[] = []


export const ListsView = () => {
  const classes = useStyles();
  const [rows, setRows] = React.useState(rowsInitialState);

  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  useEffect(() => {
    axios.get("http://localhost:7654/lists").then((res) => {

      const rows: List[] = res.data

      rows.forEach((list) => list.items.forEach((item, index) => {
        item.index = index
        if (!list.color) {
          list.color = "#00AA00"
        }
        if (!item.color) {
          item.color = list.color
        }
      }))

      setRows(rows);
    });
  }, [])

  const deleteComponent = (index: number) => {
    // perform deletion
    var newRows = rows.slice()
    newRows.splice(index,1)
    setRows(newRows)
  }

  const onEditComplete = (index: number, newList: List) => {
    var newRows = rows.slice()
    newRows[index] = newList
    setRows(newRows)
  }

  const editIcon = (index: number) => (
      <ListPopup index={index} list={rows[index]} onEditComplete={onEditComplete} />
    );

  const deleteIcon = (index: number) => (
      <IconButton onClick={() => deleteComponent(index)}>
        <DeleteIcon color="primary" />
      </IconButton>
    );

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
        <TableBody>{
          rows.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>            
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.description}</TableCell>
              <TableCell align="right" className={classes.chips}>{row.items.map((item, index) => <Chip key={index} label={item.value} style={{ backgroundColor: item.color || row.color || "#00aa00", color: "white"}} onDelete={handleDelete} />)}</TableCell>
              <TableCell>{editIcon(index)}</TableCell>
              <TableCell>{deleteIcon(index)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}