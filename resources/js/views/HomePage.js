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
import incubatorBanner from "@/assets/img/banners/menu_incubator.jpeg";
import chapterOneBanner from "@/assets/img/banners/chapter_one_banner.jpg";
import buyBioCratesBanner from "@/assets/img/banners/buy_biocrates.jpeg";
import cityPlotsSectionBanner from "@/assets/img/banners/city_plots_section.jpeg";
import sendReferralsBanner from "@/assets/img/banners/send_referrals.jpeg";

import homePageStyle from "@/assets/jss/material-dashboard-pro-react/views/homePageStyle.js";
const useStyles = makeStyles(homePageStyle);

import { 
  RegisterAction, 
  LoginAction, 
  ResetLoadingAction, 
  ResetErrorAction, 
  LogoutAction,
  UpdateProfileAction,
  LoginTFAAction,
} from '@/redux/actions/AuthActions';

import { 
  ResendVerificationEmail,
  GetUserAccountProfileService,
} from '@/services/UserServices';

export default function HomePage() {
  const PageStatus = {
    NONE: 0,
    LOGIN: 1,
    REGISTER: 2,
    VERIFICATION: 3,
    AUTHORIZED: 4,
    TFA: 5
  };

  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { loading, is2FA, isAuthenticated, isAdmin, isEmailVerifyRequired, currentUserEmail, error, } = useSelector(
    (state) => state.userAuth
  );

  const [pageStatus, setPageStatus] = useState(PageStatus.NONE);

  // register form
  const [userName, setUserName] = React.useState("");
  const [userNameState, setUserNameState] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [userEmailState, setUserEmailState] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [userPasswordState, setUserPasswordState] = React.useState("");
  const [userConfirmPassword, setUserConfirmPassword] = React.useState("");
  const [userConfirmPasswordState, setUserConfirmPasswordState] = React.useState("");

  // referral code
  const [userReferralCode, setUserReferralCode] = React.useState("");

  // validation functions
  const verifyLength = (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
  };

  const verifyUserName = (value, length) => {
    if (!verifyLength(value, length)) {
      return false;
    }

    var usernameRex = new RegExp("^[A-Za-z][A-Za-z0-9_]{5,29}$");
    if (usernameRex.test(value)) {
      return true;
    }

    return false;
  }

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

  const validateLoginForm = () => {
    let result = true;
    if (userEmailState === "") {
      setUserEmailState("error");
      result = false;
    }  
    if (userPasswordState === "") {
      setUserPasswordState("error");
      result = false;
    }   
    return result;
  };

  const handle2FA = () => {

  };

  const handleRememberMe = () => {

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

  const validateVerifyForm = () => {

  }

  const handleVerifySubmit = () => {
    let tfa_flag = true;
    let tfa_code = '';

    for(var i=0; i<4; i++) {
      var keyId = 'user_2fa_' + (i+1);

      if(document.getElementById(keyId).value !== '') {
        tfa_code += document.getElementById(keyId).value;
      } else {
        tfa_flag = false;
        break;
      }
    }

    if(tfa_flag) {
      console.log(tfa_code);
      dispatch(LoginTFAAction({
          code: tfa_code,
        }, history
      ));
    }    
  }

  const goToBioCrates = () => {
    history.push('/crates');
  };

  const isTokenExpired = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  
    const { exp } = JSON.parse(jsonPayload);
    const expired = Date.now() >= exp * 1000
    return expired;
  }

  const handleResendVerifyEmail = () => {
    ResendVerificationEmail();
  }

  const handleForgotLink = (e) => {
    e.preventDefault(); 
    history.push('/forgot');
  }

  const handleVerifyCode = (id, event) => {
    if(event.target.value.length === 1) {
      if(id !== 4) {
        // move focus
        const form = event.target.form;
        const index = Array.prototype.indexOf.call(form, event.target);
        form.elements[index + 1].focus();
        form.elements[index + 1].select();
        event.preventDefault();
      }
    }
  }

  useEffect(() => {
    dispatch(ResetErrorAction());
    dispatch(ResetLoadingAction());
  }, []);

  useEffect(() => {
    dispatch(ResetLoadingAction());
  }, [error]);

  useEffect(() => {
    if(!is2FA && (isAuthenticated || isEmailVerifyRequired)) {
      const userToken = localStorage.getItem("user-token");
      if(userToken !== undefined && userToken !== null) {
        if(isTokenExpired(userToken)) {
          setPageStatus(PageStatus.NONE);
        } else {
          GetUserAccountProfileService().then(res => {
            if(res.hasOwnProperty('success') && res.success === true) {
              dispatch(UpdateProfileAction(res));
              if(res.user.emailVerificationRequired) {
                setPageStatus(PageStatus.VERIFICATION);
              } else {
                setPageStatus(PageStatus.AUTHORIZED);
              }
            }
          })
        }
      } else {
        setPageStatus(PageStatus.NONE);
      }
    } else {
      if(is2FA) {
        setPageStatus(PageStatus.TFA);
      }
    }
  }, []);

  useEffect(() => {
    if(isAuthenticated) {
      setPageStatus(PageStatus.AUTHORIZED);
    } else if(isEmailVerifyRequired) {
      setPageStatus(PageStatus.VERIFICATION);
    } else if(is2FA) {
      setPageStatus(PageStatus.TFA);
    } else {
      setPageStatus(PageStatus.NONE);
    }
  }, [isAuthenticated, isEmailVerifyRequired, is2FA]);

  useEffect(() => {
    if(isAdmin && isAuthenticated) {
      history.push('/admin');
    }
  }, [isAdmin]);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const referral_code = params.get('referral');
    if(referral_code !== '' && referral_code !== null) {
      console.log(referral_code);
      setUserReferralCode(referral_code);
    }
  }, [])

  return (
    <div className={classes.container}> 
      <GridContainer justifyContent="center">
        <GridItem xs={12} sm={12} md={12}>
          { isAuthenticated ? (
          <Card main>
            <CardBody border>
              <div className={classes.welcomeBanner}>
                <div className={classes.welcomTitle}></div>
              </div>              
              <div
                className={classes.fullBackImage}
                style={{ backgroundImage: "url(" + mainPortalBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}
              />
            </CardBody>
          </Card>
          ) : (
          <Card main>
            <CardBody border>
              <div className={classes.welcomeBanner}>
                <div className={classes.welcomTitle}>Welcome to the lab</div>
              </div>              
              <div
                className={classes.fullBackImage}
                style={{ backgroundImage: "url(" + principalBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}
              />
            </CardBody>
          </Card>
          )}
        </GridItem>
      </GridContainer>
      { pageStatus === PageStatus.NONE ? (
      <GridContainer justifyContent="center">
        <GridItem xs={12} sm={12} md={6}>
          <Card main>
            <CardBody border>
              <div className={classes.authBlock}>
                <div className={classes.authCardTitle}>New to the lab?</div>
                <div className={classes.authCardDesc}>Sign Up In the App</div>
                <div className={classes.authButton}>
                  <Button color="auth" size="lgAuth" className={classes.marginRight} onClick={handleSignupAction}>
                    SIGN UP
                  </Button>
                </div>
              </div>              
              <div
                className={classes.fullBackImage}
                style={{ backgroundImage: "url(" + signupBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
            <Card main>
              <CardBody border>
                <div className={classes.authBlock + ' ' + classes.leftCenterFlex}>
                  <div className={classes.userLoginBlock}>
                    <div className={classes.authCardTitle}>User Login</div>
                    <div className={classes.authCardDesc + ' ' + classes.loginButtonMargin}>Get In the City</div>
                  </div>                
                  <div className={classes.authButton}>
                    <Button color="auth" size="lgAuth" className={classes.marginRight} onClick={handleLoginAction}>
                      LOGIN
                    </Button>
                  </div>
                </div>              
                <div
                  className={classes.fullBackImage}
                  style={{ backgroundImage: "url(" + signinBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}
                />
              </CardBody>
            </Card>
          </GridItem>
      </GridContainer>
        ): pageStatus === PageStatus.REGISTER ? (
      <GridContainer justifyContent="center">
        <GridItem xs={12} sm={12} md={12}>
          <Card main>
            <CardBody border>
              <div className={classes.registerBlock}>
                <List className={classes.list}>
                  <ListItem className={classes.listItem}>
                    <NavLink to={"/"} className={classes.navLink + ' ' + classes.backLink} onClick={handleBackAction}>
                      <i className="fas fa-arrow-circle-left"></i>
                      Go Back
                    </NavLink>
                  </ListItem>
                </List>
                <form>
                  <div className={classes.formTitle}>REGISTER</div>
                  <UmblInput
                    auth
                    success={userNameState === "success"}
                    error={userNameState === "error"}
                    id="user_name"
                    placeholder="Username"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (verifyUserName(event.target.value, 6)) {
                          setUserNameState("success");
                        } else {
                          setUserNameState("error");
                        }
                        setUserName(event.target.value);
                      },
                      type: "text",
                      endAdornment:
                        userNameState === "error" ? (
                          <InputAdornment position="end" className={classes.adornment}>
                            <Close className={classes.danger} />
                          </InputAdornment>
                        ) : userNameState === "success" ? (
                          <InputAdornment position="end" className={classes.adornment}>
                            <CheckIcon className={classes.success} />
                          </InputAdornment>
                        ) : undefined
                    }}
                  />  
                  <UmblInput
                    auth
                    success={userEmailState === "success"}
                    error={userEmailState === "error"}
                    id="user_email"
                    placeholder="Email Address"
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
                  <UmblInput
                    auth
                    success={userPasswordState === "success"}
                    error={userPasswordState === "error"}
                    id="user_password"
                    placeholder="Password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (verifyPassword(event.target.value)) {
                          setUserPasswordState("success");
                        } else {
                          setUserPasswordState("error");
                        }
                        setUserPassword(event.target.value);
                      },
                      type: "password",
                      endAdornment:
                        userPasswordState === "error" ? (
                          <InputAdornment position="end" className={classes.adornment}>
                            <Close className={classes.danger} />
                          </InputAdornment>
                        ) : userPasswordState === "success" ? (
                          <InputAdornment position="end" className={classes.adornment}>
                            <CheckIcon className={classes.success} />
                          </InputAdornment>
                        ) : undefined
                    }}
                  />   
                  <UmblInput
                    auth
                    success={userConfirmPasswordState === "success"}
                    error={userConfirmPasswordState === "error"}
                    id="user_confirmpassword"
                    placeholder="Repeat Password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (verifyConfirmPassword(event.target.value)) {
                          setUserConfirmPasswordState("success");
                        } else {
                          setUserConfirmPasswordState("error");
                        }
                        setUserConfirmPassword(event.target.value);
                      },
                      type: "password",
                      endAdornment:
                        userConfirmPasswordState === "error" ? (
                          <InputAdornment position="end" className={classes.adornment}>
                            <Close className={classes.danger} />
                          </InputAdornment>
                        ) : userConfirmPasswordState === "success" ? (
                          <InputAdornment position="end" className={classes.adornment}>
                            <CheckIcon className={classes.success} />
                          </InputAdornment>
                        ) : undefined
                    }}
                  />               
                  <div style={{ textAlign: "center" }}>
                    <Button color="auth" size="lgAuth" className={classes.formButton} onClick={handleRegisterSubmit}>
                      REGISTER
                    </Button>
                  </div> 
                  <div className={classes.errorMsg}>
                    { error !== '' ? error : ''}
                  </div>                 
                </form>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      ) : pageStatus === PageStatus.LOGIN ? (
      <GridContainer justifyContent="center">
        <GridItem xs={12} sm={12} md={12}>
          <Card main>
            <CardBody border>
              <div className={classes.loginBlock}>
                <List className={classes.list}>
                  <ListItem className={classes.listItem}>
                    <NavLink to={"/"} className={classes.navLink + ' ' + classes.backLink} onClick={handleBackAction}>
                      <i className="fas fa-arrow-circle-left"></i>
                      Go Back
                    </NavLink>
                  </ListItem>
                </List>
                <form>
                  <div className={classes.formTitle}>LOGIN</div>
                  <UmblInput
                    auth
                    success={userEmailState === "success"}
                    error={userEmailState === "error"}
                    id="user_email"
                    placeholder="Email Address"
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
                  <UmblInput
                    auth
                    success={userPasswordState === "success"}
                    error={userPasswordState === "error"}
                    id="user_password"
                    placeholder="Password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (verifyPassword(event.target.value)) {
                          setUserPasswordState("success");
                        } else {
                          setUserPasswordState("error");
                        }
                        setUserPassword(event.target.value);
                      },
                      type: "password",
                      endAdornment:
                        userPasswordState === "error" ? (
                          <InputAdornment position="end" className={classes.adornment}>
                            <Close className={classes.danger} />
                          </InputAdornment>
                        ) : userPasswordState === "success" ? (
                          <InputAdornment position="end" className={classes.adornment}>
                            <CheckIcon className={classes.success} />
                          </InputAdornment>
                        ) : undefined
                    }}
                  /> 
                  <div
                    className={
                      classes.checkboxAndRadio +
                      " " +
                      classes.checkboxAndRadioHorizontal + 
                      " " + 
                      classes.ml30
                    }
                  >
                    <NavLink to={"/forgot"} className={classes.navLink + ' ' + classes.forgotLink} onClick={handleForgotLink}>
                      Forgot Password?
                    </NavLink>
                  </div>     
                  <div
                    className={
                      classes.checkboxAndRadio +
                      " " +
                      classes.checkboxAndRadioHorizontal + 
                      " " + 
                      classes.ml30
                    }
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          onClick={() => handle2FA()}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checkedWarmRed,
                            root: classes.checkRoot
                          }}
                        />
                      }
                      classes={{
                        label: classes.labelWhite,
                        root: classes.labelRoot
                      }}
                      label="Use 2FA"
                    />
                  </div> 
                  <div
                    className={
                      classes.checkboxAndRadio +
                      " " +
                      classes.checkboxAndRadioHorizontal + 
                      " " + 
                      classes.ml30
                    }
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          onClick={() => handleRememberMe()}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checkedWarmRed,
                            root: classes.checkRoot
                          }}
                        />
                      }
                      classes={{
                        label: classes.labelWhite,
                        root: classes.labelRoot
                      }}
                      label="Remember Me"
                    />
                  </div>         
                  <div style={{ textAlign: "center" }}>
                    <Button color="auth" size="lgAuth" className={classes.formButton} onClick={handleLoginSubmit}>
                      LOGIN
                    </Button>
                  </div>
                  <div className={classes.errorMsg}>
                    { error !== '' ? error : ''}
                  </div>
                </form>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>      
      ) : pageStatus === PageStatus.TFA ? (
        <GridContainer justifyContent="center">
          <GridItem xs={12} sm={12} md={12}>
            <Card main>
              <CardBody border>
                <div className={classes.loginBlock}>
                  <List className={classes.list}>
                    <ListItem className={classes.listItem}>
                      <NavLink to={"/"} className={classes.navLink + ' ' + classes.backLink} onClick={handleBackAction}>
                        <i className="fas fa-arrow-circle-left"></i>
                        Go Back
                      </NavLink>
                    </ListItem>
                  </List>
                  <form>
                    <div className={classes.formTitle}>2FA Code Verification</div>
                    <div className={classes.verifyTfa}>
                      <UmblInput
                        verify
                        id="user_2fa_1"
                        inputProps={{
                          type: "string",
                          maxLength: "1",
                          onChange: event => {
                            handleVerifyCode(1, event);
                          },
                        }}
                        style={{ marginRight: "20px" }}
                      /> 
                      <UmblInput
                        verify
                        id="user_2fa_2"
                        inputProps={{
                          type: "string",
                          maxLength: "1",
                          onChange: event => {
                            handleVerifyCode(2, event);
                          },
                        }}
                        style={{ marginRight: "20px" }}
                      /> 
                      <UmblInput
                        verify
                        id="user_2fa_3"
                        inputProps={{
                          type: "string",
                          maxLength: "1",
                          onChange: event => {
                            handleVerifyCode(3, event);
                          },
                        }}
                        style={{ marginRight: "20px" }}
                      /> 
                      <UmblInput
                        verify
                        id="user_2fa_4"
                        inputProps={{
                          type: "string",
                          maxLength: "1",
                          onChange: event => {
                            handleVerifyCode(4, event);
                          },
                        }}
                      /> 
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <Button color="auth" size="lgAuth" className={classes.formButton} onClick={handleVerifySubmit}>
                        VERIFY
                      </Button>
                    </div>
                    <div className={classes.errorMsg}>
                      { error !== '' ? error : ''}
                    </div>
                  </form>
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>      
        ) : pageStatus === PageStatus.VERIFICATION ? (
        <GridContainer justifyContent="center">
          <GridItem xs={12} sm={12} md={12}>
            <Card main>
              <CardBody border>
                <div className={classes.loginBlock}>
                  <div className={classes.welcomTitle}>Verify your email to proceed</div>
                  <div className={classes.welcomTextContent}>
                    <p>We just sent an email to the address: {currentUserEmail}<br/>
                    Please check your email and click on the link provided to verify your address.
                    </p>
                  </div>   
                  <div className={classes.verifyButton}>
                    <Button color="auth" size="lgAuth" className={classes.marginRight} onClick={handleResendVerifyEmail}>
                      Resend Verificatioin Email
                    </Button>
                  </div>               
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>      
        ) : pageStatus === PageStatus.AUTHORIZED ? (
      <GridContainer justifyContent="center">
        <GridItem xs={12} sm={12} md={6}>
          <Card main>
            <CardBody border>
              <div className={classes.authBlock}>
                <div className={classes.authButton}>
                  <Button color="auth" size="lgAuth" className={classes.marginRight}>
                    COMING SOON
                  </Button>
                </div>
              </div>              
              <div
                className={classes.fullBackImage}
                style={{ backgroundImage: "url(" + factionBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card main>
            <CardBody border>
              <div className={classes.authBlock + ' ' + classes.leftCenterFlex}>
                <div className={classes.userLoginBlock}>
                </div>                
                <div className={classes.authButton}>
                  <Button color="auth" size="lgAuth" className={classes.marginRight}>
                    COMING SOON
                  </Button>
                </div>
              </div>              
              <div
                className={classes.fullBackImage}
                style={{ backgroundImage: "url(" + incubatorBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card main>
            <CardBody border>
              <div className={classes.welcomeBanner}>
                <div className={classes.userLoginBlock}>
                </div>                
                <div className={classes.authButton}>
                  <Button color="auth" size="lgAuth" className={classes.marginRight}>
                    COMING SOON
                  </Button>
                </div>
              </div>              
              <div
                className={classes.fullBackImage}
                style={{ backgroundImage: "url(" + chapterOneBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card main>
            <CardBody border>
              <div className={classes.welcomeBanner}>
                <div className={classes.userLoginBlock}>
                </div>                
                <div className={classes.authButton}>
                  <Button color="auth" size="lgAuth" className={classes.marginRight} onClick={goToBioCrates}>
                    BUY BIOCRATES
                  </Button>
                </div>
              </div>              
              <div
                className={classes.fullBackImage}
                style={{ backgroundImage: "url(" + buyBioCratesBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card main>
            <CardBody border>
              <div className={classes.authBlock + ' ' + classes.cityPlotsBlock}>
                <div className={classes.authButton}>
                  <Button color="auth" size="lgAuth" className={classes.marginRight}>
                    COMING SOON
                  </Button>
                </div>
              </div>              
              <div
                className={classes.fullBackImage}
                style={{ backgroundImage: "url(" + cityPlotsSectionBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card main>
            <CardBody border>
              <div className={classes.authBlock + ' ' + classes.leftCenterFlex + ' ' + classes.cityPlotsBlock}>
                <div className={classes.userLoginBlock}>
                </div>                
                <div className={classes.authButton}>
                  <Button color="auth" size="lgAuth" className={classes.marginRight}>
                    COMING SOON
                  </Button>
                </div>
              </div>              
              <div
                className={classes.fullBackImage}
                style={{ backgroundImage: "url(" + sendReferralsBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}
              />
            </CardBody>
          </Card>
        </GridItem>
        
      </GridContainer> 
      ) : null}
      <GridContainer justifyContent="center">
        <GridItem xs={12} sm={12} md={12}>
          <Card main>
            <CardBody border>
              <div className={classes.followBanner}>
                <div className={classes.followTitleBlock}>
                  <div className={classes.followTitle}>Follow Us Everywhere</div>
                </div>
                <div className={classes.followIconBlock}>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={1}></GridItem>
                    <GridItem xs={4} sm={4} md={2}>
                      <div className={classes.socialIcon}>
                        <a
                          href={process.env.MIX_SOCIAL_DISCORD}
                          target="_blank"
                        >
                          <i className="fab fa-discord"></i>
                        </a>                        
                      </div>
                    </GridItem>
                    <GridItem xs={4} sm={4} md={2}>
                      <div className={classes.socialIcon}>
                        <a
                          href={process.env.MIX_SOCIAL_TWITTER}
                          target="_blank"
                        >
                          <i className="fab fa-twitter" />
                        </a>  
                      </div>
                    </GridItem>
                    <GridItem xs={4} sm={4} md={2}>
                      <div className={classes.socialIcon}>
                        <a
                          href={process.env.MIX_SOCIAL_TELEGRAM}
                          target="_blank"
                        >
                          <i className="fab fa-telegram-plane"></i>
                        </a>                        
                      </div>
                    </GridItem>
                    <GridItem xs={6} sm={6} md={2}>
                      <div className={classes.socialIcon}>
                        <a
                          href={process.env.MIX_SOCIAL_INSTAGRAM}
                          target="_blank"
                        >
                          <i className="fab fa-instagram"></i>
                        </a>                        
                      </div>
                    </GridItem>
                    <GridItem xs={6} sm={6} md={2}>
                      <div className={classes.socialIcon}>
                        <a
                          href={process.env.MIX_SOCIAL_REDDIT}
                          target="_blank"
                        >
                          <i className="fab fa-reddit-alien"></i>
                        </a>                        
                      </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={1}></GridItem>
                  </GridContainer>
                </div>
              </div>              
              <div
                className={classes.fullBackImage}
                style={{ backgroundImage: "url(" + followUsBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}
              />
            </CardBody>
          </Card>
        </GridItem>        
      </GridContainer>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}