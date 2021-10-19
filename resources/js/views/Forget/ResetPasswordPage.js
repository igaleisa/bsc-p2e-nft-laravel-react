import React, { useState, useEffect, } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import InputAdornment from "@material-ui/core/InputAdornment";
import Close from "@material-ui/icons/Close";
import CheckIcon from '@material-ui/icons/Check';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

// core components
import GridContainer from "@/components/Grid/GridContainer.js";
import GridItem from "@/components/Grid/GridItem.js";
import Button from "@/components/CustomButtons/Button.js";
import Card from "@/components/Card/Card.js";
import CardBody from "@/components/Card/CardBody.js";

import UmblInput from "@/components/CustomInput/UmblInput.js";

import homePageStyle from "@/assets/jss/material-dashboard-pro-react/views/homePageStyle.js";
const useStyles = makeStyles(homePageStyle);

import { 
  ResetPasswordService,
} from '@/services/AuthServices';

export default function ResetPasswordPage() {
  const PageStatus = {
    RESET_PASSWORD: 0,
    SUBMIT_PASSWORD: 1
  };

  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isAuthenticated, isAdmin, } = useSelector(
    (state) => state.userAuth
  );

  const [pageStatus, setPageStatus] = useState(PageStatus.RESET_PASSWORD);
  const [loading, setLoading] = React.useState(false);

  // register form    
  const [userError, setUserError] = React.useState("");
  const [userToken, setUserToken] = React.useState("");
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

  const validateResetPasswordForm = () => {
    let result = true;

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

  const handleResetPassword = (e) => {
    e.preventDefault();

    if(!validateResetPasswordForm()) {
      return;
    }

    setUserError("");
    setLoading(true);

    ResetPasswordService({
      password: userPassword,
      password_confirmation: userConfirmPassword,
      token: userToken
    }).then((res) => {
      setLoading(false);
      if(res.hasOwnProperty('success') && res.success === true) {
        setPageStatus(PageStatus.SUBMIT_PASSWORD);
        setTimeout(() => {
          history.push('/');
        }, 10000);
      } else {
          let errMsg = res.message;
          if(res.hasOwnProperty('token')) {
              errMsg = res.token[0];
          } else if(res.hasOwnProperty('password')) {
            errMsg = res.password[0];
          }
          setUserError(errMsg);
      }
    }, error => {
      setLoading(false);
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
      setUserToken(token_code);
    } else {
      history.push('/');
    }
  }, [])

  return (
    <div className={classes.container}>       
      { pageStatus === PageStatus.RESET_PASSWORD ? (
      <GridContainer justifyContent="center">
        <GridItem xs={12} sm={12} md={12}>
          <Card main>
            <CardBody border>
              <div className={classes.registerBlock}>                
                <form>
                  <div className={classes.formTitle}>Confirm Password Change</div>
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
                    <Button color="auth" size="lgAuth" className={classes.formButton} onClick={handleResetPassword}>
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
      ) : pageStatus === PageStatus.SUBMIT_PASSWORD ? (
      <GridContainer justifyContent="center">
        <GridItem xs={12} sm={12} md={12}>
          <Card main>
            <CardBody border>
              <div className={classes.loginBlock + ' ' + classes.forgotMsgBlock}>
                <div className={classes.welcomTitle}>Success</div>
                <div className={classes.welcomTextContent + ' ' + classes.forgotMsgText}>
                  <p>Your password was reset successfully!<br/>
                  Please try to login again with new password.
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