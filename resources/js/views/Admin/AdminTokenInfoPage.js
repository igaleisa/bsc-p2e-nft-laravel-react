/*eslint-disable*/
import React, { useEffect, } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { useUmblCoreContract } from "@/hooks";

import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormLabel from "@material-ui/core/FormLabel";

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

import { GetTokenInformationService, AssignTokenService, } from '@/services/UserServices';
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
  
  // state variables
  const [accountError, setAccountError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [totalSupply, setTotalSupply] = React.useState(null);
  const [alert, setAlert] = React.useState(null);
  const [tokenId, setTokenId] = React.useState(null);
  const [tokenUri, setTokenUri] = React.useState(null);
  const [tokenOwner, setTokenOwner] = React.useState(null);
  const [tokenInfo, setTokenInfo] = React.useState([]);

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

  const handleTokenIdClear = () => {
    setTokenId(null);
    document.getElementById('token_id').value = '';
  };

  const handleTokenIdSearch = async () => {
    let tokenIdValue = document.getElementById('token_id').value;
    if(tokenIdValue === null || tokenIdValue === '' || tokenIdValue <= 0)
      return;

    if (!umblCoreContract) {
      return;
    }  

    setTokenId(null);
    setLoading(true);

    await umblCoreContract.methods
      .tokenUmblData(tokenIdValue)
      .call({ from: account })
      .then((res) => {
        console.log(res);
        if(res.hasOwnProperty('id') && parseInt(res.id) === parseInt(tokenIdValue)) {
          setTokenId(tokenIdValue);
          setTokenOwner(res.owner);
        } else {
          showErrorMsg('Token ID is not valid');
        }  
        setLoading(false);
      })
      .catch((err) => {        
        console.log(err);
        setLoading(false);
      });      
  };

  const handleAssign = async () => {
    let userAccount = document.getElementById('user_account').value;
    if(userAccount === null || userAccount === '')
      return;

    console.log(userAccount);

    if(!window.web3.utils.isAddress(userAccount)) {
      showErrorMsg('Account is not valid');
    }

    if (!umblCoreContract) {
      return;
    }  

    setLoading(true);

    await umblCoreContract.methods
      .safeTransferFrom(account, userAccount, tokenId)
      .send({ from: account }, (error, transactionHash) => {
        if(transactionHash === undefined) {
          setLoading(false);
          return;
        }
      });

    let postData = {
      tokenId: tokenId
    };

    AssignTokenService(postData).then(res => {
      if(res.hasOwnProperty('success') && res.success === true) {
        setLoading(false);
        const msg = 'Token Id ' + tokenId + ' was succesfully assigned to ' + userAccount + '.';
        showSuccessMsg(msg);
      } else {
        setLoading(false);
      }
    }).catch(error => {
      setLoading(false);
      showErrorMsg(error);
    });
  };

  useEffect(async () => {
    if(tokenId === null) {
      setLoading(false);
      return;
    }

    if (!umblCoreContract) {
      setLoading(false);
      return;
    }  

    await umblCoreContract.methods
      .uri(tokenId)
      .call({ from: account })
      .then((res) => {
        setTokenUri(res);        
      })
      .catch((err) => {
        setLoading(false);
        showErrorMsg(err);
        handleTokenIdClear();
      });
  }, [tokenId, tokenOwner]);

  useEffect(async () => {
    if(tokenId === null) {
      setLoading(false);
      return;
    }
    if(tokenOwner === null) {
      setLoading(false);
      return;
    }

    await GetTokenInformationService(tokenId)
      .then((res) => {
        if(res.hasOwnProperty('success') && res.success === true) {
          setLoading(false); 

          let tokenInfo = res.object;
          
          let tokenInfoVal = [                
            ['tokenId', tokenInfo.token_id],  
            ['presetId', tokenInfo.preset_id],  
            ['owner', tokenInfo.owner], 
            ['type', tokenInfo.preset.tokentype.name],                     
            ['name', tokenInfo.preset.name],
            ['description', tokenInfo.preset.description],
            ['level', tokenInfo.preset.level],
            ['state', tokenInfo.state.name],     
            ['faction', tokenInfo.preset.faction ? tokenInfo.preset.faction.name : null],
            ['category', tokenInfo.preset.category ? tokenInfo.preset.category.name : null],
            ['rarity', tokenInfo.preset.rarity ? tokenInfo.preset.rarity.name : null],
            ['badge', tokenInfo.preset.badgetype ? tokenInfo.preset.badgetype.name : null],
            ['zone', tokenInfo.preset.zonetype ? tokenInfo.preset.badgetype.name : null],
            ['thumbnail', process.env.MIX_UMBL_STORAGE_URI + 'thumbnails/' + tokenInfo.preset.thumbnail],                
            ['v360', tokenInfo.preset.v360 ? tokenInfo.preset.v360 : null],
            ['metadata', process.env.MIX_UMBL_METADATA_URI + tokenInfo.token_id]
          ];

          let tempAttributes = JSON.parse(tokenInfo.preset.attributes);

          tempAttributes.map((prop, key) => {
            tokenInfoVal.push([
              prop.trait_type, prop.value
            ]);
          });

          setTokenInfo(tokenInfoVal);          
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [tokenId, tokenOwner])

  useEffect(() => {
    const loadTotalSupply = async () => {
      if (!umblCoreContract) {
        return;
      }     

      const totalSupplyValue = await umblCoreContract.methods
        .nextTokenId()
        .call({ from: account });

      setTotalSupply(totalSupplyValue);
    };

    const checkOwnerAccount = async () => {
      if (!umblCoreContract) {
        return;
      }  
      const ownerAccount = await umblCoreContract.methods
        .owner()
        .call({ from: account });

      if(ownerAccount.toLowerCase() !== account) {
        const errMsg = "Please connect with owner account";
        setAccountError(true);
        showErrorMsg(errMsg);
      } else {
        setAccountError(false);
      }
    }

    loadTotalSupply();
    checkOwnerAccount();
  }, [umblCoreContract, account]);
  
  return (    
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>        
        <Card>
          <CardHeader color="info" text>
            <CardText color="info">
              <h4 className={classes.cardTitle + ' ' + classes.cardTitleWhite}>TOKEN INFO</h4>
            </CardText>
          </CardHeader>
          <CardBody>
          { !accountError ? (
            <form>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Token ID
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={4}>
                  <CustomInput
                    id="token_id"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "number",
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={6} className={classes.p20}>
                  <Button color="info" onClick={handleTokenIdSearch}>
                    Search
                  </Button>
                  <Button color="danger" className={classes.clearButton} onClick={handleTokenIdClear}>
                    Clear
                  </Button>
                </GridItem>
              </GridContainer>
              { tokenId ? ( 
              <div>             
                <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Token Info
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={6}>
                  <Table
                    tableHeaderColor="primary"
                    tableHead={["Key", "Value"]}
                    tableData={tokenInfo}
                    coloredColls={[3]}
                    colorsColls={["primary"]}
                  />
                </GridItem>
                <GridItem xs={12} sm={4}></GridItem>
              </GridContainer>                
              </div>
              ) : null }
            </form>
            ) :             
            (<h4 style={{margin: "30px"}}>Please connect with owner account, and refresh this page again</h4>)}
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