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
  ForgotPasswordService,
} from '@/services/AuthServices';

export default function ForgotPasswordPage() {
  const PageStatus = {
    INPUT_EMAIL: 0,
    SUBMIT_EMAIL: 1
  };

  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isAuthenticated, isAdmin, } = useSelector(
    (state) => state.userAuth
  );

  const [pageStatus, setPageStatus] = useState(PageStatus.INPUT_EMAIL);
  const [loading, setLoading] = React.useState(false);

  // register form    
  const [userError, setUserError] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [userEmailState, setUserEmailState] = React.useState("");

  // validation functions
  const verifyEmail = value => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };

  const validateInputEmailForm = () => {
    let result = true;
    if (userEmailState !== "success") {
      setUserEmailState("error");
      result = false;
    }  
    return result;
  };

  const handleInputEmail = (e) => {
    e.preventDefault();

    if(!validateInputEmailForm()) {
      return;
    }

    setLoading(true);
    setUserError("");
    
    ForgotPasswordService({email: userEmail}).then((res) => {
      setLoading(false);
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