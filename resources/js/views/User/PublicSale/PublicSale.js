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

import warningBanner from "@/assets/img/banners/umbrella-private-pause-banner.jpg";

import notebookIcon from "@/assets/img/icons/notebook.png";
import copyIcon from "@/assets/img/icons/copy.png";
import refreshIcon from "@/assets/img/icons/refresh.png";
import walletIcon from "@/assets/img/icons/wallet.png";

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import backImage1 from "@/assets/img/publicsale/bg_mansion_1.png";
import backImage2 from "@/assets/img/publicsale/bg_mansion_2.png";
import backImage3 from "@/assets/img/publicsale/gold_background_lines.png";
import publicSaleHeaderIcon from "@/assets/img/publicsale/umbrella_solo.png";
import bottomImage from "@/assets/img/publicsale/firulete.png";

// styles
import { makeStyles } from "@material-ui/core/styles";
// import styles from "@/assets/jss/material-dashboard-pro-react/views/homePageStyle.js";
import styles from "@/assets/jss/material-dashboard-pro-react/views/commonPageStyle.js";

const useStyles = makeStyles(styles);

import { useUmblPublicSaleContract, useBusdContract } from "@/hooks";
import { LogoutAction, } from '@/redux/actions/AuthActions';
import { GetUserReferrer } from '@/services/UserServices';

export default function PublicSale() {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();

    const publicSaleContractAddress = process.env.MIX_UMBL_PUBLIC_ADDRESS;
    const umblPublicSaleContract = useUmblPublicSaleContract();
    const busdContract = useBusdContract();

    const prefix = '$(BUSD)';
    const [screenSize, getDimension] = useState({
        dynamicWidth: window.innerWidth,
        dynamicHeight: window.innerHeight
    });

    const setDimension = () => {
        getDimension({
          dynamicWidth: window.innerWidth,
          dynamicHeight: window.innerHeight
        })
    }

    useEffect(() => {
        window.addEventListener('resize', setDimension);
        
        return(() => {
            window.removeEventListener('resize', setDimension);
        })
    }, [screenSize])  

    const [loading, setLoading] = useState(false);  
    const [alert, setAlert] = useState(null);
    const [accountError, setAccountError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [className, setClassName] = useState('');
    const [value, setValue] = useState(null);
    const [softCap, setSoftCap] = useState(50);
    const [remainingLimit, setRemainingLimit] = useState(0);
    const [exRate, setExRate] = useState(1);
    const [reExRate, setReExRate] = useState(1);
    const [publicProgress, setpublicProgress] = useState(0);
    const [initialTime, setInitialTime] = useState(0);
    const [startTimer, setStartTimer] = useState(false);
    const [userBalance, setUserBalance] = useState(0);
    const [referrerAddress, setReferrerAddress] = useState('0x0000000000000000000000000000000000000000');

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
        if (!umblPublicSaleContract) return;

        setLoading(true);

        GetUserReferrer().then(res => {
            if(res.hasOwnProperty('success') && res.success === true) {
                // console.log(res.referrer.address);
                setReferrerAddress(res.referrer.address);
            }
        }).catch(error => {
            console.log(error);
        })

        const fundingGoal = await umblPublicSaleContract.methods
            .fundingGoal()
            .call();

        console.log('fundingGoal => ' + fundingGoal.toString());

        const busdRaised = await umblPublicSaleContract.methods
            .busdRaised()
            .call();

        console.log('busdRaised => ' + busdRaised.toString());

        const tokensRaised = await umblPublicSaleContract.methods
            .tokensRaised()
            .call();

        console.log('tokensRaised => ' + tokensRaised.toString());

        console.log('Progress => ' + (tokensRaised / fundingGoal).toString());

        // setpublicProgress(Math.floor((100.0 * tokensRaised) / fundingGoal));
        setpublicProgress(Math.trunc((10000.0 * tokensRaised) / fundingGoal) / 100);
        // setpublicProgress(Math.trunc(0.00 * 100) / 100);

        const tokenPrice = await umblPublicSaleContract.methods
            .tokenPrice()
            .call();

        console.log('tokenPrice => ' + tokenPrice.toString());  

        setExRate(Math.trunc(window.web3.utils.fromWei(tokenPrice, 'ether') * 100) / 100);
        setReExRate(1.0 / window.web3.utils.fromWei(tokenPrice, 'ether'));
        
        var remainingWei = (fundingGoal - tokensRaised) / window.web3.utils.fromWei(tokenPrice, 'ether');
        setRemainingLimit(Math.floor(window.web3.utils.fromWei(remainingWei.toString(16), 'ether')));

        const softCapVal = await umblPublicSaleContract.methods
            .softCap()
            .call();

        console.log('softCapVal => ' + softCapVal.toString()); 
        setSoftCap(window.web3.utils.fromWei(softCapVal.toString(16), 'ether'));

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
        return publicSaleContractAddress.substring(0, 18);
    }

    const copyContractAddr = () => {
        // console.log(publicSaleContractAddress);
        navigator.clipboard.writeText(publicSaleContractAddress);
    }

    const handleOnValueChange = (newValue) => {
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

        // approve busd payment            
        const approveResult = await busdContract.methods
            .approve(process.env.MIX_UMBL_PUBLIC_ADDRESS, amount)
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
            .allowance(account, process.env.MIX_UMBL_PUBLIC_ADDRESS)
            .call({ from: account });

        // console.log('allowanceResult => ' + allowanceResult);

        if(allowanceResult !== amount) {
            setLoading(false);
            showErrorMsg('You must approve BUSD payment.');
            return;
        }

        const transaction = await umblPublicSaleContract.methods
            .buy(amount, referrerAddress.toString())
            .send({ from: account }, (error, transactionHash) => {
                if(transactionHash === undefined) {
                    setLoading(false);
                    return;
                } else {
                    // console.log(transactionHash);
                }
            });

        // console.log(transaction);        

        setLoading(false);

        showSuccessMsg('You purchased tokens succesfully! Please check your wallet');
    }

    const getBackImg = () => {
        if(screenSize.dynamicWidth > 1200) 
            return backImage2;
        else
            return backImage1;
    }

    return(
        <div 
            className={classes.publicSaleContainer} 
            style={{ backgroundImage: "url(" + getBackImg() + ")", padding: "0" }}
        >
            <div className={classes.container} style={{ padding: "0" }}>               
                <GridContainer justifyContent="center" style={{ padding: "0" }}>
                    <GridItem xs={12} sm={12} md={12} className="gridItem">
                        <Card style={{ padding: "0", background: "transparent" }}>
                            <CardBody style={{ padding: "0" }}>
                                <div 
                                    className={classes.publicSaleContainer} 
                                    style={{ backgroundImage: "url(" + backImage3 + ")" }}>
                                    <div className="public-sale-block">
                                        <div className="public-header">
                                            <div className="public-header-icon">
                                                <img src={publicSaleHeaderIcon} alt="Umbrellaproject" />
                                            </div>
                                            <div className="public-header-title">
                                                Public Sale Pool
                                            </div>
                                        </div>
                                        <div className="public-blockline"></div>
                                        <div className="public-content">
                                            <div className="public-content-flex">
                                                <img src={notebookIcon} style={{marginRight: "20px"}} />
                                                <div className="public-contract">
                                                    { 'public Contract: ' + getContractAddress()}
                                                </div>
                                                <img src={copyIcon} className="copy-action" style={{marginLeft: "20px", cursor: "pointer"}} onClick={copyContractAddr} />
                                            </div>
                                            <div className="public-content-flex-space" style={{marginTop: "10px"}}>
                                                <div>
                                                    <div style={{marginBottom: "10px"}}>Remaining Limit: </div>
                                                    <div className="yellow-text">{remainingLimit.toLocaleString()} BUSD</div>
                                                </div>
                                                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                                    <div style={{display: "flex", alignItems: "center"}}>
                                                        <img src={refreshIcon} />
                                                        <div>Exchange Proportion: </div>
                                                    </div>
                                                    <div>1 BUSD = {exRate} UMBL ({reExRate} BUSD Per Token)</div>
                                                </div>
                                            </div>
                                        </div> 
                                        <div className="public-blockline"></div>   
                                        { account && status ? (
                                        <div className="public-content public-content-right">
                                            <div className="public-content-flex" style={{marginBottom: "10px"}}>
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
                                        <div style={{textAlign: "center"}}>
                                            <CurrencyInput
                                                id="validationCustom01"
                                                name="input-1"
                                                className={`public-exchange-control ${className}`}
                                                value={value}
                                                onValueChange={handleOnValueChange}
                                                placeholder="Please enter the exchange quantity"
                                                prefix={prefix}
                                                step={1}
                                            />
                                            <div className="invalid-feedback">{errorMessage}</div>
                                            { account && status ? (
                                            <Button className="public-buy-btn" color="auth" size="lgAuth" 
                                                style={{padding: "12px 80px", fontSize:"1rem", fontFamily: "'Michroma'", fontWeight: "bold", marginTop: "10px"}} 
                                                onClick={handleBuy}>Buy</Button>
                                            ) : (
                                            <div className="warning-wallet">Please connect MetaMask to buy UMBL</div>    
                                            )}
                                        </div>    
                                        <div className="public-blockline"></div>
                                        <div className="public-content" style={{marginTop:"10px"}}>
                                            <div className="public-content-flex public-infection">
                                                <div>Infection:</div>
                                                <div className="red-text">
                                                    In Progress
                                                </div>
                                            </div>
                                            <div style={{padding: "0px 40px", marginTop:"10px", textAlign: "center"}}>
                                                <ProgressBar 
                                                    completed={publicProgress} 
                                                    bgColor="#C4CE2F"
                                                    borderRadius="10px"
                                                    height="50px"
                                                    labelSize="14px"
                                                    className="prog-wrapper"
                                                    // barContainerClassName="prog-container"
                                                    // completedClassName="prog-barCompleted"
                                                    labelClassName="prog-label"
                                                />
                                            </div>
                                            <div className="public-bottom-block">
                                                <div className="public-bottom-img">
                                                    <img src={bottomImage} alt="Umbrellaproject" />
                                                </div>
                                                <div className="public-blockline"></div>
                                            </div>
                                            <div className="public-content-flex" style={{padding: "0px 40px", margin: "20px 0px"}}>
                                                <div>Public Sale Token Supply:</div>
                                                <div>340,000,000 UMBL</div>
                                            </div> 
                                        </div> 
                                    </div>                                    
                                </div>  
                                <div className="public-sale-desc">
                                        <div className="public-sale-desc-title">
                                            How to Earn Referral System Bonus?
                                        </div>
                                        <div className="public-sale-desc-content">
                                            <p>
                                                1. Go to your profile section. <br/>
                                                2. Click on 'Referrals' and share your code with your friends.<br/>
                                                3. Receive 10% of each referral's token purchase instantly
                                            </p>
                                        </div>
                                </div>                              
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
                { alert }
                <Backdrop className={classes.backdrop} open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        </div>
    );
};