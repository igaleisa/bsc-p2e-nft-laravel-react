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

import validationFormsStyle from "@/assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import customSelectStyle from "@/assets/jss/material-dashboard-pro-react/customSelectStyle.js";
import customCheckboxRadioSwitch from "@/assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";
import extendedFormStyle from "@/assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";
import sweetAlertStyle from "@/assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import extendedTablesStyle from "@/assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";

const commonPageStyle = theme => ({
  ...sweetAlertStyle,
  ...customSelectStyle,
  ...customCheckboxRadioSwitch,
  ...validationFormsStyle,
  ...extendedFormStyle,
  ...extendedTablesStyle,
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
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  choiche: {
    textAlign: "center",
    cursor: "pointer",
    marginTop: "20px"
  },
  cardTitleWhite: {
    color: "white !important"
  },
  infoForm: {
    padding: "20px"
  },
  addNewItem: {
    textAlign: "right",
    margin: "20px",
  },
  gridItemCenter: {
    textAlign: "center",
    marginTop: "30px"
  },
  alertMsg: {
    paddingTop: '30px !important',
    color: 'red !important'
  },
  backdrop: {
    zIndex: 99999,
    color: '#fff',
  },
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  choiche: {
    textAlign: "center",
    cursor: "pointer",
    marginTop: "20px"
  },
  cardTitleWhite: {
    color: "white !important"
  },
  clearButton: {
    marginLeft: "10px"
  },
  p20: {
    paddingTop: "16px !important"
  },
  toggleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "normal",
    paddingTop: "36px !important",
    paddingLeft: "50px !important",
  },
  bigTitle: {
    fontSize: "1.25rem !important",
    color: "#000 !important"
  },
});

export default commonPageStyle;
