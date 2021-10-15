import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import { LoginAction } from '@/redux/actions/AuthActions';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
// import Weekend from "@material-ui/icons/Weekend";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Business from "@material-ui/icons/Business";
import AccountBalance from "@material-ui/icons/AccountBalance";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

// core components
import GridContainer from "@/components/Grid/GridContainer.js";
import GridItem from "@/components/Grid/GridItem.js";
import Button from "@/components/CustomButtons/Button.js";
import Card from "@/components/Card/Card.js";
import CardBody from "@/components/Card/CardBody.js";

import CustomInput from "@/components/CustomInput/CustomInput.js";
import Check from "@material-ui/icons/Check";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import styles from "@/assets/jss/material-dashboard-pro-react/views/homePageStyle.js";
import welcomeBackImg from "@/assets/img/welcome-opt.d4d3a30b.jpg";
import principalBanner from "@/assets/img/banners/banner-principal.png";
import signupBanner from "@/assets/img/banners/user-signup.png";
import signinBanner from "@/assets/img/banners/user-signin.png";
import followUsBanner from "@/assets/img/banners/follow-us-banner.png";

const useStyles = makeStyles(styles);

export default function HomePage() {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isAuthenticated, currentUser, } = useSelector(
    (state) => state.userAuth
  );
  const [login, setLogin] = useState(false);

  // login form
  const [loginEmail, setloginEmail] = useState("");
  const [loginEmailState, setloginEmailState] = useState("");
  const [loginPassword, setloginPassword] = useState("");
  const [loginPasswordState, setloginPasswordState] = useState("");
  // type validation
  const [required, setrequired] = useState("");
  const [requiredState, setrequiredState] = useState("");
  const [typeEmail, settypeEmail] = useState("");
  const [typeEmailState, settypeEmailState] = useState("");
  const [number, setnumber] = useState("");
  const [numberState, setnumberState] = useState("");
  const [url, seturl] = useState("");
  const [urlState, seturlState] = useState("");
  const [equalTo, setequalTo] = useState("");
  const [whichEqualTo, setwhichEqualTo] = useState("");
  const [equalToState, setequalToState] = useState("");
  // range validation
  const [minLength, setminLength] = useState("");
  const [minLengthState, setminLengthState] = useState("");
  const [maxLength, setmaxLength] = useState("");
  const [maxLengthState, setmaxLengthState] = useState("");
  const [range, setrange] = useState("");
  const [rangeState, setrangeState] = useState("");
  const [minValue, setminValue] = useState("");
  const [minValueState, setminValueState] = useState("");
  const [maxValue, setmaxValue] = useState("");
  const [maxValueState, setmaxValueState] = useState("");
  // function that returns true if value is email, false otherwise
  const verifyEmail = value => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };
  // function that verifies if a string has a given length or not
  const verifyLength = (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
  };
  // function that verifies if value contains only numbers
  const verifyNumber = value => {
    var numberRex = new RegExp("^[0-9]+$");
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  };
  // verifies if value is a valid URL
  const verifyUrl = value => {
    try {
      new URL(value);
      return true;
    } catch (_) {
      return false;
    }
  };

  const loginClick = (e) => {
    if (loginEmailState === "") {
      setloginEmailState("error");
    }
    if (loginPasswordState === "") {
      setloginPasswordState("error");
    }

    e.preventDefault();    

    dispatch(LoginAction(
      {
        email: loginEmail,
        password: loginPassword,
      },
      history
    ));

    setLogin(false);
  };

  const handleLoginToggle = () => {
    setLogin(!login);
  };

  return (
    <div className={classes.container}> 
      <GridContainer justifyContent="center">
        <GridItem xs={12} sm={12} md={12}>
          <Card main>
            <CardBody>
              <div className={classes.welcomeMsg}>
                <div className={classes.welcomTitle}>Welcome to the lab</div>
              </div>              
              <div
                className={classes.fullBackImage}
                style={{ backgroundImage: "url(" + principalBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card main>
            <CardBody>
              <div className={classes.authBlock}>
                <div className={classes.authCardTitle}>New to the lab?</div>
                <div className={classes.authCardDesc}>Sign Up In the App</div>
                <div className={classes.authButton}>
                  <Button color="auth" size="lgAuth" className={classes.marginRight} onClick={handleLoginToggle}>
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
            <CardBody>
              <div className={classes.authBlock + ' ' + classes.leftCenterFlex}>
                <div className={classes.userLoginBlock}>
                  <div className={classes.authCardTitle}>User Login</div>
                  <div className={classes.authCardDesc + ' ' + classes.loginButtonMargin}>Get In the City</div>
                </div>                
                <div className={classes.authButton}>
                  <Button color="auth" size="lgAuth" className={classes.marginRight} onClick={handleLoginToggle}>
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
        <GridItem xs={12} sm={12} md={6}>
          <Card main>
            <CardBody>
              { !isAuthenticated ? (
              login === false ? (
              <div className={classes.adminLogin}>
                <div className={classes.description}>Do you have an Admin account?</div>
                <div className={classes.loginArea}>
                  <Button color="auth" size="lg" className={classes.marginRight} onClick={handleLoginToggle}>
                    LOGIN
                  </Button>
                </div>
              </div>
              ) : (
              <div className={classes.adminLogin}>
                <List className={classes.list}>
                  <ListItem className={classes.listItem}>
                    <NavLink to={"/admin"} className={classes.navLink} onClick={handleLoginToggle}>
                      <KeyboardBackspaceIcon className={classes.listItemIcon} />
                      <ListItemText
                        primary={"GO BACK"}
                        disableTypography={true}
                        className={classes.listItemText}
                      />
                    </NavLink>
                  </ListItem>
                </List>
                <form>
                  <CustomInput
                    white
                    success={loginEmailState === "success"}
                    error={loginEmailState === "error"}
                    labelText="Email adress"
                    id="email_adress"
                    formControlProps={{
                      fullWidth: true
                    }}                    
                    inputProps={{
                      onChange: event => {
                        if (verifyEmail(event.target.value)) {
                          setloginEmailState("success");
                        } else {
                          setloginEmailState("error");
                        }
                        setloginEmail(event.target.value);
                      },
                      type: "email"
                    }}
                  />
                  <CustomInput
                    white
                    success={loginPasswordState === "success"}
                    error={loginPasswordState === "error"}
                    labelText="Password"
                    id="password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (verifyLength(event.target.value, 1)) {
                          setloginPasswordState("success");
                        } else {
                          setloginPasswordState("error");
                        }
                        setloginPassword(event.target.value);
                      },
                      type: "password",
                      autoComplete: "off"
                    }}
                  />
                  <div style={{ textAlign: "center" }}>
                    <Button color="rose" onClick={loginClick}>LOGIN</Button>
                  </div>
                </form>
              </div>
              )  
              ) : (
              <div className={classes.welcomeMsg}>
                <div className={classes.description}>User Profile</div>
                <div className={classes.title}>{currentUser}</div>                
              </div>
              ) }           
            </CardBody>
          </Card>
        </GridItem>
      
      </GridContainer> 
    </div>
  );
}
