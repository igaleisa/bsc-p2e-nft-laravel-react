import React, { useEffect } from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import House from "@material-ui/icons/House";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ShopIcon from '@material-ui/icons/Shop';
import mainIcon from "@/assets/img/umbl_icon.png";

// core components
import Button from "@/components/CustomButtons/Button";
import ConnectWallet from "@/components/Connect/ConnectWallet";

import styles from "@/assets/jss/material-dashboard-pro-react/components/userNavbarStyle.js";
const useStyles = makeStyles(styles);

export default function UserNavbar(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { isAdmin, isAuthenticated, } = useSelector(
    (state) => state.userAuth
  );
  const [open, setOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  // verifies if routeName is the one active (in browser input)
  const activeRoute = routeName => {
    let currentRoute = window.location.href;

    if(routeName === '/') {
      return (currentRoute.length === currentRoute.lastIndexOf(routeName) + 1) ? true : false;
    } else {
      return window.location.href.indexOf(routeName) > -1 ? true : false;
    }
  };
  const classes = useStyles();
  const { color } = props;
  const appBarClasses = cx({
    [" " + classes[color]]: color
  });

  var authorizedList = (
    <div className={classes.mainNavbarList}>
      <List className={classes.list + ' ' + classes.centerSubNav}>
        <ListItem className={classes.listItem}>
          <NavLink 
            to={"/"} 
            className={cx(classes.navLink, {
              [classes.navLinkActive]: activeRoute("/")
            })}>
            <House className={classes.listItemIcon} />
            <ListItemText
              primary={"Dashboard"}
              disableTypography={true}
              className={classes.listItemText}
            />
          </NavLink>
        </ListItem>
        <ListItem className={classes.listItem}>
          <NavLink
            to={"/inventory"}
            className={cx(classes.navLink, {
              [classes.navLinkActive]: activeRoute("/inventory")
            })}
          >
            <AccountBalanceIcon className={classes.listItemIcon} />
            <ListItemText
              primary={"Inventory"}
              disableTypography={true}
              className={classes.listItemText}
            />
          </NavLink>
        </ListItem>
        <ListItem className={classes.listItem}>
          <NavLink
            to={"/marketplace"}
            className={cx(classes.navLink, {
              [classes.navLinkActive]: activeRoute("/marketplace")
            })}
          >
            <ShopIcon className={classes.listItemIcon} />
            <ListItemText
              primary={"Marketplace"}
              disableTypography={true}
              className={classes.listItemText}
            />
          </NavLink>
        </ListItem>        
      </List>
      <List className={classes.list + ' ' + classes.rightSubNav}>
        <ListItem className={classes.listItem}>
          <NavLink 
            to={"/account"} 
            className={cx(classes.navLink, {
              [classes.navLinkActive]: activeRoute("/account")
            })}>
            <AccountCircle className={classes.listItemIcon} />
            <Hidden mdUp>
              <ListItemText
                primary={"Account"}
                disableTypography={true}
                className={classes.listItemText}
              />
            </Hidden>
          </NavLink>
        </ListItem>     
      </List>
    </div>
  );
  var unAuthorizedList = (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        
      </ListItem>
    </List>
  );

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

  useEffect(() => {
    if(localStorage.getItem("user-token")) {
      if(isTokenExpired(localStorage.getItem("user-token"))) {
        console.log('Token Expired!');
        localStorage.removeItem('user-token');
        history.push('/');
      }
    }
  }, [])
  
  return (
    <AppBar position="static" className={classes.appBar + appBarClasses}>
      <div className={classes.content}>
        <div className={classes.mainLink}>
          <NavLink to={"/"} className={classes.navMainLink}>
            <img src={mainIcon} className={classes.mainIcon} alt="..." />
            <div className={classes.mainTitle}>
              <div color="transparent">
                <ListItemText
                  primary={"UMBRELLA"}
                  disableTypography={true}
                  className={classes.largeListItemText}
                />
              </div>
              <div color="transparent">
                <ListItemText
                  primary={"PROJECT"}
                  disableTypography={true}
                  className={classes.smallListItemText}
                />
              </div>
            </div>
          </NavLink>
        </div>
        <Toolbar className={classes.container}>          
          <Hidden smDown>
            { isAuthenticated ? authorizedList : unAuthorizedList }
          </Hidden>
          <Hidden mdUp>
            { isAuthenticated ? (
            <Button
              className={classes.sidebarButton}
              color="transparent"
              justIcon
              aria-label="open drawer"
              onClick={handleDrawerToggle}
            >
              <Menu />
            </Button>
            ) : null }
          </Hidden>
          <Hidden mdUp>
            <Hidden mdUp>
              <Drawer
                variant="temporary"
                anchor={"right"}
                open={open}
                classes={{
                  paper: classes.drawerPaper
                }}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true // Better open performance on mobile.
                }}
              >
                { isAuthenticated ? authorizedList : unAuthorizedList }
              </Drawer>
            </Hidden>
          </Hidden>
        </Toolbar>
        <div className={classes.rightLink}>
          { isAuthenticated ? (
          <Hidden smDown>
            <ConnectWallet className={classes.walletButton} />
          </Hidden>
          ) : null }
        </div>
      </div>
    </AppBar>
  );
}

UserNavbar.propTypes = {
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
};
