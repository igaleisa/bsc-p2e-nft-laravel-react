import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import UserNavbar from "@/components/Navbars/UserNavbar.js";
// import Footer from "@/components/Footer/Footer.js";

import routes from "@/routes.js";

import styles from "@/assets/jss/material-dashboard-pro-react/layouts/mainStyle.js";

import backImage from "@/assets/img/crushpixel-1995899.png";

const useStyles = makeStyles(styles);

export default function Pages(props) {
  const { ...rest } = props;
  // ref for the wrapper div
  const wrapper = React.createRef();
  // styles
  const classes = useStyles();

  React.useEffect(() => {
    document.body.style.overflow = "unset";
    // Specify how to clean up after this effect:
    return function cleanup() {};
  });
  const getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/user") {         
        return (
          <Route
            exact            
            path={prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  return (
    <div>
      <UserNavbar {...rest} />
      <div className={classes.wrapper} ref={wrapper}>
        <div
          className={classes.fullPage}
          style={{ backgroundImage: "url(" + backImage + ")" }}
        >
          <Switch>
            {getRoutes(routes)}
            {/* <Redirect from="/" to="/" /> */}
          </Switch>
          {/* <Footer white /> */}
        </div>
      </div>
    </div>
  );
}
