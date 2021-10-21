import {
  primaryColor,
  dangerColor,
  successColor,
  defaultFont,
  whiteColor,
  grayColor,
  warmRedColor
} from "@/assets/jss/material-dashboard-pro-react.js";
import { red } from "@material-ui/core/colors";
import { blackColor } from "../../material-dashboard-pro-react";

const umblInputStyle = theme => ({
  underline: {    
    "&:before": {
      content: "none",
    },
    "&:after": {
      content: "none",
    },
    "& + p": {
      fontWeight: "300"
    }
  },
  disabled: {
    "&:before": {
      borderColor: "transparent !important"
    }
  },
  underlineError: {
    "&:after": {
      borderColor: dangerColor[0]
    }
  },
  underlineSuccess: {
    "&:after": {
      borderColor: successColor[0]
    }
  },
  labelRoot: {
    ...defaultFont,
    position: "absolute",
    left: "8px",
    top: "8px",
    zIndex: "9999",
    color: grayColor[3] + " !important",
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "1.42857",
    letterSpacing: "unset",
    "& + $underline": {
      marginTop: "0px"
    }
  },
  labelRootError: {
    color: dangerColor[0] + " !important"
  },
  labelRootSuccess: {
    color: successColor[0] + " !important"
  },
  formControl: {
    display: "flex",
    justifyContent: "center",
    margin: "0 0 17px 0",
    paddingTop: "0px",
    position: "relative",
    verticalAlign: "unset",
    "& svg,& .fab,& .far,& .fal,& .fas,& .material-icons": {
      color: grayColor[14]
    }
  },
  whiteUnderline: {
    "&:hover:not($disabled):before,&:before": {
      backgroundColor: whiteColor
    },
    "&:after": {
      backgroundColor: whiteColor
    }
  },
  input: {
    padding: "4px 8px",
    color: whiteColor,
    borderRadius: "4px !important",
    minHeight: "36px !important",
    border: "1px solid " + grayColor[4] + "!important",      
    backgroundColor: warmRedColor,
    height: "unset",
    "&,&::placeholder": {
      fontSize: "14px",
      fontFamily: '"Microgramma", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: "400",
      lineHeight: "1.42857",
      opacity: "1"
    },
    "&::placeholder": {
      color: whiteColor,
    },
    "&:hover, &:active, &:focus" : {
      color: whiteColor,
      backgroundColor: blackColor
    },
  },
  whiteInput: {
    "&,&::placeholder": {
      color: whiteColor,
      opacity: "1"
    }
  },
  authInput: {
    minWidth: "360px",
    [theme.breakpoints.down("sm")]: {
      minWidth: "280px",
    },
    [theme.breakpoints.down("xs")]: {
      minWidth: "240px",
    },
  },
  verifyInput: {
    width: "40px",
    textAlign: "center",
    textTransform: "uppercase"
  }
});

export default umblInputStyle;
