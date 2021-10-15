/*eslint-disable*/
import React, { useEffect, } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'; 
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
import Store from "@material-ui/icons/Store";
// import InfoOutline from "@material-ui/icons/InfoOutline";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

// core components
import GridContainer from "@/components/Grid/GridContainer.js";
import GridItem from "@/components/Grid/GridItem.js";
import Danger from "@/components/Typography/Danger.js";
import Card from "@/components/Card/Card.js";
import CardHeader from "@/components/Card/CardHeader.js";
import CardIcon from "@/components/Card/CardIcon.js";
import CardFooter from "@/components/Card/CardFooter.js";


import styles from "@/assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

import { GetUserCountService, GetCrateCountService, GetObjectCountService, GetLoginCountService } from '@/services/UserServices';
import { LogoutAction } from '@/redux/actions/AuthActions';

export default function Dashboard() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [userCount, setUserCount] = React.useState(null);
  const [crateCount, setCrateCount] = React.useState(null);
  const [objectCount, setObjectCount] = React.useState(null);
  const [loginCount, setLoginCount] = React.useState(null);

  useEffect( async () => {
    await GetUserCountService().then((res) => {
      if(res.hasOwnProperty('success') && res.success === true) {
        setUserCount(res.users);
      } else {
        if(res.error === 'token') {
          dispatch(LogoutAction(history));
        }
      }
    }); 

    await GetCrateCountService().then((res) => {
      if(res.hasOwnProperty('success') && res.success === true) {
        setCrateCount(res.crates);
      } else {
        if(res.error === 'token') {
          dispatch(LogoutAction(history));
        }
      }
    }); 

    await GetObjectCountService().then((res) => {
      if(res.hasOwnProperty('success') && res.success === true) {
        setObjectCount(res.objects);
      } else {
        if(res.error === 'token') {
          dispatch(LogoutAction(history));
        }
      }
    }); 

    await GetLoginCountService().then((res) => {
      if(res.hasOwnProperty('success') && res.success === true) {
        setLoginCount(res.logins);
      } else {
        if(res.error === 'token') {
          dispatch(LogoutAction(history));
        }
      }
    }); 
  }, [])

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>account_box</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Total Users</p>
              <h3 className={classes.cardTitle}>
                {userCount}
              </h3>
            </CardHeader>
            <CardFooter stats>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Icon>build</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Total Objects</p>
              <h3 className={classes.cardTitle}>{objectCount}</h3>
            </CardHeader>
            <CardFooter stats>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Icon>redeem</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Total Crates</p>
              <h3 className={classes.cardTitle}>{crateCount}</h3>
            </CardHeader>
            <CardFooter stats>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Icon>person_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Today Logins</p>
              <h3 className={classes.cardTitle}>{loginCount}</h3>
            </CardHeader>
            <CardFooter stats>
            </CardFooter>
          </Card>
        </GridItem>
        {/* <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Icon>person_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Contract Address</p>
              <h3 className={classes.cardTitle}>{process.env.MIX_UMBL_NFT_ADDRESS}</h3>
            </CardHeader>
            <CardFooter stats>
            </CardFooter>
          </Card>
        </GridItem> */}
      </GridContainer>
    </div>
  );
}
