import React, { useState, useEffect, } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

// @material-ui/core components
import Hidden from "@material-ui/core/Hidden";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

// SweetAlert
import SweetAlert from "react-bootstrap-sweetalert";

// core components
import GridContainer from "@/components/Grid/GridContainer.js";
import GridItem from "@/components/Grid/GridItem.js";
import Button from "@/components/CustomButtons/Button.js";
import Card from "@/components/Card/Card.js";
import CardBody from "@/components/Card/CardBody.js";

// Icons
import armorIcon from "@/assets/img/icons/armorIcon.svg";

// styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "@/assets/jss/material-dashboard-pro-react/views/commonPageStyle.js";
const useStyles = makeStyles(styles);

// actions
import { LogoutAction } from '@/redux/actions/AuthActions';
import { 
    SwitchTfaSetting, 
    GetUserAccountProfileService, 
} from '@/services/UserServices';

export default function AccountPage() {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const { isAuthenticated, isAdmin, } = useSelector((state) => state.userAuth);

    const [loading, setLoading] = React.useState(false);
    const [alert, setAlert] = React.useState(null);
    const [tfa, setTfa] = React.useState(false);

    useEffect(() => {
        if(isAdmin && isAuthenticated) {
            history.push('/admin');
        }
        if(!isAuthenticated) {
            dispatch(LogoutAction(history));
        }
    }, [isAdmin, isAuthenticated]);  

    useEffect(() => {
        GetUserAccountProfileService().then(res => {
            if(res.hasOwnProperty('success') && res.success === true) {
              if(res.user.tfa === 0) setTfa(false);
              else setTfa(true);
            }
        })        
    }, []);  

    const updateTfaFlag = () => {
        setLoading(true);
        SwitchTfaSetting().then(res => {
            setLoading(false);

            if(res.hasOwnProperty('success') && res.success === true) {
                if(res.tfa) setTfa(true);
                else setTfa(false);

                showMessageBox('Success', '2FA setting was successfully updated!');
            }
        }, error => {
            setLoading(false);
        }) 
    }

    const hideAlert = (refresh=false) => {
        setAlert(null);
        if(refresh) window.location.reload();
    };

    const showMessageBox = (title, message) => {
        setAlert(
          <SweetAlert
            closeOnClickOutside={false}
            style={{ display: "block", marginTop: "-100px" }}
            title={title}
            onConfirm={() => hideAlert()}
            onCancel={() => hideAlert()}
            confirmBtnCssClass={classes.button + " " + classes.info}
            customClass="blackMsg"
          >
            {message}
          </SweetAlert>
        );
    };
    
    const handleRequestTfa = () => {
        console.log('handleRequestTfa');

        setAlert(
            <SweetAlert
              warning
              closeOnClickOutside={false}
              style={{ display: "block", marginTop: "-100px" }}
              title="Are you sure?"
              onConfirm={() => updateTfaFlag()}
              onCancel={() => hideAlert()}
              confirmBtnCssClass={classes.button + " " + classes.success}
              cancelBtnCssClass={classes.button + " " + classes.danger}
              confirmBtnText="Yes"
              cancelBtnText="Cancel"
              customClass="blackMsg"
              showCancel
            >
              { tfa ? 'Do you want to disable 2FA code for login?' : 'Do you want to enable 2FA code for login?' }
            </SweetAlert>
          );

    }

    return(
        <div className={classes.container}> 
            <GridContainer justifyContent="flex-start">
                <GridItem xs={12} sm={12} md={12}>
                    <div className="account-navbar">
                        <div className="account-navbar-item" onClick={() => {history.push('/account')}}>
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
                        <div className="account-navbar-item active" onClick={() => {history.push('/account/security')}}>
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
                    <div className="account-block tfa-block">
                        <div className="whiteTitleText">Request 2FA Code to Email Address</div>
                        <div className="graySmallText">Request 2FA Code to Email Address</div>
                        <Button color="auth" size="lgAuth" style={{marginTop: "30px"}} onClick={handleRequestTfa}>
                            { tfa ? 'Disable 2FA Code to Email Address' : 'Request 2FA Code to Email Address' }
                        </Button>
                    </div>
                </GridItem>
            </GridContainer>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {alert}
        </div>
    );
};