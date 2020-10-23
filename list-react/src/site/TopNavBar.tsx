import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/Notifications";
import clsx from "clsx";
import React, { FunctionComponent, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { LoginPopup } from "./LoginPopup";


export const TopNavBarOld = () => {
  return (
    <nav style={{ margin: 10 }}>
      <Link to="/" style={{ padding: 5 }}>
        Home
      </Link>
      <Link to="/about" style={{ padding: 5 }}>
        About
      </Link>
      <Link to="/posts" style={{ padding: 5 }}>
        Posts
      </Link>
    </nav>
  );
};

const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: theme.appDrawer.width,
    width: `calc(100% - ${theme.appDrawer.width})`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbarBox: {
    width: theme.appDrawer.width, 
    display: "flex", 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center"
  },
  menuButton: {
    //marginRight: 36,
    flexBasis: "40%"
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
}));

interface TopNavBarProps {
  isDrawerOpen: boolean
  isAdmin: boolean,
  onClickDrawer: () => void
}

export const TopNavBar: FunctionComponent<TopNavBarProps> = ({isDrawerOpen, isAdmin, onClickDrawer}) => {
  const classes = useStyles();
  const userctx = useContext(UserContext)

  return (
    <AppBar
      position="absolute"
      className={clsx(classes.appBar, isDrawerOpen && classes.appBarShift)}
    >
      <Toolbar className={classes.toolbar}>
        {isDrawerOpen ? <></> :
        <Box className={classes.toolbarBox}>
        <img src="/shop-logo-white.png" alt="logo" style={{height: "35px"}}/>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={onClickDrawer}
          className={clsx(classes.menuButton)}
        >
          <MenuIcon />
        </IconButton>
        </Box>} 

        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          className={classes.title}
        >
          {isAdmin? "Administration" : "UI Experiments"}
        </Typography>
          {userctx.isLoggedIn? <Typography>Hello, {userctx.username}</Typography> : <LoginPopup /> }
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
