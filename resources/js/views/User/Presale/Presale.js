import React, { useState, useEffect, } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import CurrencyInput from 'react-currency-input-field';
import ProgressBar from "@ramonak/react-progress-bar";

// core components
import GridContainer from "@/components/Grid/GridContainer.js";
import GridItem from "@/components/Grid/GridItem.js";
import Card from "@/components/Card/Card.js";
import CardBody from "@/components/Card/CardBody.js";

import SweetAlert from "react-bootstrap-sweetalert";
import Button from "@/components/CustomButtons/Button.js";

import principalBanner from "@/assets/img/banners/umbl_presale.jpg";
import presaleHeaderIcon from "@/assets/img/umbl_icon.png";
import notebookIcon from "@/assets/img/icons/notebook.png";
import copyIcon from "@/assets/img/icons/copy.png";
import refreshIcon from "@/assets/img/icons/refresh.png";
import walletIcon from "@/assets/img/icons/wallet.png";

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';


// styles
import { makeStyles } from "@material-ui/core/styles";
// import styles from "@/assets/jss/material-dashboard-pro-react/views/homePageStyle.js";
import styles from "@/assets/jss/material-dashboard-pro-react/views/commonPageStyle.js";

const useStyles = makeStyles(styles);

import { useUmblPresaleContract, useBusdContract } from "@/hooks";
import { LogoutAction, } from '@/redux/actions/AuthActions';

export default function PresalePage() {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();

    const presaleContractAddress = process.env.MIX_UMBL_PRESALE_ADDRESS; //'0x91e7BB4FAa5A18b95A7091afac09defBEF14DA43';
    const umblPresaleContract = useUmblPresaleContract();
    const busdContract = useBusdContract();

    const prefix = '$(BUSD)';

    const [loading, setLoading] = useState(false);  
    const [presaleStatus, setPresaleStatus] = useState(null);
    const [alert, setAlert] = useState(null);
    const [accountError, setAccountError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [className, setClassName] = useState('');
    const [value, setValue] = useState(null);
    const [softCap, setSoftCap] = useState(50);
    const [hardCap, setHardCap] = useState(100);
    const [remainingLimit, setRemainingLimit] = useState(0);
    const [exRate, setExRate] = useState(1);
    const [reExRate, setReExRate] = useState(1);
    const [presaleProgress, setPresaleProgress] = useState(0);
    const [initialTime, setInitialTime] = useState(0);
    const [startTimer, setStartTimer] = useState(false);
    const [isPresaleStarted, setIsPresaleStarted] = useState(false);
    const [userBalance, setUserBalance] = useState(0);

    const { isAuthenticated, isAdmin, } = useSelector((state) => state.userAuth);
    const { status, account, } = useSelector((state) => state.userWallet);
    
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
        if (!umblPresaleContract) return;

        setLoading(true);

        const isPresaleStartedVal = await umblPresaleContract.methods
            .isPresaleStarted()
            .call();

        console.log('isPresaleStartedVal => ' + isPresaleStartedVal);

        setIsPresaleStarted(isPresaleStartedVal);
        
        const isPresaleEndedVal = await umblPresaleContract.methods
            .isPresaleEnded()
            .call();

        console.log('isPresaleEndedVal => ' + isPresaleEndedVal);

        if(isPresaleStartedVal || isPresaleEndedVal) {
            console.log('pageStatus => 1');
            setPresaleStatus(1);
        } else {
            console.log('pageStatus => 0');
            setPresaleStatus(0);
        }

        if(isPresaleStartedVal) {
            const presaleEndTime = await umblPresaleContract.methods
                .presaleEndTime()
                .call();
            const remainingTime = presaleEndTime - Math.floor((Date.now() / 1000));

            setInitialTime(remainingTime);
            setStartTimer(true);
        }

        const fundingGoal = await umblPresaleContract.methods
            .fundingGoal()
            .call();

        const busdRaised = await umblPresaleContract.methods
            .busdRaised()
            .call();

        const tokensRaised = await umblPresaleContract.methods
            .tokensRaised()
            .call();

        setPresaleProgress(Math.floor((100.0 * tokensRaised) / fundingGoal));

        console.log((100.0 * tokensRaised) / fundingGoal);

        const tokenPrice = await umblPresaleContract.methods
            .tokenPrice()
            .call();

        setExRate(window.web3.utils.fromWei(tokenPrice, 'ether'));
        setReExRate(1.0 / window.web3.utils.fromWei(tokenPrice, 'ether'));
        
        var remainingWei = (fundingGoal - tokensRaised) / window.web3.utils.fromWei(tokenPrice, 'ether');
        setRemainingLimit(Math.floor(window.web3.utils.fromWei(remainingWei.toString(16), 'ether')));

        const softCapVal = await umblPresaleContract.methods
            .softCap()
            .call();

        setSoftCap(window.web3.utils.fromWei(softCapVal.toString(16), 'ether'));
        const hardCapVal = await umblPresaleContract.methods
            .hardCap()
            .call();

        setHardCap(window.web3.utils.fromWei(hardCapVal.toString(16), 'ether'));  
        setLoading(false);

    }, []);

    useEffect(() => {
        if(accountError) {
            setAlert(
                <SweetAlert
                  closeOnClickOutside={false}
                  style={{ display: "block", marginTop: "-100px" }}
                  title="ERROR"
                  onConfirm={() => hideAlert()}
                  onCancel={() => hideAlert()}
                  confirmBtnCssClass={classes.button + " " + classes.info}
                  customClass="blackMsg"
                >
                    Please connect metamask
                </SweetAlert>
              );
        }
    }, [accountError])
    
    const hideAlert = () => {
        setAlert(null);
    };

    const hideAlertRefresh = () => {
        setAlert(null);
        window.location.reload();
    };
    
    const showSuccessMsg = (message) => {
        setAlert(
            <SweetAlert
              closeOnClickOutside={false}
              style={{ display: "block", marginTop: "-100px" }}
              title="Success!"
              onConfirm={() => hideAlertRefresh()}
              onCancel={() => hideAlertRefresh()}
              confirmBtnCssClass={classes.button + " " + classes.info}
              customClass="blackMsg"
            >
              {message}
            </SweetAlert>
        );
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

    const getContractAddress = () => {
        return presaleContractAddress.substring(0, 18);
    }

    const copyContractAddr = () => {
        console.log(presaleContractAddress);
        navigator.clipboard.writeText(presaleContractAddress);
    }

    const handleOnValueChange = (newValue) => {
        // setRawValue(newValue === undefined ? 'undefined' : newValue || ' ');

        if (!newValue) {
            setClassName('');
            setValue('');
            return;
        }

        if (Number.isNaN(Number(newValue))) {
            setErrorMessage('Please enter a valid number');
            setClassName('is-invalid');
            return;
        }

        if (Number(newValue) > hardCap) {
            setErrorMessage(`Max: ${prefix} ${hardCap}`);
            setClassName('is-invalid');
            setValue(newValue);
            return;
        }

        if (Number(newValue) < softCap) {
            setErrorMessage(`Min: ${prefix} ${softCap}`);
            setClassName('is-invalid');
            setValue(newValue);
            return;
        }

        if(account && status && userBalance) {
            if (Number(newValue) > userBalance) {
                setErrorMessage(`No Enough Balance: ${prefix} ${userBalance}`);
                setClassName('is-invalid');
                setValue(newValue);
                return;
            }
        }

        setErrorMessage('');
        setClassName('is-valid');
        setValue(newValue);
    };

    useEffect(() => {
        if (initialTime > 0) {
          setTimeout(() => {
            setInitialTime(initialTime - 1);
          }, 1000);
        }
    
        if (initialTime === 0 && startTimer) {
          setStartTimer(false);
        }
    }, [initialTime, startTimer]);

    useEffect(async () => {
        if(status && account) {
            if(!busdContract) return;

            const userBalance = await busdContract.methods
                .balanceOf(account)
                .call();
            
            setUserBalance(window.web3.utils.fromWei(userBalance, 'ether'));
        }
    }, [status, account]);

    const pad = (d) => {
        return (d < 10) ? '0' + d.toString() : d.toString();
    }

    const handleBuy = async () => {
        if(className !== 'is-valid') return;

        if(!status || !account) return;

        // start loading
        setLoading(true);

        const amount = window.web3.utils.toWei(value.toString(), "Ether");

        console.log('amount => ' + amount);

        // approve busd payment            
        const approveResult = await busdContract.methods
            .approve(process.env.MIX_UMBL_PRESALE_ADDRESS, amount)
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
            .allowance(account, process.env.MIX_UMBL_PRESALE_ADDRESS)
            .call({ from: account });

        console.log('allowanceResult => ' + allowanceResult);

        if(allowanceResult !== amount) {
            setLoading(false);
            showErrorMsg('You must approve BUSD payment.');
            return;
        }

        const transaction = await umblPresaleContract.methods
            .buy(amount)
            .send({ from: account }, (error, transactionHash) => {
                if(transactionHash === undefined) {
                    setLoading(false);
                    return;
                } else {
                    console.log(transactionHash);
                }
            });

        console.log(transaction);

        setLoading(false);

        showSuccessMsg('You purchased tokens succesfully! Please check your wallet');
    }

    return(
        <div className={classes.container}> 
            { presaleStatus === 0 ? (                           
                <GridContainer justifyContent="center">
                    <GridItem xs={12} sm={12} md={12}>
                        <Card main>
                            <CardBody border>
                                <div className={classes.presaleBanner}>
                                </div>              
                                <div
                                    className={classes.fullBackImage}
                                    style={{ backgroundImage: "url(" + principalBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}
                                />
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>                
            ) : presaleStatus === 1 ? (                
                <GridContainer justifyContent="center">
                    <GridItem xs={12} sm={12} md={1}></GridItem>
                    <GridItem xs={12} sm={12} md={10}>
                        <Card main>
                            <CardBody border>
                                <div className="presale-block">
                                    <div className="presale-header">
                                        <div className="presale-header-icon">
                                            <img src={presaleHeaderIcon} alt="Umbrellaproject" />
                                        </div>
                                        <div className="presale-header-title">
                                            Umbrella Project
                                        </div>
                                        <div className="presale-header-subtitle">
                                            Private Sale Pool
                                        </div>
                                    </div>
                                    <div className="presale-blockline"></div>
                                    <div className="presale-content">
                                        <div className="presale-content-flex">
                                            <img src={notebookIcon} style={{marginRight: "20px"}} />
                                            <div className="presale-contract">
                                                { 'Presale Contract: ' + getContractAddress()}
                                            </div>
                                            <img src={copyIcon}  style={{marginLeft: "20px"}} onClick={copyContractAddr} />
                                        </div>
                                        <div className="presale-content-flex-space">
                                            <div>
                                                <div style={{marginBottom: "10px"}}>Remaining Limit: </div>
                                                <div className="red-bold-text">{remainingLimit.toLocaleString()} BUSD</div>
                                            </div>
                                            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                                <div style={{display: "flex", alignItems: "center", marginBottom: "10px"}}>
                                                    <img src={refreshIcon} />
                                                    <div>Exchange Proportion: </div>
                                                </div>
                                                <div>1 BUSD = {exRate} UMBL ({reExRate} BUSD Per Token)</div>
                                            </div>
                                        </div>
                                    </div> 
                                    <div className="presale-blockline"></div>   
                                    { account && status ? (
                                    <div className="presale-content presale-content-right">
                                        <div className="presale-content-flex">
                                            <img src={walletIcon} />
                                            <div>
                                                User Wallet Balance: 
                                            </div>
                                            <div className="red-text">
                                                {userBalance} BUSD
                                            </div>
                                        </div>
                                    </div>
                                    ) : null}
                                    <div style={{textAlign: "center", margin: "20px"}}>
                                        <CurrencyInput
                                            id="validationCustom01"
                                            name="input-1"
                                            className={`exchange-control ${className}`}
                                            value={value}
                                            onValueChange={handleOnValueChange}
                                            placeholder="Please enter the exchange quantity"
                                            prefix={prefix}
                                            step={1}
                                        />
                                        <div className="invalid-feedback">{errorMessage}</div>
                                        { account && status ? (
                                        <Button color="auth" size="lgAuth" 
                                            style={{padding: "12px 80px", fontSize:"1rem", fontFamily: "'Michroma'", fontWeight: "bold", marginTop: "10px"}} 
                                            onClick={handleBuy}>Buy</Button>
                                        ) : (
                                        <div className="warning-wallet">Please connect MetaMask to buy UMBL</div>    
                                        )}
                                    </div>    
                                    <div className="presale-blockline"></div>
                                    { isPresaleStarted ? (
                                    <div className="presale-content" style={{textAlign: "center"}}>
                                        <div>Presale ends in: </div>
                                        <div className="presale-end-datetime">
                                            {Math.floor(initialTime / 86400)} : {pad(Math.floor((initialTime % 86400) / 3600))} : {pad(Math.floor((initialTime % 3600) / 60))} : {pad(Math.floor(initialTime % 60))}
                                        </div>
                                    </div>    
                                    ) : (
                                    <div className="presale-content" style={{textAlign: "center"}}>
                                        <div>Presale completed!</div>
                                    </div>  
                                    )}
                                    <div className="presale-blockline"></div>
                                    <div className="presale-content">
                                        <div className="presale-content-flex">
                                            <div>Infection:</div>
                                            <div className="red-text">
                                                {isPresaleStarted ? 'In Progress' : 'Completed'}
                                            </div>
                                        </div>
                                        <div style={{padding: "20px 40px", textAlign: "center"}}>
                                            <ProgressBar 
                                                completed={presaleProgress} 
                                                bgColor="#E30614"
                                                height="50px"
                                                labelSize="14px"
                                            />
                                        </div>
                                        <div className="presale-content-flex">
                                            <div>Private Sale Token Supply:</div>
                                            <div>454,000,000 UMBL</div>
                                        </div>
                                    </div>  
                                </div>
                                
                            </CardBody>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={1}></GridItem>
                </GridContainer>
            ) : null }
            { alert }
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
};