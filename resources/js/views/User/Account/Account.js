import React, { useState, useEffect, } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

// @material-ui/core components
import Hidden from "@material-ui/core/Hidden";

// core components
import GridContainer from "@/components/Grid/GridContainer.js";
import GridItem from "@/components/Grid/GridItem.js";
import Button from "@/components/CustomButtons/Button.js";
import Card from "@/components/Card/Card.js";
import CardBody from "@/components/Card/CardBody.js";

// Icons
import armorIcon from "@/assets/img/icons/armorIcon.svg";

import SweetAlert from "react-bootstrap-sweetalert";

// styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "@/assets/jss/material-dashboard-pro-react/views/commonPageStyle.js";
const useStyles = makeStyles(styles);

// actions
import { LogoutAction, } from '@/redux/actions/AuthActions';
import { WalletDisconnectAction, } from '@/redux/actions/WalletActions';
import { GetUserAccountProfileService, GetTokenListService, } from '@/services/UserServices';

// contract
import { useUmblCoreContract } from "@/hooks";

export default function AccountPage() {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();

    const { isAuthenticated, isAdmin, } = useSelector((state) => state.userAuth);
    const { status, account, } = useSelector((state) => state.userWallet);

    const umblCoreContract = useUmblCoreContract();

    const [alert, setAlert] = React.useState(null);
    const [accountError, setAccountError] = React.useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [userUmblBalance, setUserUmblBalance] = useState(null);

    useEffect(() => {
        if(isAdmin && isAuthenticated) {
            history.push('/admin');
            return;
        } else if(!isAuthenticated) {
            dispatch(LogoutAction(history));
            return;
        } else {
            GetUserAccountProfileService().then(res => {
                if(res.hasOwnProperty('success') && res.success === true) {
                    setUserProfile(res.user);
                }
            })
        }
    }, [isAdmin, isAuthenticated]);   

    useEffect(async () => {
        if(status && account) {
            if (!umblCoreContract) {
                return;
            } 

            GetTokenListService({address: account.toLowerCase()})
            .then(res => {
                setUserUmblBalance(res.tokenList.length);              
            })
            .catch(err => {
                showErrorMsg(err);
                return;
            });
        } else {
            setAccountError(true);
        }
    }, [status, account]);

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
    
    const handleLogout = () => {
        dispatch(LogoutAction(history));
        dispatch(WalletDisconnectAction());
    }

    const handleGift = () => {

    }

    const hideAlert = () => {
        setAlert(null);
    };

    const handleReferralLinkCopy = () => {
        if(userProfile) {
            console.log(referral_link);
            navigator.clipboard.writeText(referral_link + userProfile.referral_link);
        }
    }

    const referral_link = process.env.MIX_APP_URL + '?referral=';
    const handleReferral = () => {
        setAlert(
            <SweetAlert
              closeOnClickOutside={false}
              style={{ display: "block", marginTop: "-100px" }}
              title="REFERRAL LINK"
              onConfirm={() => hideAlert()}
              onCancel={() => hideAlert()}
              confirmBtnCssClass={classes.button + " " + classes.info}
              customClass="blackMsg wideMsg"
            >
                <div className="referral_link_block">
                    <div className="referral_link_text">
                        { userProfile ? referral_link + userProfile.referral_link : null } 
                    </div>
                    <div className="referral_link_btn" onClick={handleReferralLinkCopy}>
                        <i className="far fa-copy"></i>
                    </div>
                </div>
            </SweetAlert>
          );
    }

    const handleRedeem = () => {

    }

    return(
        <div className={classes.container}> 
            <GridContainer justifyContent="flex-start">
                <GridItem xs={12} sm={12} md={12}>
                    <div className="account-navbar">
                        <div className="account-navbar-item active" onClick={() => {history.push('/account')}}>
                            <div className="account-navbar-item-icon">
                                <i className="far fa-address-card"></i>
                            </div>
                            <div className="account-navbar-item-text">
                                General
                            </div>
                        </div>
                        <div className="account-navbar-item" onClick={() => {history.push('/account/profile')}}>
                            <div className="account-navbar-item-icon">
                                <i className="fas fa-user"></i>
                            </div>
                            <Hidden smDown>
                                <div className="account-navbar-item-text">
                                    Profile
                                </div>
                            </Hidden>
                        </div>
                        <div className="account-navbar-item" onClick={() => {history.push('/account/security')}}>
                            <div className="account-navbar-item-icon">
                                <i className="fas fa-lock"></i>
                            </div>
                            <Hidden smDown>
                                <div className="account-navbar-item-text">
                                    Security
                                </div>
                            </Hidden>
                        </div>
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                    <div className="account-block">
                        <GridContainer justifyContent="flex-start">                            
                            <GridItem xs={12} sm={12} md={6}>
                                <div className="account-name-email">
                                    <div className="account-name-text">
                                        { userProfile ? userProfile.username : '' }
                                    </div>
                                    <div className="account-email-text">
                                        { userProfile ? userProfile.email : '' }
                                    </div>
                                </div>
                                { userProfile && !userProfile.tfa ? (
                                <div className="account-warning">
                                    <div className="account-warning-text">
                                        Warning: 2FA Not Set-Up!
                                    </div>
                                    <div className="account-warning-link">
                                        Click and setup 2FA to help secure your account
                                    </div>
                                </div>
                                ) : null }
                                { !accountError ? (
                                <div>
                                    <div className="account-attribute">
                                        <div className="account-attribute-title">
                                            Balances
                                        </div>
                                        <div className="account-attribute-content">
                                            <div className="account-attribute-item">
                                                <div className="account-attribute-key">Umbl</div>
                                                <div className="account-attribute-value">
                                                    { userUmblBalance ? userUmblBalance : 0 }
                                                </div>
                                            </div>
                                            <div className="account-attribute-item">
                                                <div className="account-attribute-key">Killer</div>
                                                <div className="account-attribute-value">0</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="account-attribute">
                                        <div className="account-attribute-title">
                                            Referrals and Gifting
                                        </div>
                                        <div className="account-attribute-content">
                                            <div className="account-attribute-item">
                                                <div className="account-attribute-key">Object Gifts</div>
                                                <div className="account-attribute-value">0</div>
                                            </div>
                                            <div className="account-attribute-item">
                                                <div className="account-attribute-key">Characters Gifts</div>
                                                <div className="account-attribute-value">0</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ) : null}
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6} className="account-actions-container">
                                <div className="account-actions-block">
                                    <div className="account-actions-title">Gifting, Referrals and Codes</div>
                                    <div className="account-actions-item">
                                        <Button color="auth" size="lgAuth" style={{marginRight: "10px"}} onClick={handleGift}>GIFTING</Button>
                                        <Button color="auth" size="lgAuth" style={{marginRight: "10px"}} onClick={handleReferral}>REFERRALS</Button>
                                        <Button color="auth" size="lgAuth" onClick={handleRedeem}>REDEEM CODE</Button>
                                    </div>
                                    <div className="account-actions-title">Logout</div>
                                    <div className="account-actions-item">
                                        <Button color="auth" size="lgAuth" onClick={handleLogout}>LOGOUT</Button>
                                    </div>
                                </div>
                            </GridItem>
                        </GridContainer>
                    </div>
                </GridItem>
                { alert }
            </GridContainer>
        </div>
    );
};