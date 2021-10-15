/*eslint-disable*/
import React, { useEffect, } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'; 

import { useUmblCoreContract } from "@/hooks";

// SweetAlert
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormLabel from "@material-ui/core/FormLabel";
import InputAdornment from "@material-ui/core/InputAdornment";

// material ui icons

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
import CardIcon from "@/components/Card/CardIcon.js";
import CardBody from "@/components/Card/CardBody.js";
import CardFooter from "@/components/Card/CardFooter.js";
import ImageUpload from "@/components/CustomUpload/ImageUpload.js";
import ImageMultipleUpload from "@/components/CustomUpload/ImageMultipleUpload.js";

// service and actions
import { 
  GetPresetData,
  AddBatchTokenList, 
} from '@/services/UserServices';
import { LogoutAction } from '@/redux/actions/AuthActions';

// styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "@/assets/jss/material-dashboard-pro-react/views/adminCommonPageStyle.js";
const useStyles = makeStyles(styles);

export default function MintNFTPage() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { status, account, } = useSelector((state) => state.userWallet);
  const umblCoreContract = useUmblCoreContract();
  
  // state variables
  const [accountError, setAccountError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);  
  const [alert, setAlert] = React.useState(null);
  const [ownerAddress, setOwnerAddress] = React.useState('');
  
  const [mintPreset, setMintPreset] = React.useState([]);
  const [presetData, setPresetData] = React.useState([]);
  const [mintAddress, setMintAddress] = React.useState([]);

  const handlePresetSelect = (id, value) => {
    const newArray = mintPreset;
    newArray[id].preset_id = value;
    setMintPreset([...newArray]);
  }

  useEffect(() => {
    GetPresetData().then((res) => {
      if(res.hasOwnProperty('success') && res.success === true) {
        setPresetData(res.presets);
      } else if(res.error === 'token') {
        dispatch(LogoutAction(history));
      }
    }); 

    const initVal = {
      preset_id: '',
      count: 1
    };

    setMintPreset([initVal]);

    const initAddressVal = {
      value: '',
      state: false
    };

    setMintAddress([initAddressVal]);
  }, []) 
  
  // sweet alert functions
  const hideAlert = (refresh=false) => {
    setAlert(null);
    if(refresh) window.location.reload();
  };

  const showSuccessMsg = (title='Success!', message='', refresh=false) => {
    setAlert(<SweetAlert
        success
        closeOnClickOutside={false}
        style={{ display: "block", marginTop: "-100px" }}
        title={title}
        onConfirm={() => hideAlert(refresh)}
        onCancel={() => hideAlert(refresh)}
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

  const showMultiErrorMsg = (messages) => {
    setAlert(
      <SweetAlert
        closeOnClickOutside={false}
        html={true}
        style={{ display: "block", marginTop: "-100px" }}
        title="Error!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.info}
      >
        {messages.map((data, key) => {
          return (
            <p key={key}>{data}</p>
          )
        })}
      </SweetAlert>
    );
  };

  useEffect(() => {
    const checkAccunt = async () => {
      if (!umblCoreContract) {
        setAccountError(true);
        return;
      }  
      const ownerAccount = await umblCoreContract.methods
        .owner()
        .call({ from: account });

      setOwnerAddress(ownerAccount.toLowerCase());

      if(ownerAccount.toLowerCase() !== account) {
        setAccountError(true);
        showErrorMsg("Please connect with owner account");
      } else {
        setAccountError(false);
      }
    }
    checkAccunt();
  }, [account]);

  const handleMint = async () => {

    let addressValidFlag = true;
    const batchAddressList = mintAddress.map((prop, key) => {
      if(!prop.state && prop.value !== '') {
        addressValidFlag = false;
      } else {
        if(prop.value === '') {
          return ownerAddress.toLowerCase();
        } else {
          return prop.value.toLowerCase();
        }
      }
    })

    if(!addressValidFlag) {
      showErrorMsg('Address invalid');
      return;
    }

    let errMsg;

    const batchPresetIds = mintPreset.map((prop, key) => {
      if(prop.preset_id !== '') {
        return parseInt(prop.preset_id)
      }
    })

    const batchPresetAmounts = mintPreset.map((prop, key) => {
      if(prop.preset_id !== '') {
        return parseInt(prop.count)
      }
    })

    if(batchPresetIds.length === 0 ||  batchPresetAmounts.length === 0)
      return;

    if(batchPresetIds.length !== batchPresetAmounts.length)
      return;

    console.log(batchAddressList);
    console.log(batchPresetIds);
    console.log(batchPresetAmounts);

    if (!umblCoreContract || !status) {
      errMsg = "Non-Ethereum browser detected. You should consider trying MetaMask!";
      showErrorMsg(errMsg);
      return;
    }   

    setLoading(true);

    const transaction = await umblCoreContract.methods
      .mintBatchPresets(batchAddressList, batchPresetIds, batchPresetAmounts)
      .send({ from: account }, (error, transactionHash) => {
        if(transactionHash === undefined) {
          setLoading(false);
          return;
        }
      });

    console.log(transaction);

    const returnValues = transaction.events.UmblPresetMinted.returnValues;
    if(returnValues.owner.toLowerCase() !== account.toLowerCase()) {
      setLoading(false);
      errMsg = "Smart Contract Error! Transaction history is not correct.";
      showErrorMsg(errMsg);
      return;
    }

    let registerData = {
      owner: ownerAddress,
      to: returnValues.to,
      presetIds: returnValues.presetIds,
      tokenIds: returnValues.tokenIds,
      amounts: returnValues.amount,
    };

    AddBatchTokenList(registerData).then((res) => {
      if(res.hasOwnProperty('success') && res.success === true) {
        setLoading(false);              
        const msg = 'New Tokens was created successfully!';
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
  }

  const handleAddPreset = () => {
    setMintPreset(oldArray => [...oldArray, {
      preset_id: '',
      count: 1
    }] );
  }

  const handleAddAddress = () => {
    setMintAddress(oldArray => [...oldArray, {
      value: '',
      state: false
    }] );
  }

  const handleRemovePreset = (id) => {
    const newArray = mintPreset;
    newArray.splice(id, 1);
    setMintPreset([...newArray]);
  }

  const handleRemoveAddress = (id) => {
    const newArray = mintAddress;
    newArray.splice(id, 1);
    setMintAddress([...newArray]);
  }

  const handleMintPresetCount = (id, val) => {
    const newArray = mintPreset;
    newArray[id].count = val;
    setMintPreset([...newArray]);
  }

  const handleMintAddress = (id, val) => {
    const newArray = mintAddress;
    newArray[id].value = val;

    if(web3.utils.isAddress(val)) {
      newArray[id].state = true;
    } else {
      newArray[id].state = false;
    }

    setMintAddress([...newArray]);
  }

  return (    
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>        
        <Card>
          <CardHeader color="info" text>
            <CardText color="info">
              <h4 className={classes.cardTitle + ' ' + classes.cardTitleWhite}>UMBL TOKEN MINTING</h4>
            </CardText>
          </CardHeader>
          <CardBody>
          {!accountError ? (
            <form className="admin-mint-form">  
              {mintAddress.map((prop, key) => { 
                return (     
                  <GridContainer className="mint-preset-container admin-mint-form-header" key={key}>
                    <GridItem xs={12} sm={2}>
                      <FormLabel className={classes.labelHorizontal}>Address # {key+1}</FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={6}>
                      <CustomInput
                        id={"mint_address_" + (key+1).toString()}
                        value={prop.value}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: event => {
                            handleMintAddress(key, event.target.value);
                          },
                          type: "string",
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={2}>
                      {prop.value != '' ? prop.state ? 
                        (<div className="msg-success">
                          <Check className={classes.check} />
                        </div>) : 
                        (<div className="msg-danger">
                          <Close className={classes.Close} />
                        </div>) : null }
                    </GridItem>
                    <GridItem xs={12} sm={2}>
                      <div>
                        { key == 0 ? <Button color='success' simple className={classes.actionButton} onClick={() => handleAddAddress()}><Add className={classes.Add} /></Button> : null }
                        { key != 0 ? <Button color='danger' simple className={classes.actionButton} onClick={() => handleRemoveAddress(key)}><Close className={classes.Close} /></Button> : null }
                      </div>
                    </GridItem>
                  </GridContainer>
                ) }) }
              {mintPreset.map((prop, key) => { 
                return (                 
                  <GridContainer key={key} className="mint-preset-container">
                    <GridItem xs={12} sm={2}>
                      <FormLabel className={classes.labelHorizontal}>Preset #{key+1}</FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={6}>
                      <FormControl fullWidth className={classes.selectFormControl}>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          classes={{
                            select: classes.select
                          }}
                          value={prop.preset_id}
                          onChange={event => handlePresetSelect(key, event.target.value)}
                          inputProps={{
                            name: "mint_preset_" + (key+1).toString(),
                            id: "mint_preset_" + (key+1).toString()
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem
                            }}
                          >
                            Choose Preset
                          </MenuItem>
                          { presetData.map((data, key) => {
                            return (
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value={data.preset_id}
                                key={key}
                              >
                                {data.name}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={2}>
                      <FormControl fullWidth className="mint-preset-count">
                        <CustomInput                      
                          id={"mint_count" + (key+1).toString()}
                          formControlProps={{
                            fullWidth: true
                          }}
                          value={prop.count}
                          inputProps={{
                            onChange: event => {
                              handleMintPresetCount(key, event.target.value);
                            },
                            type: "number",
                          }}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={2}>
                      <div>
                        { key == 0 ? <Button color='success' simple className={classes.actionButton} onClick={() => handleAddPreset()}><Add className={classes.Add} /></Button> : null }
                        { key != 0 ? <Button color='danger' simple className={classes.actionButton} onClick={() => handleRemovePreset(key)}><Close className={classes.Close} /></Button> : null }
                      </div>
                    </GridItem>
                  </GridContainer>
                )
              } 
              )}                     
            </form>
          ) : (<h4 style={{margin: "30px"}}>Please connect with owner account, and refresh this page again</h4>)}
          </CardBody>
          <CardFooter className={classes.justifyContentCenter}>            
            {!accountError ? (
            <Button color="info" onClick={handleMint} style={{ margin: "30px 0 50px 0"}}>
              Mint
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