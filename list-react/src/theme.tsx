import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";


// A custom theme for this app
export const homeTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#455588",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
  appDrawer: {
    width: "240px"
  }
});

export const adminTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#655566",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    }
  },
  appDrawer: {
    width: "240px"
  }
});
