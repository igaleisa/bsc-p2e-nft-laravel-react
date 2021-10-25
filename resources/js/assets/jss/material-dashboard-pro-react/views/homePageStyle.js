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
  dangerColor,
  successColor,
} from "@/assets/jss/material-dashboard-pro-react.js";

import regularFormsStyle from "@/assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const homePageStyle = theme => ({
  ...regularFormsStyle,
  container: {
    ...container,
    zIndex: "4",
    [theme.breakpoints.down("sm")]: {
      paddingBottom: "100px"
    }
  },
  description: {
    ...defaultFont,
    color: whiteColor,
    textAlign: "left",
    fontWeight: "500",
    lineHeight: "3"
  },
  welcomTitle: {
    fontFamily: 'Microgramma',
    color: grayColor[19],
    fontSize: "28px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "22px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
    },
    textAlign: "right",
    fontWeight: "bold"
  },
  welcomTextContent: {
    margin: "30px 0px",
    fontFamily: 'Microgramma',
    color: grayColor[19],
    fontSize: "18px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "16px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "10px",
    },
    textAlign: "center",
    fontWeight: "normal"
  },
  forgotMsgText: {
    textAlign: "left !important",
    lineHeight: "30px"
  },
  authCardTitle: {
    fontFamily: 'Microgramma',
    color: whiteColor,
    textTransform: "uppercase",
    textShadow: "2px 2px 2px #333",
    fontSize: "32px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "28px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "22px",
    },
    textAlign: "right",
    fontWeight: "bold"
  },
  authCardDesc: {
    fontFamily: 'Microgramma',
    color: redColor,
    textTransform: "uppercase",
    textShadow: "2px 2px 2px #111",
    fontSize: "20px",
    margin: "10px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "16px",
      margin: "4px"
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
      margin: "0px"
    },
    textAlign: "right",
    fontWeight: "bold"    
  },
  cardTitleWhite: {
    ...cardTitle,
    color: whiteColor + " !important"
  },
  cardCategory: {
    color: grayColor[0],
    marginTop: "10px"
  },
  cardCategoryWhite: {
    color: whiteColor,
    marginTop: "10px"
  },
  icon: {
    color: "rgba(" + hexToRgb(whiteColor) + ", 0.76)",
    margin: "10px auto 0",
    width: "130px",
    height: "130px",
    border: "1px solid " + grayColor[11],
    borderRadius: "50%",
    lineHeight: "174px",
    "& svg": {
      width: "55px",
      height: "55px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      width: "55px",
      fontSize: "55px"
    }
  },
  iconWhite: {
    color: whiteColor
  },
  iconRose: {
    color: roseColor[0]
  },
  marginTop30: {
    marginTop: "30px"
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
  welcomeBanner: {
    textTransform: "uppercase",
    minHeight: "256px",
    [theme.breakpoints.down("md")]: {
      minHeight: "220px",
    },
    [theme.breakpoints.down("sm")]: {
      minHeight: "170px",
    },
    [theme.breakpoints.down("xs")]: {
      minHeight: "80px",
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  followBanner: {
    textTransform: "uppercase",
    minHeight: "450px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  followTitleBlock: {
    position: "absolute",
    left: "30%",
    [theme.breakpoints.down("sm")]: {
      left: "50%",
      transform: "translate(-50%)",
    },
    top: "10%"
  },
  followTitle: {
    color: whiteColor,
    fontSize: "28px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "24px"
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "20px"
    },
    textAlign: "left",
    fontWeight: "400",
    lineHeight: "1.25"
  },
  socialIcon: {
    margin: "0 20px",
    [theme.breakpoints.down("sm")]: {
      margin: "0 8px",
      display: "flex",
      justifyContent: "center",
      marginBottom: "50px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {      
      color: whiteColor,
      width: "56px",
      height: "56px",
      overflow: "unset",
      fontSize: "54px",
      [theme.breakpoints.down("sm")]: {
        width: "30px",
        height: "30px",
        fontSize: "42px",
      },
      [theme.breakpoints.down("xs")]: {
        width: "10px",
        height: "10px",
        fontSize: "28px",
      },
      textAlign: "center",
      lineHeight: "56px",
      marginBottom: "1px",
      "&:hover": {
        cursor: "pointer"
      }
    }    
  },
  authBlock: {
    width: "100%",
    minHeight: "260px",
    [theme.breakpoints.down("md")]: {
      minHeight: "210px",
    },
    [theme.breakpoints.down("sm")]: {
      minHeight: "350px",
    },
    [theme.breakpoints.down("xs")]: {
      minHeight: "145px",
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  cityPlotsBlock: {
    minHeight: "210px !important",
    [theme.breakpoints.down("md")]: {
      minHeight: "210px !important",
    },
    [theme.breakpoints.down("sm")]: {
      minHeight: "280px !important",
    },
    [theme.breakpoints.down("xs")]: {
      minHeight: "135px !important",
    }
  },
  followIconBlock: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
    display: "flex",
    justifyContent: "center"
  },
  backLink: {
    ...defaultFont,
    color: whiteColor,
    textAlign: "left !important",
    fontSize: "16px !important",
    fontWeight: "500 !important",
    alignItems: "center",
    "&:hover, &:active": {
      color: warmRedColor + " !important",
      "& .listItemText": {
        color: warmRedColor + " !important",
      }
    }
  },
  forgotLink: {
    justifyContent: "flex-end !important",
    "&:hover, &:active": {
      color: warmRedColor + " !important",
    }
  },
  registerBlock: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "20px",
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      fontSize: "24px",
      marginRight: "12px",
    }    
  },
  loginBlock: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "20px",
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      fontSize: "24px",
      marginRight: "12px",
    },
  },
  forgotMsgBlock: {
    alignItems: "flex-start",
    padding: "30px 40px"
  },
  navLink: {
    color: whiteColor,
    margin: "0 5px",    
    fontWeight: "500",
    fontSize: "12px",
    textTransform: "uppercase",
    borderRadius: "3px",
    lineHeight: "20px",
    position: "relative",
    display: "flex",
    padding: "10px 15px",
    textDecoration: "none",
    "&:hover,&:focus": {
      color: whiteColor,
    }
  },
  listItemIcon: {
    marginTop: "3px",
    width: "30px",
    color: "inherit",
    marginRight: "12px",
  },
  verifyButton: {
    textAlign: "center",
    marginBottom: "20px"
  },
  authButton: {
    position: "absolute",
    left: "24px",
    bottom: "4px",
    [theme.breakpoints.down("sm")]: {
      left: "16px",
      bottom: "2px",
    },
    [theme.breakpoints.down("xs")]: {
      left: "8px",
      bottom: "0px",
    },
  },
  leftCenterFlex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "start !important",
    alignItems: "center"
  },
  userLoginBlock: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "end !important",
    alignItems: "end"
  },
  loginButtonMargin: {
    marginRight: "0px !important"
  },
  formTitle: {
    color: whiteColor,
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "400",
    margin: "10px 0px 20px 0px"
  },
  danger: {
    color: dangerColor[0] + "!important"
  },
  success: {
    color: successColor[0] + "!important"
  },
  adornment: {
    position: "absolute",
    right: "-30px",
  },
  formButton: {
    marginBottom: "20px"
  },
  backdrop: {
    zIndex: 99999,
    color: '#fff',
  },
  ml30: {
    marginLeft: "30px"
  },
  errorMsg: {
    minHeight: "30px",
    marginBottom: "30px",
    textAlign: "center",
    color: dangerColor[0],
  },
  verifyTfa: {
    display: "flex",
    justifyContent: "space-between"
  }
});

export default homePageStyle;
