import React, { useState, useEffect, } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import InputAdornment from "@material-ui/core/InputAdornment";
import Close from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check";
import CheckIcon from '@material-ui/icons/Check';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

// core components
import GridContainer from "@/components/Grid/GridContainer.js";
import GridItem from "@/components/Grid/GridItem.js";
import Button from "@/components/CustomButtons/Button.js";
import Card from "@/components/Card/Card.js";
import CardBody from "@/components/Card/CardBody.js";

import UmblInput from "@/components/CustomInput/UmblInput.js";

import principalBanner from "@/assets/img/banners/banner-principal.jpg";
import signupBanner from "@/assets/img/banners/user-signup.jpg";
import signinBanner from "@/assets/img/banners/user-signin.jpg";
import followUsBanner from "@/assets/img/banners/follow-us-banner.png";
import mainPortalBanner from "@/assets/img/banners/umbl_project_portal.jpg";
import factionBanner from "@/assets/img/banners/choose_your_faction.jpg";
import incubatorBanner from "@/assets/img/banners/menu_incubator.jpg";
import chapterOneBanner from "@/assets/img/banners/chapter_one_banner.jpg";
import buyBioCratesBanner from "@/assets/img/banners/buy_biocrates.png";
import cityPlotsSectionBanner from "@/assets/img/banners/city_plots_section.jpg";
import sendReferralsBanner from "@/assets/img/banners/send_referrals.jpg";

import homePageStyle from "@/assets/jss/material-dashboard-pro-react/views/homePageStyle.js";
const useStyles = makeStyles(homePageStyle);

import { 
  RegisterAction, 
  LoginAction, 
  ResetLoadingAction, 
  ResetErrorAction, 
  LogoutAction,
  UpdateProfileAction,
} from '@/redux/actions/AuthActions';

import {RegisterUserService, LoginUserService, LogOutUserService} from '../../services/AuthServices';

import { 
  ForgotPasswordService,
} from '@/services/AuthServices';

import { 
  ResendVerificationEmail,
  GetUserAccountProfileService,
} from '@/services/UserServices';
import { Pages } from "@material-ui/icons";

export default function HomePage() {
  const PageStatus = {
    INPUT_EMAIL: 0,
    SUBMIT_EMAIL: 1,
    RESET_PASSWORD: 2,
    SUBMIT_PASSWORD: 3,
  };

  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { loading, isAuthenticated, isAdmin, isEmailVerifyRequired, currentUserEmail, error, } = useSelector(
    (state) => state.userAuth
  );

  const [pageStatus, setPageStatus] = useState(PageStatus.INPUT_EMAIL);

  // register form  
  const [userError, setUserError] = React.useState("");
  const [userToken, setUserToken] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [userEmailState, setUserEmailState] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [userPasswordState, setUserPasswordState] = React.useState("");
  const [userConfirmPassword, setUserConfirmPassword] = React.useState("");
  const [userConfirmPasswordState, setUserConfirmPasswordState] = React.useState("");

  // validation functions
  const verifyLength = (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
  };

  const verifyEmail = value => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };

  const verifyPassword = value => {
    if(!verifyLength(value, 8)) {
      return false;
    }
    return true;
  };

  const verifyConfirmPassword = value => {
    if(!verifyLength(value, 8)) {
      return false;
    }

    let password = document.getElementById('user_password').value;
    if(password !== '') {
      if(!verifyPassword(password))
        return false;
      if(password !== value)
        return false;
    } else {
      return false;
    }
    return true;
  };

  //
  const handleLoginAction = () => {
    setUserNameState("");
    setUserEmailState("");
    setUserPasswordState("");
    setUserConfirmPasswordState("");

    dispatch(ResetErrorAction());

    setPageStatus(PageStatus.LOGIN);
  };

  const handleSignupAction = () => {
    setUserNameState("");
    setUserEmailState("");
    setUserPasswordState("");
    setUserConfirmPasswordState("");

    dispatch(ResetErrorAction());

    setPageStatus(PageStatus.REGISTER);
  };

  const handleBackAction = (e) => {
    e.preventDefault(); 

    setUserNameState("");
    setUserEmailState("");
    setUserPasswordState("");
    setUserConfirmPasswordState("");
    setPageStatus(PageStatus.NONE);
  };

  const validateRegisterForm = () => {
    let result = true;
    if (userNameState !== "success") {
      setUserNameState("error");
      result = false;
    }   
    if (userEmailState !== "success") {
      setUserEmailState("error");
      result = false;
    }   
    if (userPasswordState !== "success") {
      setUserPasswordState("error");
      result = false;
    }   
    if (userConfirmPasswordState !== "success") {
      setUserConfirmPasswordState("error");
      result = false;
    }    

    return result;
  };

  const validateInputEmailForm = () => {
    let result = true;
    if (userEmailState !== "success") {
      setUserEmailState("error");
      result = false;
    }  
    return result;
  };

  const handleRegisterSubmit = () => {
    if(!validateRegisterForm()) {
      return;
    }

    dispatch(RegisterAction({
        username: userName,
        email: userEmail,
        password: userPassword,
        password_confirmation: userConfirmPassword,
        referrer: userReferralCode
      }, history
    ));
  };  

  const handleLoginSubmit = () => {

    if(!validateLoginForm()) {
      return;
    }

    dispatch(LoginAction({
        email: userEmail,
        password: userPassword
      }, history
    ));
  };

  const handleInputEmail = (e) => {
    e.preventDefault();

    if(!validateInputEmailForm()) {
      return;
    }

    console.log('handleInputEmail');

    setUserError("");

    ForgotPasswordService({email: userEmail}).then((res) => {
      if(res.hasOwnProperty('success') && res.success === true) {
        setPageStatus(PageStatus.SUBMIT_EMAIL);
      } else {
          let errMsg = res;
          if(res.hasOwnProperty('email')) {
              errMsg = res.email[0];
          }
          setUserError(errMsg);
      }
    }, error => {
        setUserError(error) ;
    })

  }

  useEffect(() => {
    if(isAdmin && isAuthenticated) {
      history.push('/admin');
    } else if(isAuthenticated) {
      history.push('/');
    }
  }, [isAdmin, isAuthenticated]);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const token_code = params.get('token');
    if(token_code !== '' && token_code !== null) {
      console.log(token_code);
      setUserToken(token_code);
    }
  }, [])

  return (
    <div className={classes.container}>       
      { pageStatus === PageStatus.INPUT_EMAIL ? (
      <GridContainer justifyContent="center">
        <GridItem xs={12} sm={12} md={12}>
          <Card main>
            <CardBody border>
              <div className={classes.registerBlock}>                
                <form>
                  <div className={classes.formTitle}>Forgot your Password?</div>
                  <UmblInput
                    auth
                    success={userEmailState === "success"}
                    error={userEmailState === "error"}
                    id="user_email"
                    placeholder="User Email"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (verifyEmail(event.target.value, 6)) {
                          setUserEmailState("success");
                        } else {
                          setUserEmailState("error");
                        }
                        setUserEmail(event.target.value);
                      },
                      type: "text",
                      endAdornment:
                      userEmailState === "error" ? (
                          <InputAdornment position="end" className={classes.adornment}>
                            <Close className={classes.danger} />
                          </InputAdornment>
                        ) : userEmailState === "success" ? (
                          <InputAdornment position="end" className={classes.adornment}>
                            <CheckIcon className={classes.success} />
                          </InputAdornment>
                        ) : undefined
                    }}
                  />      
                  <div style={{ textAlign: "center" }}>
                    <Button color="auth" size="lgAuth" className={classes.formButton} onClick={handleInputEmail}>
                      RESET
                    </Button>
                  </div> 
                  <div className={classes.errorMsg}>
                    { userError !== '' ? userError : ''}
                  </div>                 
                </form>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      ) : pageStatus === PageStatus.SUBMIT_EMAIL ? (
      <GridContainer justifyContent="center">
        <GridItem xs={12} sm={12} md={12}>
          <Card main>
            <CardBody border>
              <div className={classes.loginBlock + ' ' + classes.forgotMsgBlock}>
                <div className={classes.welcomTitle}>Thank you</div>
                <div className={classes.welcomTextContent + ' ' + classes.forgotMsgText}>
                  <p>We just sent an email to the address: {userEmail}<br/>
                  If you don't receive it in the next 10 minutes, please check your spam folder and if you still haven't received it please try again...
                  </p>
                </div>   
                <div>
                  <NavLink to={"/"} className={classes.navLink + ' ' + classes.forgotLink} >
                    Go to Login Page
                  </NavLink>
                </div>               
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>      
      ) : null}      
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}