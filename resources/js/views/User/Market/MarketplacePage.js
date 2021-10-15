import React, { useState, useEffect, } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "@/components/Grid/GridContainer.js";
import GridItem from "@/components/Grid/GridItem.js";
import Card from "@/components/Card/Card.js";
import CardBody from "@/components/Card/CardBody.js";

import style from "@/assets/jss/material-dashboard-pro-react/views/marketplacePageStyle.js";
const useStyles = makeStyles(style);

export default function MarketplacePage() {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();

  const { loading, isAuthenticated, isAdmin, currentUser, token, error, } = useSelector(
    (state) => state.userAuth
  );

  useEffect(() => {
    if(!isAuthenticated) {
      history.push('/');
    }
  }, []);

  return (
    <div className={classes.container}> 
      <GridContainer justifyContent="center">
        <GridItem xs={12} sm={12} md={12}>
          { isAuthenticated ? (
          <Card main>
            <CardBody border>
              <div className={classes.mainBlock}>
                <div className={classes.mainTitle}>Coming Soon</div>
              </div>              
              <div
                className={classes.fullBackImage}
              />
            </CardBody>
          </Card>
          ) : null }
        </GridItem>
      </GridContainer>
    </div>
  );
}