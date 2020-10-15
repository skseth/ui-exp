import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Title } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { ListView } from "../lists/ListView";

export const useStyles = makeStyles((theme) => ({
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

export function ListPage() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}>
            <Title>Headings</Title>
            <p>Hello</p>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}>
            <ListView id={6} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
