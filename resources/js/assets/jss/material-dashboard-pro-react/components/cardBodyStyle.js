import {
  whiteColor,
  hexToRgb
} from "@/assets/jss/material-dashboard-pro-react.js";

const cardBodyStyle = theme => ({
  cardBody: {
    // padding: "0.9375rem 20px",
    padding: "8px",
    [theme.breakpoints.down("md")]: {
      padding: "4px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "2px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "1px",
    },
    flex: "1 1 auto",
    WebkitBoxFlex: "1",
    position: "relative"
  },
  cardBodyBackground: {
    position: "relative",
    zIndex: "2",
    minHeight: "280px",
    paddingTop: "40px",
    paddingBottom: "40px",
    maxWidth: "440px",
    margin: "0 auto"
  },
  cardBodyPlain: {
    paddingLeft: "5px",
    paddingRight: "5px"
  },
  cardBodyBorder: {
    border: "3px solid transparent",
    transition: "border-color 1s ease-in-out",
    "&:hover,&:focus": {      
      border: "3px solid #51202c",
    },
  },
  cardBodyNoPadding: {
    padding: "0px"
  },
  cardBodyFormHorizontal: {
    paddingLeft: "15px",
    paddingRight: "15px",
    "& form": {
      margin: "0"
    }
  },
  cardPricing: {
    padding: "15px!important",
    margin: "0px!important"
  },
  cardSignup: {
    padding: "0px 30px 0px 30px"
  },
  cardBodyColor: {
    borderRadius: "6px",
    "& h1,& h2,& h3": {
      "& small": {
        color: "rgba(" + hexToRgb(whiteColor) + ", 0.8)"
      }
    }
  },
  cardBodyProfile: {
    marginTop: "15px"
  },
  cardBodyCalendar: {
    padding: "0px !important"
  }
});

export default cardBodyStyle;
