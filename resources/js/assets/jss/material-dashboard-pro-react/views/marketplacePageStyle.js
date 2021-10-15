import {
  container,
  grayColor,
  warmRedColor,
} from "@/assets/jss/material-dashboard-pro-react.js";

const marketplacePageStyle = theme => ({
  container: {
    ...container,
    zIndex: "4",
    [theme.breakpoints.down("sm")]: {
      paddingBottom: "100px"
    }
  },  
  mainBlock: {
    textTransform: "uppercase",
    minHeight: "120px",
    padding: "40px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    color: grayColor[19],
    transition: "all 1s ease-in-out",
    "&:hover" : {
      color: warmRedColor,
    }
  },
  mainTitle: {
    fontFamily: 'Microgramma',
    fontSize: "20px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "16px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
    },
    textAlign: "right",
    fontWeight: "bold"
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
});

export default marketplacePageStyle;
