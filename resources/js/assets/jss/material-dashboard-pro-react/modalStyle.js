import { grayColor } from "@/assets/jss/material-dashboard-pro-react.js";

const modalStyle = theme => ({
  modalRoot: {
    overflow: "auto",
    alignItems: "unset",
    justifyContent: "unset"
  },
  modal: {
    [theme.breakpoints.up("sm")]: {
      maxWidth: "800px",
      minWidth: "600px",
      margin: "auto"
    },
    borderRadius: "6px",
    marginTop: "200px !important",
    overflow: "visible",
    maxHeight: "unset",
    position: "relative",
    height: "fit-content"
  },
  blackModal: {
    backgroundColor: "black",
    boxShadow: "rgb(0 0 0 / 8%) 0px 1px 1px inset, #a5caea 0px 0px 8px"
  },
  modalHeader: {
    borderBottom: "none",
    paddingTop: "24px",
    paddingRight: "24px",
    paddingBottom: "0",
    paddingLeft: "24px",
    minHeight: "16.43px"
  },
  modalTitle: {
    margin: "0",
    lineHeight: "1.42857143"
  },
  modalWhiteTitle: {
    color: "white"
  },
  modalCloseButton: {
    color: grayColor[0],
    marginTop: "-20px",
    marginRight: "-20px",
    WebkitAppearance: "none",
    padding: "0",
    cursor: "pointer",
    background: "0 0",
    border: "0",
    fontSize: "inherit",
    opacity: ".9",
    textShadow: "none",
    fontWeight: "700",
    lineHeight: "1",
    float: "right"
  },
  modalClose: {
    width: "16px",
    height: "16px"
  },
  modalCloseWhite: {
    color: "white"
  },
  modalBody: {
    paddingTop: "24px",
    paddingRight: "24px",
    paddingBottom: "16px",
    paddingLeft: "24px",
    position: "relative",
    overflow: "visible"
  },
  modalFooter: {
    padding: "15px",
    textAlign: "right",
    paddingTop: "0",
    margin: "0"
  },
  modalFooterCenter: {
    marginLeft: "auto",
    marginRight: "auto"
  },
  instructionNoticeModal: {
    marginBottom: "25px"
  },
  imageNoticeModal: {
    maxWidth: "150px"
  },
  modalSmall: {
    width: "300px"
  },
  modalSmallBody: {
    paddingTop: "0"
  },
  modalSmallFooterFirstButton: {
    margin: "0",
    paddingLeft: "16px",
    paddingRight: "16px",
    width: "auto"
  },
  modalSmallFooterSecondButton: {
    marginBottom: "0",
    marginLeft: "5px"
  }
});

export default modalStyle;
