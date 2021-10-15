/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

// @material-ui/icons
import AddAlert from "@material-ui/icons/AddAlert";
import Close from "@material-ui/icons/Close";

// core components
import Heading from "@/components/Heading/Heading.js";
import GridContainer from "@/components/Grid/GridContainer.js";
import GridItem from "@/components/Grid/GridItem.js";
import SnackbarContent from "@/components/Snackbar/SnackbarContent.js";
import Button from "@/components/CustomButtons/Button.js";
import Snackbar from "@/components/Snackbar/Snackbar.js";
import Instruction from "@/components/Instruction/Instruction.js";
import Card from "@/components/Card/Card.js";
import CardBody from "@/components/Card/CardBody.js";

import styles from "@/assets/jss/material-dashboard-pro-react/components/messageboxStyle.js";

import noticeModal1 from "@/assets/img/card-1.jpeg";
import noticeModal2 from "@/assets/img/card-2.jpeg";

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function MessageBox(props) {
  const classes = useStyles();
  const { title, content, show, onClose } = props;
  
  React.useEffect(() => {
    // Specify how to clean up after this effect:
    return function cleanup() {
      // to stop the warning of calling setState of unmounted component
      var id = window.setTimeout(null, 0);
      while (id--) {
        window.clearTimeout(id);
      }
    };
  });
  return (    
    <Dialog
      classes={{
        root: classes.center + " " + classes.modalRoot,
        paper: classes.modal
      }}
      open={show}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => onClose()}
      aria-labelledby="classic-modal-slide-title"
      aria-describedby="classic-modal-slide-description"
    >
      <DialogTitle
        id="classic-modal-slide-title"
        disableTypography
        className={classes.modalHeader}
      >
        <Button
          justIcon
          className={classes.modalCloseButton}
          key="close"
          aria-label="Close"
          color="transparent"
          onClick={() => onClose()}
        >
          <Close className={classes.modalClose} />
        </Button>
        <h4 className={classes.modalTitle}>{title}</h4>
      </DialogTitle>
      <DialogContent
        id="classic-modal-slide-description"
        className={classes.modalBody}
      >
        <p>
          { content }
        </p>
      </DialogContent>
      <DialogActions className={classes.modalFooter}>
        <Button
          onClick={() => onClose()}
          color="info"
          simple
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
