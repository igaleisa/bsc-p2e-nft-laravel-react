/*eslint-disable*/
import React, { useEffect, } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { useUmblCoreContract, useUmblMarketPlaceContract } from "@/hooks";
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Switch from '@material-ui/core/Switch';
import FormLabel from "@material-ui/core/FormLabel";

// core components
import GridContainer from "@/components/Grid/GridContainer.js";
import GridItem from "@/components/Grid/GridItem.js";
import Card from "@/components/Card/Card.js";
import CardHeader from "@/components/Card/CardHeader.js";
import CardText from "@/components/Card/CardText.js";
import CardBody from "@/components/Card/CardBody.js";
import CardFooter from "@/components/Card/CardFooter.js";

// styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "@/assets/jss/material-dashboard-pro-react/views/adminCommonPageStyle.js";
const useStyles = makeStyles(styles);

export default function ToggleMarketPage() {
  const classes = useStyles();
  const { status, account, } = useSelector(
    (state) => state.userWallet
  );

  // const { account, active } = useWeb3React();
  const umblCoreContract = useUmblCoreContract();
  const umblMarketContract = useUmblMarketPlaceContract();
  
  // state variables
  const [accountError, setAccountError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const [resaleFlag, setResaleFlag] = React.useState(false);
  const [marketFlag, setMarketFlag] = React.useState(false);

  // sweet alert functions
  const hideAlert = () => {
    setAlert(null);
  };

  const hideAlertRefresh = () => {
    setAlert(null);
    window.location.reload();
  };

  const showSuccessMsg = (message) => {
    setAlert(<SweetAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Success"
        onConfirm={() => hideAlertRefresh()}
        onCancel={() => hideAlertRefresh()}
        confirmBtnCssClass={classes.button + " " + classes.success}
      >
        {message}
    </SweetAlert>);
  };

  const showErrorMsg = (message) => {
    setAlert(
      <SweetAlert
        closeOnClickOutside={false}
        style={{ display: "block", marginTop: "-100px" }}
        title="Error!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.info}
      >
        {message}
      </SweetAlert>
    );
  };

  useEffect( async () => {
    const checkOwnerAccount = async () => {
      if (!umblCoreContract || !status) {
        setAccountError(true);
        return;
      }  
      const ownerAccount = await umblCoreContract.methods
        .owner()
        .call({ from: account });

      if(ownerAccount.toLowerCase() !== account.toLowerCase()) {
        const errMsg = "Please connect with owner account";
        setAccountError(true);
        showErrorMsg(errMsg);
      } else {
        setAccountError(false);
      }
    }

    const loadSaleFlag = async () => {
      if (!umblCoreContract) {
        return;
      }  
      await umblCoreContract.methods
        .isResaleFlag()
        .call({ from: account })
        .then(res => {
          setResaleFlag(res);
        });
    }

    const loadMarketFlag = async () => {
      if (!umblMarketContract) {
        return;
      }  
      await umblMarketContract.methods
        .isMarketPlaceFlag()
        .call({ from: account })
        .then(res => {
          setMarketFlag(res);
        });
    }

    await checkOwnerAccount();
    await loadSaleFlag();
    await loadMarketFlag();

  }, [umblCoreContract, umblMarketContract, account]);
  
  const handleResaleFlag = async () => {
    if(accountError) return;

    setLoading(true);

    const transaction = await umblCoreContract.methods
      .setResaleFlag(!resaleFlag)
      .send({ from: account }, (error, transactionHash) => {
        if(transactionHash === undefined) {
          setLoading(false);
          return;
        }
      });

    const returnValues = transaction.events.UmblResaleFlagUpdated.returnValues;
    if(returnValues.owner.toLowerCase() !== account.toLowerCase() || returnValues.isResaleFlag !== !resaleFlag) {
      setLoading(false);
      return;
    }

    setResaleFlag(!resaleFlag);
    setLoading(false);
    showSuccessMsg('Resale Flag was successfully updated!');
  };

  const handleMarketFlag = async () => {
    if(accountError) return;

    setLoading(true);

    const transaction = await umblMarketContract.methods
      .setMarketPlaceFlag(!marketFlag)
      .send({ from: account }, (error, transactionHash) => {
        if(transactionHash === undefined) {
          setLoading(false);
          return;
        }
      });

    const returnValues = transaction.events.UmblMarketPlaceFlagUpdated.returnValues;
    if(returnValues.owner.toLowerCase() !== account.toLowerCase() || returnValues.isMarketPlaceFlag !== !marketFlag) {
      setLoading(false);
      return;
    }

    setMarketFlag(!marketFlag);
    setLoading(false);
    showSuccessMsg('Marketplace Flag was successfully updated!');
  };

  return (    
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>        
        <Card>
          <CardHeader color="info" text>
            <CardText color="info">
              <h4 className={classes.cardTitle + ' ' + classes.cardTitleWhite}>TOGGLE MARKETPLACE</h4>
            </CardText>
          </CardHeader>
          <CardBody>
            { !accountError ? (
            <GridContainer>
              <GridItem xs={12} sm={4}>
                <FormLabel className={classes.labelHorizontal + ' ' + classes.bigTitle}>
                  Enable/Disable Resale Flag
                </FormLabel>
              </GridItem>
              <GridItem xs={12} sm={4} className={classes.toggleContainer}>
                <Switch
                  checked={resaleFlag}
                  onChange={handleResaleFlag}
                  name="Market Flag"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              </GridItem>
              <GridItem xs={12} sm={4}></GridItem>
              <GridItem xs={12} sm={4}>
                <FormLabel className={classes.labelHorizontal + ' ' + classes.bigTitle}>
                  Enable/Disable Marketplace Flag
                </FormLabel>
              </GridItem>
              <GridItem xs={12} sm={4} className={classes.toggleContainer}>
                <Switch
                  checked={marketFlag}
                  onChange={handleMarketFlag}
                  name="Market Flag"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              </GridItem>
              <GridItem xs={12} sm={4}></GridItem>
            </GridContainer>) : (
              <h4 style={{margin: "30px"}}>Please connect with owner account, and refresh this page again</h4>
            )}
          </CardBody>
          <CardFooter className={classes.justifyContentCenter}>
          </CardFooter>          
        </Card>        
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        {alert}
      </GridItem>
    </GridContainer>  
  );
}