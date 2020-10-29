import {
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography
} from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import AssignmentIcon from '@material-ui/icons/AssignmentOutlined'
import BuildIcon from '@material-ui/icons/Build'
import BusinessIcon from '@material-ui/icons/BusinessOutlined'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import HomeIcon from '@material-ui/icons/HomeOutlined'
import PeopleIcon from '@material-ui/icons/People'
import clsx from 'clsx'
import React, { FunctionComponent, ReactElement } from 'react'
import { Link, useLocation } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: '8px',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: theme.appDrawer.width,
    width: `calc(100% - ${theme.appDrawer.width})`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: theme.appDrawer.width,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    height: 240
  },
  menuSummary: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56
  },
  nested: {
    //paddingLeft: theme.spacing(4),
    backgroundColor: 'lightgrey'
  },
  selectedMenu: {
    backgroundColor: theme.palette.secondary.light
  },
  unselectedMenu: {}
}))

interface LeftMenu {
  name: string
  icon?: ReactElement
  link: string
  submenus: LeftMenu[]
}

const homeMenu: LeftMenu[] = [
  { name: 'Home', icon: <HomeIcon />, link: '/', submenus: [] },
  { name: 'Admin', icon: <BusinessIcon />, link: '/admin', submenus: [] }
]

const adminMenu: LeftMenu[] = [
  { name: 'Home', icon: <HomeIcon />, link: '/', submenus: [] },
  { name: 'Admin', icon: <BusinessIcon />, link: '/admin', submenus: [] },
  {
    name: 'Maintenance',
    link: '#',
    icon: <BuildIcon />,
    submenus: [
      {
        name: 'Users',
        link: '/admin/users',
        icon: <PeopleIcon />,
        submenus: []
      },
      {
        name: 'Lists',
        link: '/admin/lists',
        icon: <AssignmentIcon />,
        submenus: []
      }
    ]
  }
]

interface LeftMenuEntryProp {
  entry: LeftMenu
}

interface LeftNavBarProps {
  isOpen: boolean
  isAdmin: boolean
  onClickDrawer: () => void
}

const CollapsibleListMenu: FunctionComponent<LeftMenuEntryProp> = ({
  entry
}) => {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(true)
  const location = useLocation()

  const handleClick = () => {
    setExpanded(!expanded)
  }

  const hasChildren = entry.submenus.length > 0

  return (
    <>
      <ListItem
        key={entry.name}
        onClick={handleClick}
        className={
          location.pathname === entry.link
            ? classes.selectedMenu
            : classes.unselectedMenu
        }
        component={Link}
        to={entry.link}
        button
      >
        <ListItemIcon>{entry.icon}</ListItemIcon>
        <ListItemText primary={entry.name} />
        {hasChildren && (expanded ? <ExpandLess /> : <ExpandMore />)}
      </ListItem>
      {hasChildren && (
        <Collapse
          key={'Collapse' + entry.name}
          in={expanded}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            {entry.submenus.map((submenu) => {
              return (
                <ListItem
                  key={submenu.name}
                  button
                  className={classes.nested}
                  component={Link}
                  to={submenu.link}
                >
                  {submenu.icon ? (
                    <ListItemIcon>{submenu.icon}</ListItemIcon>
                  ) : (
                    <></>
                  )}
                  <ListItemText
                    primary={<Typography>{submenu.name}</Typography>}
                  />
                </ListItem>
              )
            })}
          </List>
        </Collapse>
      )}
    </>
  )
}

export const LeftNavBar: FunctionComponent<LeftNavBarProps> = ({
  isOpen,
  isAdmin,
  onClickDrawer
}) => {
  const classes = useStyles()
  const mainmenu = isAdmin ? adminMenu : homeMenu

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !isOpen && classes.drawerPaperClose)
      }}
      open={isOpen}
    >
      <div className={classes.toolbarIcon}>
        <img src="/shop-logo.png" alt="logo" style={{ height: '80%' }} />
        <IconButton onClick={onClickDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <List>
        {mainmenu.map((menu, index) => (
          <CollapsibleListMenu key={index} entry={menu} />
        ))}
      </List>
    </Drawer>
  )
}
