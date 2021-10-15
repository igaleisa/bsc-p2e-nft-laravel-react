import sweetAlertStyle from "@/assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

const connectWalletStyle = theme => ({
  ...sweetAlertStyle,
  connectWallet: {
    // fontFamily: 'Microgramma',
    background: "linear-gradient(to right, #500909, #7D2E2E)",
    textTransform: "uppercase",
    border: "2px solid #FF7777",
    borderRadius: "6px !important",
    fontSize: "12px",
    padding: "8px 14px"
  },
});

export default connectWalletStyle;
