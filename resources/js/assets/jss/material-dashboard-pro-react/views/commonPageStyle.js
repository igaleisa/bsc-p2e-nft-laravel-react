import {
  container,
  defaultFont,
  cardTitle,
  roseColor,
  whiteColor,
  grayColor,
  hexToRgb,
  redColor,
  warmRedColor,
  lightBlueColor,
  dangerColor,
  successColor,
} from "@/assets/jss/material-dashboard-pro-react.js";

import sweetAlertStyle from "@/assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

const commonPageStyle = theme => ({
  ...sweetAlertStyle,
  container: {
    ...container,
    zIndex: "4",
    [theme.breakpoints.down("sm")]: {
      paddingBottom: "100px"
    }
  },
  mt10: {
    marginTop: "10px !important",
  },
  warmRedTitleText: {
    fontFamily: 'Microgramma',
    color: warmRedColor,
    fontSize: "24px",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  lightBlueSmallText: {
    fontFamily: 'Microgramma',
    color: lightBlueColor,
    fontSize: "12px",
    textTransform: "uppercase",
  },
  normalBlock: {
    width: "100%",
    minHeight: "150px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      color: whiteColor,
      fontSize: "32px",
      marginRight: "12px",
    }  
  },
  blockIcon: {
  },
  imageIcon: {
    marginTop: "-3px",
    top: "0px",
    position: "relative",
    marginRight: "3px",
    width: "96px",
    height: "96px",
    verticalAlign: "middle",
    color: "inherit",
    display: "inline-block"
  },
  blockContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    minWidth: "300px",    
    [theme.breakpoints.down("lg")]: {
      minWidth: "600px",
    },
    [theme.breakpoints.down("md")]: {
      minWidth: "400px",
    },
    [theme.breakpoints.down("sm")]: {
      minWidth: "300px",
    },
    [theme.breakpoints.down("xs")]: {
      minWidth: "100px",
    },
  },
  contentTitle: {
    color: whiteColor,
    fontSize: "24px",
    textTransform: "uppercase",
    fontWeight: "600",
  },  
  contentSmallText: {
    color: grayColor[0],
    fontSize: "12px",
    textTransform: "uppercase",
  },  
});

export default commonPageStyle;
