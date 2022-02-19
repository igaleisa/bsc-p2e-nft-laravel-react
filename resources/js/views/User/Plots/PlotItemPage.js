import React, { useState, useEffect, } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

// import ReactPlayer from 'react-player'
import ReactPlayer from 'react-player/lazy'

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

import { 
    GetPlotInfoService, 
    AddBatchTokenList, 
    RegisterPresetPayment, 
} from '@/services/UserServices';

// contract
import { useUmblCoreContract, useUmblMarketPlaceContract, useBusdContract, useZapbContract } from "@/hooks";

export default function CityPlotItemPage() {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const { plotId } = useParams();

    const { isAuthenticated, isAdmin, } = useSelector((state) => state.userAuth);
    const { status, account, } = useSelector((state) => state.userWallet);

    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = React.useState(false);
    const [plotInfo, setPlotInfo] = useState(null); 
    const [purchasedTokens, setPurchasedTokens] = useState(null);
    const [pageStatus, setPageStatus] = useState(0);
    const [ownerAddress, setOwnerAddress] = React.useState('');
    const [isPresaleStarted, setIsPresaleStarted] = useState(false);

    const umblCoreContract = useUmblCoreContract();
    const umblMarketContract = useUmblMarketPlaceContract();
    const busdContract = useBusdContract();
    const zapbContract = useZapbContract();

    useEffect(() => {
        if(isAdmin && isAuthenticated) {
            history.push('/admin');
            return;
        } else if(!isAuthenticated) {
            dispatch(LogoutAction(history));
            return;
        } 
    }, [isAdmin, isAuthenticated]);

    useEffect(async () => {
        if(plotId > 0) {
            // check contract status
            if (!umblMarketContract || !umblCoreContract || !busdContract) {
                console.log('contract issue!');
                return;
            }

            // check plot presale is started or not
            const isPresaleStartedFlag = await umblMarketContract.methods
                .isPlotPresaleStarted()
                .call({ from: account });

            if(isPresaleStartedFlag) {
                setIsPresaleStarted(true);
            }

            await GetPlotInfoService(plotId).then(res => {                
                if(res.hasOwnProperty('success') && res.success === true) {
                    setPlotInfo(res.plot);
                } else {
                    if(res.hasOwnProperty('error') && res.error === 'token') {
                        dispatch(LogoutAction(history));
                    }
                    history.push('/plots');
                }            
            }).catch(err => {
                console.log('Error => ' + err);
                history.push('/plots');
            })
        }
    }, [plotId]);

    const handleGoBack = () => {
        history.push('/plots');
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
    
    const buyPlot = async (plotPresetId) => {
        // run marketplace contract function for buying city plot
        const transaction = await umblMarketContract.methods
            .buyCityPlot(parseInt(plotPresetId))
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

        const numbericalPrice = window.web3.utils.fromWei(transaction.events.UmblPaidForCrate.returnValues.price, 'ether');

        let userPaymentData = {
            presetId: plotPresetId,
            price: numbericalPrice,
            unit: 'BUSD',
            wallet: account.toLowerCase()
        };

        await RegisterPresetPayment(userPaymentData).then(res => {
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

        let registerData = {
            owner: ownerAddress,
            to: returnValues.to,
            presetIds: returnValues.presetIds,
            tokenIds: returnValues.tokenIds,
            amounts: returnValues.amount,
        };

        await AddBatchTokenList(registerData).then((res) => {
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

        console.log(approvedTokens);

        setLoading(false);

        setPurchasedTokens(approvedTokens);
        setPageStatus(1);        
    }
    
    const handleBuyWithBusd = async () => {
        let errMsg;

        if(!status || !account) {
            showErrorMsg('Please connect with metamask');
            return;
        } else {
            console.log(plotInfo);

            // check preset id
            if (!plotInfo.preset_id) {
                console.log('Invalid preset ID!');
                return;
            }

            // check contract status
            if (!umblMarketContract || !umblCoreContract || !busdContract) {
                console.log('contract issue!');
                return;
            }
            // start loading
            setLoading(true);

            // check plot presale is started or not
            const isPresaleStartedFlag = await umblMarketContract.methods
                .isPlotPresaleStarted()
                .call({ from: account });

            if(!isPresaleStarted) {
                setLoading(false);
                showErrorMsg('City Plot Presale is not started yet!');
                return;
            }

            // get plot information
            const plotData = await umblCoreContract.methods
                .presetUmblData(parseInt(plotInfo.preset_id))
                .call({ from: account });

            console.log(plotData);
            
            // approve busd payment            
            const approveResult = await busdContract.methods
                .approve(process.env.MIX_UMBL_MARKET_ADDRESS, plotData.price)
                .send({ from: account }, (error, transactionHash) => {
                    if(transactionHash === undefined) {
                        setLoading(false);
                        return;
                    } else {
                        // console.log(transactionHash);
                    }
                });

            // check allowance of BUSD payment
            const allowanceResult = await busdContract.methods
                .allowance(account, process.env.MIX_UMBL_MARKET_ADDRESS)
                .call({ from: account });

            if(allowanceResult !== plotData.price) {
                setLoading(false);
                showErrorMsg('You must approve BUSD payment.');
                return;
            }

            // get total token count
            const totalSupply = await umblCoreContract.methods
                .nextTokenId()
                .call({ from: account });

            await buyPlot(parseInt(plotData.id));

            setLoading(false);
            return;            
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
        <div className="plot-item-block">
            <div className="block-body">
                <div className="block-header">
                    <div className="header-left">
                        <div className="top-type">
                            <div className="top-category">Category:</div>
                            <div className="top-typeval">
                                <span className={ plotInfo ? plotInfo.faction.name === 'Survivors' ? 'survivors-faction' : 'scientists-faction' : '' }>
                                    { plotInfo ? plotInfo.faction.name ? plotInfo.faction.name : '' : '' }
                                </span>
                            </div>
                        </div>
                        <div className="bottom-type">
                            <p>Type: <span className="red-text">{plotInfo ? plotInfo.zonetype ? plotInfo.zonetype.name : '' : ''}</span></p>
                        </div>
                    </div>
                    <div className="header-center">
                        <div className="plot-type">
                            { plotInfo ? plotInfo.name ? plotInfo.name.includes(' ') ? (
                                <div style={{display: "flex"}}>
                                    <div className="plot-level">{ plotInfo.name.split(' ')[0] } </div>
                                    <div className="white-title">{ plotInfo.name.split(' ')[1] } </div>
                                    <div className="white-title">{ plotInfo.name.split(' ')[2] } </div>
                                </div>
                            ) : 
                            (
                                <div className="plot-level">
                                    {plotInfo.name}
                                </div>
                            ) : null : null }
                        </div>
                    </div>
                    <div className="header-right">
                        <Button color="auth" size="lgAuth" className="plot-btn" onClick={handleGoBack}>GO BACK</Button>
                    </div>
                </div>
                <div className="block-main" style={{ display: "flex", justifyContent: "center", backgroundColor: "black"}} >
                    { plotInfo ? plotInfo.v360 ? (
                    <ReactPlayer 
                        url={process.env.MIX_UMBL_STORAGE_URI + 'plots/' + plotInfo.v360}
                        playing={true} 
                        loop={true} 
                        width='100%'
                        height='100%'/>
                    ) : null : null }
                </div>
                <div className="block-footer">
                    { isPresaleStarted ? (
                    <Button color="auth" size="lgAuth" className="plot-btn" onClick={handleBuyWithBusd}>
                        { plotInfo ? plotInfo.price ? 'BUY WITH BUSD (' + plotInfo.price + ')' : 'BUY WITH BUSD' : 'BUY WITH BUSD' }                        
                    </Button>
                    ) : (
                    <Button color="auth" size="lgAuth" className="plot-btn">
                        COMING SOON
                    </Button>
                    )}
                </div>
                { pageStatus === 1 && purchasedTokens.length ? (
                <div className="block-popup">
                    <div className="popup-header">
                        You have been earned the following objects:
                    </div>
                    <div className="popup-body plot-popup-body">
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
                        <Button color="auth" size="lgAuth" className="plot-btn" onClick={handleRefresh}>GO BACK</Button>
                        <Button color="auth" size="lgAuth" className="plot-btn" onClick={handleGotoInventory}>GO TO INVENTORY</Button>
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