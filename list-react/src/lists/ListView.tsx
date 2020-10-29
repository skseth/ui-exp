import React, { FunctionComponent, useState, useEffect } from 'react'
import { List } from '../model/List'
import axios from 'axios'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  list: {
    float: 'left'
  }
}))

const listInitialState: Omit<List, 'id'> = {
  name: 'Status',
  description: '',
  color: '#009900',
  items: [
    { index: 1, value: 'Active', description: 'Active State' },
    { index: 2, value: 'Inactive', description: 'Inactive State' }
  ]
}

type ListViewProps = Pick<List, 'id'>
export const ListView: FunctionComponent<ListViewProps> = (props) => {
  const classes = useStyles()
  const [id, setId] = useState(props.id)
  const [list, setList] = useState(listInitialState)

  useEffect(() => {
    axios.get('http://localhost:7654/lists/2').then((res) => {
      console.log(res.data)
      setList({
        name: res.data.name,
        description: res.data.description,
        color: res.data.color,
        items: res.data.items.map((item: any, index: number) => ({
          index: index,
          value: item.value,
          description: item.description
        }))
      })
    })
  }, [])

  return (
    <div className={classes.list}>
      <h2>
        List Item {id} - {list.name}
      </h2>
      <ul>
        {list.items.map((item) => (
          <li key={item.value}>{item.description}</li>
        ))}
      </ul>
    </div>
  )
}
