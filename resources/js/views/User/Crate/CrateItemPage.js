import React, { useState, useEffect, } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import Button from "@/components/CustomButtons/Button.js";
import React360Viewer from "@/components/360/React360Viewer.js";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import SweetAlert from "react-bootstrap-sweetalert";

// styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "@/assets/jss/material-dashboard-pro-react/views/commonPageStyle.js";
const useStyles = makeStyles(styles);

import tokenThumbnail from "@/assets/img/test/weapon-2.png";

// actions
import { LogoutAction, } from '@/redux/actions/AuthActions';

import { GetCrateInfoService, AddBatchTokenList, } from '@/services/UserServices';

// contract
import { useUmblCoreContract, useUmblMarketPlaceContract, useBusdContract } from "@/hooks";

export default function CrateItemPage() {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const { crateId } = useParams();

    const { isAuthenticated, isAdmin, } = useSelector((state) => state.userAuth);
    const { status, account, } = useSelector((state) => state.userWallet);

    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = React.useState(false);
    const [crateInfo, setCrateInfo] = useState(null); 
    const [purchasedTokens, setPurchasedTokens] = useState(null);
    const [pageStatus, setPageStatus] = useState(0);
    const [ownerAddress, setOwnerAddress] = React.useState('');

    const umblCoreContract = useUmblCoreContract();
    const umblMarketContract = useUmblMarketPlaceContract();
    const busdContract = useBusdContract();

    useEffect(() => {
        if(isAdmin && isAuthenticated) {
            history.push('/admin');
            return;
        } else if(!isAuthenticated) {
            dispatch(LogoutAction(history));
            return;
        } 
    }, [isAdmin, isAuthenticated]);

    useEffect(() => {
        GetCrateInfoService(crateId).then(res => {
            if(res.hasOwnProperty('success') && res.success === true) {
                setCrateInfo(res.crate);
            } else {
                if(res.hasOwnProperty('error') && res.error === 'token') {
                    dispatch(LogoutAction(history));
                }
                history.push('/crates');
            }            
        }).catch(err => {
            console.log('Error => ' + err);
            history.push('/crates');
        })
    }, [crateId]);

    const handleGoBack = () => {
        history.push('/crates');
    };

    // sweet alert functions
    const hideAlert = () => {
        setAlert(null);
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
            customClass="blackMsg"
          >
            {message}
          </SweetAlert>
        );
    };   
    
    const handleBuyWithBusd = async () => {
        let errMsg;

        if(!status || !account) {
            showErrorMsg('Please connect with metamask');
            return;
        } else {
            // check contract status
            if (!umblMarketContract || !umblCoreContract || !busdContract) {
                return;
            }

            // start loading
            setLoading(true);

            // get crate information
            const crateInfo = await umblCoreContract.methods
                .crateUmblData(parseInt(crateId))
                .call({ from: account });
            
            // approve busd payment            
            const approveResult = await busdContract.methods
                .approve(process.env.MIX_UMBL_MARKET_ADDRESS, crateInfo.price)
                .send({ from: account }, (error, transactionHash) => {
                    if(transactionHash === undefined) {
                        setLoading(false);
                        return;
                    } else {
                        console.log(transactionHash);
                    }
                });

            // check allowance of BUSD payment
            const allowanceResult = await busdContract.methods
                .allowance(account, process.env.MIX_UMBL_MARKET_ADDRESS)
                .call({ from: account });

            if(allowanceResult !== crateInfo.price) {
                setLoading(false);
                showErrorMsg('You must approve BUSD payment.');
                return;
            }

            // get total token count
            const totalSupply = await umblCoreContract.methods
                .nextTokenId()
                .call({ from: account });

            // run marketplace contract function for buying crate
            const transaction = await umblMarketContract.methods
                .buyCrate(parseInt(crateId))
                .send({ from: account }, (error, transactionHash) => {
                    if(transactionHash === undefined) {
                        setLoading(false);
                        return;
                    } else {
                        console.log(transactionHash);
                    }
                });

            console.log(transaction);

            // check transaction event
            const returnValues = transaction.events.UmblPresetMinted.returnValues;
            if(returnValues.to[0].toLowerCase() !== account.toLowerCase()) {
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

            if(returnValues.to[0].toLowerCase() !== account.toLowerCase()) {
                setLoading(false);
                errMsg = "Smart Contract Error! Transaction history is not correct.";
                showErrorMsg(errMsg);
                return;
            }

            let approvedTokens = [];

            for(let i=0; i<returnValues.tokenIds.length; i++) {
                const tokenId = returnValues.tokenIds[i];

                const tokenURI = await umblCoreContract.methods
                    .uri(parseInt(tokenId))
                    .call({ from: account });

                let response = await fetch(tokenURI);
                let responseJson = await response.json();

                approvedTokens.push({
                    id: tokenId,
                    name: responseJson.name,
                    image: responseJson.image
                });
            }

            setPurchasedTokens(approvedTokens);
            setPageStatus(1);

            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setPageStatus(0);
        setPurchasedTokens(null);
    }

    const handleGotoInventory = () => {
        history.push('/inventory');
    }

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
        }
        checkAccunt();
      }, [account]);

    return(
        <div className="crate-item-block">
            <div className="block-body">
                <div className="block-header">
                    <div className="header-left">
                        <div className="top-type">
                            <div className="top-category">Category:</div>
                            <div className="top-typeval">Survivor</div>
                        </div>
                        <div className="bottom-type">
                            <p>Each crate contains <span className="red-text">Four</span> objects</p>
                        </div>
                    </div>
                    <div className="header-center">
                        <div className="crate-type">
                            <div className="crate-level">Basic</div>
                            <div className="white-title">Crate</div>
                        </div>
                        <div className="crate-rarities">
                            <div className="crate-rarity">Common</div>
                            <div className="crate-rarity-divider">/</div>
                            <div className="crate-rarity">Uncommon</div>
                        </div>
                    </div>
                    <div className="header-right">
                        <Button color="auth" size="lgAuth" className="crate-btn" onClick={handleGoBack}>GO BACK</Button>
                    </div>
                </div>
                <div className="block-main">
                    { crateInfo ? crateInfo.v360 ? (
                    <React360Viewer
                        amount={72}
                        imagePath={process.env.MIX_UMBL_CLOUDIMAGE_URI + 'crates/' + crateInfo.v360 + '/xxxx?func=crop&width=960&height=540'}
                        fileName="{index}.png"
                        spinReverse
                        autoplay
                        loop
                        buttonClass="dark"
                    />) : null : null }
                </div>
                <div className="block-footer">
                    <Button color="auth" size="lgAuth" className="crate-btn" onClick={handleBuyWithBusd}>BUY WITH BUSD</Button>
                </div>
                { pageStatus === 1 && purchasedTokens.length ? (
                <div className="block-popup">
                    <div className="popup-header">
                        You have been earned the following objects:
                    </div>
                    <div className="popup-body">
                        {purchasedTokens.map((prop, key) => {
                            return (
                            <div className="token-item" key={key}>
                                <div className="token-item-img">
                                    <img src={prop.image} />
                                </div>
                                <div className="token-item-name">
                                    {prop.name}
                                </div>
                            </div>
                            );
                        })}
                        
                    </div>
                    <div className="popup-footer">
                        <Button color="auth" size="lgAuth" className="crate-btn" onClick={handleRefresh}>GO BACK</Button>
                        <Button color="auth" size="lgAuth" className="crate-btn" onClick={handleGotoInventory}>GO TO INVENTORY</Button>
                    </div>
                </div>) : null }
            </div>
            <Backdrop className="backdrop" open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            { alert }
        </div>
    );
};