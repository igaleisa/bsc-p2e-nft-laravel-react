/*eslint-disable*/
import React, { useEffect, } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { useUmblCoreContract, useUmblMarketPlaceContract } from "@/hooks";

import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormLabel from "@material-ui/core/FormLabel";

// material ui icons
import Assignment from "@material-ui/icons/Assignment";
import Person from "@material-ui/icons/Person";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check";
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

// core components
import GridContainer from "@/components/Grid/GridContainer.js";
import GridItem from "@/components/Grid/GridItem.js";
import CustomInput from "@/components/CustomInput/CustomInput.js";
import Button from "@/components/CustomButtons/Button.js";
import Card from "@/components/Card/Card.js";
import CardHeader from "@/components/Card/CardHeader.js";
import CardText from "@/components/Card/CardText.js";
import CardBody from "@/components/Card/CardBody.js";
import CardFooter from "@/components/Card/CardFooter.js";
import Table from "@/components/Table/Table.js";

import { AssignTokenListData, } from '@/services/UserServices';
import { LogoutAction } from '@/redux/actions/AuthActions';

// styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "@/assets/jss/material-dashboard-pro-react/views/adminCommonPageStyle.js";
const useStyles = makeStyles(styles);

export default function AssignPage() {
  const classes = useStyles();
  const dispatch = useDispatch();
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

  const [ownerAddress, setOwnerAddress] = React.useState('');
  const [tokenCount, setTokenCount] = React.useState(0);
  const [tokenList, setTokenList] = React.useState([]);

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
        title="Success!"
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

  const handleAssign = async () => {    
    if (!umblMarketContract || !status) {
      errMsg = "Non-Ethereum browser detected. You should consider trying MetaMask!";
      showErrorMsg(errMsg);
      return;
    }   

    setLoading(true);

    let addressValidFlag = true;
    let adminFlag = false;
    const batchAddressList = tokenList.map((prop, key) => {
      if(!prop.state) {
        addressValidFlag = false;
      } else {
        if(prop.address.toLowerCase() === ownerAddress) {
          adminFlag = true;
        } else {
          return prop.address.toLowerCase();
        }
      }
    })

    if(!addressValidFlag) {
      setLoading(false);
      showErrorMsg('Address is not valid');      
      return;
    }

    if(adminFlag) {
      setLoading(false);
      showErrorMsg('Address cannot be owner');      
      return;
    }

    console.log(batchAddressList);

    let batchTokenList = [];

    let invalidFlag = false;
    let emptyFlag = false;
    let tempTokenIdList = [];

    tokenList.map((prop, key) => {
      let newItem = [];

      let tempList = prop.tokenId.split(',');
      tempList.map((item, index) => {
        if(item.trim() !== '') {
          if(tokenCount < parseInt(item.trim())) {
            invalidFlag = true;
          } else {
            newItem.push(parseInt(item.trim()));
            tempTokenIdList.push(parseInt(item.trim()));
          }
        }
      })
      if(!newItem.length) {
        emptyFlag = true;
      } else {
        batchTokenList.push(newItem);
      }
    })

    if(invalidFlag) {
      setLoading(false);
      showErrorMsg('Invalid Token Id was found');
      return;
    }

    if(emptyFlag) {
      setLoading(false);
      showErrorMsg('Token list cannot be empty');
      return;
    }

    let duplicateFlag = false;
    var valuesSoFar = [];
    for (var i = 0; i < tempTokenIdList.length; ++i) {
        var value = tempTokenIdList[i];
        if (valuesSoFar.indexOf(value) !== -1) {
          duplicateFlag = true;
        }
        valuesSoFar.push(value);
    }

    if(duplicateFlag) {
      setLoading(false);
      showErrorMsg('Duplicated Token Id was found');
      return;
    }

    console.log(batchTokenList);

    const transaction = await umblCoreContract.methods
      .assignBatchToken(batchAddressList, batchTokenList)
      .send({ from: account }, (error, transactionHash) => {
        if(transactionHash === undefined) {
          setLoading(false);
          return;
        }
      });

    const returnValues = transaction.events.UmblTokenListAssigned.returnValues;
    if(returnValues.owner.toLowerCase() !== account.toLowerCase()) {
      setLoading(false);
      errMsg = "Smart Contract Error! Transaction history is not correct.";
      showErrorMsg(errMsg);
      return;
    }

    let assignData = {
      owner: returnValues.owner,
      to: returnValues.to,
      ids: returnValues.ids
    };

    AssignTokenListData(assignData).then((res) => {
      if(res.hasOwnProperty('success') && res.success === true) {
        setLoading(false);              
        const msg = 'Tokens was assigned successfully!';
        showSuccessMsg('Success!', msg, true);
      } else {
        setLoading(false);
        showErrorMsg(res);
        if(res.error === 'token') {
          dispatch(LogoutAction(history));
        }
      }
    }).catch(error => {
      console.log(error);
      showErrorMsg(error);
      setLoading(false);
    });

    setLoading(false);
  };

  useEffect(() => {
    const checkOwnerAccount = async () => {
      if (!umblCoreContract) {
        return;
      }  
      const ownerAccount = await umblCoreContract.methods
        .owner()
        .call({ from: account });

      setOwnerAddress(ownerAccount.toLowerCase());

      const nextTokenId = await umblCoreContract.methods
        .nextTokenId()
        .call({ from: account });

      setTokenCount(nextTokenId);

      if(ownerAccount.toLowerCase() !== account) {
        const errMsg = "Please connect with owner account";
        setAccountError(true);
        showErrorMsg(errMsg);
      } else {
        setAccountError(false);
      }
    }
    checkOwnerAccount();
  }, [umblCoreContract, account])

  useEffect(() => {
    const initAddressVal = {
      address: '',
      state: false,
      tokenId: ''
    };

    setTokenList([initAddressVal]);
  }, [])

  const handleAddAddress = () => {
    setTokenList(oldArray => [...oldArray, {
      address: '',
      tokenId: '',
      state: false
    }] );
  }

  const handleRemoveAddress = (id) => {
    const newArray = tokenList;
    newArray.splice(id, 1);
    setTokenList([...newArray]);
  }

  const handleAssignAddress = (id, val) => {
    const newArray = tokenList;
    newArray[id].address = val;

    if(window.web3.utils.isAddress(val)) {
      newArray[id].state = true;
    } else {
      newArray[id].state = false;
    }

    setTokenList([...newArray]);
  }

  const handleAssignId = (id, val) => {
    const newArray = tokenList;
    newArray[id].tokenId = val;
    setTokenList([...newArray]);
  }
  
  return (    
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>        
        <Card>
          <CardHeader color="info" text>
            <CardText color="info">
              <h4 className={classes.cardTitle + ' ' + classes.cardTitleWhite}>ASSIGN TOKEN</h4>
            </CardText>
          </CardHeader>
          <CardBody>
          { !accountError ? (
            <form>
              { tokenList.map((prop, key) => {
                return (
                  <GridContainer key={key} className="mint-preset-container">
                    <GridItem xs={3} sm={2}>
                      <FormLabel className={classes.labelHorizontal}>Address #{key+1}</FormLabel>
                    </GridItem>
                    <GridItem xs={8} sm={4}>
                      <CustomInput
                        id={"assign_address_" + (key+1).toString()}
                        value={prop.address}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: event => {
                            handleAssignAddress(key, event.target.value);
                          },
                          type: "string",
                        }}
                      />
                    </GridItem>
                    <GridItem xs={1} sm={1}>
                      {prop.address != '' ? prop.state ? 
                        (<div className="msg-success">
                          <Check className={classes.check} />
                        </div>) : 
                        (<div className="msg-danger">
                          <Close className={classes.Close} />
                        </div>) : null }
                    </GridItem>
                    <GridItem xs={3} sm={2}>
                      <FormLabel className={classes.labelHorizontal}>TokenList #{key+1}</FormLabel>
                    </GridItem>
                    <GridItem xs={8} sm={2}>
                      <FormControl fullWidth className="mint-preset-count">
                        <CustomInput                      
                          id={"assign_token" + (key+1).toString()}
                          formControlProps={{
                            fullWidth: true
                          }}
                          value={prop.tokenId}
                          inputProps={{
                            onChange: event => {
                              handleAssignId(key, event.target.value);
                            },
                            type: "string",
                          }}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem xs={1} sm={1}>
                      <div>
                        { key == 0 ? <Button color='success' simple className={classes.actionButton} onClick={() => handleAddAddress()}><Add className={classes.Add} /></Button> : null }
                        { key != 0 ? <Button color='danger' simple className={classes.actionButton} onClick={() => handleRemoveAddress(key)}><Close className={classes.Close} /></Button> : null }
                      </div>
                    </GridItem>
                  </GridContainer>
                )
              })}
            </form>
            ) :             
            (<h4 style={{margin: "30px"}}>Please connect with owner account, and refresh this page again</h4>)}
          </CardBody>
          <CardFooter className={classes.justifyContentCenter}>
          {!accountError ? (
            <Button color="info" onClick={handleAssign} style={{ margin: "30px 0 50px 0"}}>
              Assign
            </Button>
            ) : null}
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