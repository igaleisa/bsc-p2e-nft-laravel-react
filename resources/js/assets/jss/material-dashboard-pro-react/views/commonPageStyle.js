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
import notificationStyle from "@/assets/jss/material-dashboard-pro-react/views/notificationsStyle.js";
import modalStyle from "@/assets/jss/material-dashboard-pro-react/modalStyle.js";

const commonPageStyle = theme => ({
  ...sweetAlertStyle,
  ...notificationStyle,
  container: {
    ...container,
    zIndex: "4",
    [theme.breakpoints.down("sm")]: {
      paddingBottom: "100px"
    }
  },
  backdrop: {
    zIndex: 99999,
    color: '#fff',
  },
  fullBackImage: {
    position: "absolute",
    top: 0,
    left: 0,
    display: "-webkit-flex",
    display: "flex",
    height: "100%",
    width: "100%",
    zIndex: "-1",
    overflow: "auto",
    transition: "all .35s!important",
    backgroundPosition: "0 50%",
    backgroundRepeat: "no-repeat"
  },
  presaleBanner: {
    textTransform: "uppercase",
    minHeight: "300px",
    [theme.breakpoints.down("md")]: {
      minHeight: "300px",
    },
    [theme.breakpoints.down("sm")]: {
      minHeight: "200px",
    },
    [theme.breakpoints.down("xs")]: {
      minHeight: "90px",
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  presaleWarningBanner: {
    textTransform: "uppercase",
    minHeight: "480px",
    [theme.breakpoints.down("md")]: {
      minHeight: "400px",
    },
    [theme.breakpoints.down("sm")]: {
      minHeight: "300px",
    },
    [theme.breakpoints.down("xs")]: {
      minHeight: "130px",
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
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
  flexContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  blockIcon: {
    marginRight: "40px",
    [theme.breakpoints.down("sm")]: {
      minWidth: "20px",
    },
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
  ...modalStyle(theme)
});

export default commonPageStyle;
