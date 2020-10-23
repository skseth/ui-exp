import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { defaultUserContext, UserContext } from "./contexts/UserContext";
import { ListPage } from "./lists/ListPage";
import { LeftNavBar } from "./site/LeftNavBar";
import { TopNavBar } from "./site/TopNavBar";
import { adminTheme, homeTheme } from "./theme";

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function App() {
  const classes = useStyles();
  const [isDrawerOpen, setDrawerOpen] = React.useState(true);
  let location = useLocation()
  const [isAdmin, setAdmin] = useState(location.pathname.startsWith('/admin'))

  useEffect(
    () => {
      if (location.pathname.startsWith('/admin')) {
          setAdmin(true)
      } else {
          setAdmin(false)
      }
    },
    [location]
  )

  //Toggle function (open/close Drawer)
  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen)
  }

  return (
    <ThemeProvider theme={isAdmin? adminTheme: homeTheme}>
      <UserContext.Provider value={defaultUserContext}>
        <div className={classes.root}>
          <CssBaseline />
          <TopNavBar isDrawerOpen={isDrawerOpen} isAdmin={isAdmin} onClickDrawer={toggleDrawer}/>
          <LeftNavBar isOpen={isDrawerOpen} isAdmin={isAdmin} onClickDrawer={toggleDrawer}/>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Routes>
              <Route path="/" element={<></>} />
              <Route path="/admin" element={<></>} />
              <Route path="/admin/lists" element={<ListPage/>} />
            </Routes>
          </main>
        </div>
      </UserContext.Provider>
    </ThemeProvider>
  );
}
