import React, { useState, useEffect, } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

// import ReactPlayer from 'react-player'
import ReactPlayer from 'react-player/lazy'

// @material-ui/core components
import Hidden from "@material-ui/core/Hidden";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

// @material-ui/icons
import AddAlert from "@material-ui/icons/AddAlert";
import Close from "@material-ui/icons/Close";

// core components
import GridContainer from "@/components/Grid/GridContainer.js";
import GridItem from "@/components/Grid/GridItem.js";
import Button from "@/components/CustomButtons/Button.js";
import Card from "@/components/Card/Card.js";
import CardBody from "@/components/Card/CardBody.js";

// Icons
import userAvatar from "@/assets/img/icons/userAvatar.png";

import SweetAlert from "react-bootstrap-sweetalert";


// styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "@/assets/jss/material-dashboard-pro-react/views/commonPageStyle.js";
const useStyles = makeStyles(styles);

// actions
import { LogoutAction, } from '@/redux/actions/AuthActions';
import { GetTokenListService } from '@/services/UserServices';

// contract
import { useUmblCoreContract } from "@/hooks";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });

export default function Profile() {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();

    const { isAuthenticated, isAdmin, } = useSelector((state) => state.userAuth);
    const { status, account, } = useSelector((state) => state.userWallet);

    const umblCoreContract = useUmblCoreContract();

    const [alert, setAlert] = React.useState(null);
    const [accountError, setAccountError] = React.useState(false);
    const [userBadges, setUserBadges] = useState([]);
    const [viewBadge, setViewBadge] = useState(false);
    const [badgeV360, setBadgeV360] = useState(null);
    const [badgeTitle, setBadgeTitle] = useState(null);

    useEffect(() => {
        if(isAdmin && isAuthenticated) {
            history.push('/admin');
            return;
        } else if(!isAuthenticated) {
            dispatch(LogoutAction(history));
            return;
        } 
    }, [isAdmin, isAuthenticated]);   

    useEffect(async () => {
        if(status && account) {
            if (!umblCoreContract) {
                return;
            } 

            GetTokenListService({address: account.toLowerCase()})
            .then(res => {   
                const selectedTokenList = res.tokenList.filter((data) => {
                    if(data.preset.tokentype)
                        return data.preset.tokentype.name === 'Badge';
                });             
                setUserBadges(selectedTokenList.map((prop, key) => {
                    return {
                        tokenId: prop.token_id,
                        name: prop.preset.name,
                        description: prop.preset.description,
                        badgetype: prop.preset.badgetype.name,
                        state: prop.state.id,
                        image: prop.preset.thumbnail,
                        v360: prop.preset.v360,
                        attributes: JSON.parse(prop.preset.attributes)
                    };
                }));                
            })
            .catch(err => {
                showErrorMsg(err);
                return;
            });

        } else {
            setAccountError(true);
        }
    }, [status, account]);

    useEffect(() => {
        if(accountError) {
            setAlert(
                <SweetAlert
                  closeOnClickOutside={false}
                  style={{ display: "block", marginTop: "-100px" }}
                  title="ERROR"
                  onConfirm={() => hideAlert()}
                  onCancel={() => hideAlert()}
                  confirmBtnCssClass={classes.button + " " + classes.info}
                  customClass="blackMsg"
                >
                    Please connect metamask
                </SweetAlert>
              );
        }
    }, [accountError])
    
    const showErrorMsg = (message) => {
        setAlert(
          <SweetAlert
            closeOnClickOutside={false}
            style={{ display: "block", marginTop: "-100px" }}
            title="Error!"
            onConfirm={() => hideAlert()}
            onCancel={() => hideAlert()}
            confirmBtnCssClass={classes.button + " " + classes.info}
            customClass="blackMsg"
          >
            {message}
          </SweetAlert>
        );
    };  

    const handleLogout = () => {
        dispatch(LogoutAction(history));
    }

    const hideAlert = () => {
        setAlert(null);
    };

    const handleViewInventory = () => {
        history.push('/inventory');
    }
    
    const handleViewProfile = () => {
        history.push('/account');
    }

    const handleViewBadge = (badgeItem) => {
        console.log(badgeItem);

        if(badgeItem.name !== null && badgeItem.name !== undefined && badgeItem.v360 !== null && badgeItem.v360 !== undefined) {
            setBadgeTitle(badgeItem.name);
            setBadgeV360(badgeItem.v360);
            setViewBadge(true);
        }
    }

    return(
        <div className={classes.container}> 
            <GridContainer justifyContent="flex-start">
                <GridItem xs={12} sm={12} md={12}>
                    <div className="account-navbar">
                        <div className="account-navbar-item" onClick={() => {history.push('/account')}}>
                            <div className="account-navbar-item-icon">
                                <i className="far fa-address-card"></i>
                            </div>
                            <div className="account-navbar-item-text">
                                General
                            </div>
                        </div>
                        <div className="account-navbar-item active" onClick={() => {history.push('/account/profile')}}>
                            <div className="account-navbar-item-icon">
                                <i className="fas fa-user"></i>
                            </div>
                            <Hidden smDown>
                                <div className="account-navbar-item-text">
                                    Profile
                                </div>
                            </Hidden>
                        </div>
                        <div className="account-navbar-item" onClick={() => {history.push('/account/security')}}>
                            <div className="account-navbar-item-icon">
                                <i className="fas fa-lock"></i>
                            </div>
                            <Hidden smDown>
                                <div className="account-navbar-item-text">
                                    Security
                                </div>
                            </Hidden>
                        </div>
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                    <div className="account-block">
                        <GridContainer justifyContent="flex-start" >                            
                            <GridItem xs={12} sm={12} md={6}>
                                <div className="profile-block">
                                    <div className="profile-avatar">
                                        <img src={userAvatar} alt='user_avatar' />                                        
                                    </div>
                                    <div className="profile-description">
                                        <div className="whiteTitleText">Your User Profile</div>
                                        <div className="smallDescText">Customize your User Profile</div>
                                    </div>
                                </div>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6} style={{display: "flex", justifyContent: "flex-end"}}>
                                <Button color="auth" size="lgAuth" style={{marginRight: "10px"}} onClick={handleViewInventory}>View Inventory</Button>
                                <Button color="auth" size="lgAuth" onClick={handleViewProfile}>View Profile</Button>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12}>
                                <div className="badges-block">
                                    <div className="badges-title">
                                        Badges                                     
                                    </div>
                                    <div className="badges-block-container">
                                        { userBadges.length ? userBadges.map((prop, key) => {
                                            return (
                                                <div className="badge-item-block" key={key}> 
                                                    <div className="badge-item-rarity">{prop.rarityName}</div>                                           
                                                    <div className="badge-item-image">
                                                        <img src={process.env.MIX_UMBL_STORAGE_URI + 'thumbnails/' + prop.image} alt='user_avatar' />     
                                                    </div>
                                                    <div className="badge-item-class">{prop.name}</div>                                                    
                                                    <div className="badge-item-action">
                                                        <Button color="auth" size="sm">Take</Button>
                                                        <Button color="auth" size="sm" onClick={() => handleViewBadge(prop)}>View</Button>
                                                    </div>
                                                </div>
                                            )
                                        }): null }
                                    </div>
                                </div>
                            </GridItem>
                        </GridContainer>
                    </div>
                </GridItem>
                <Dialog
                    classes={{
                        root: classes.center + " " + classes.modalRoot,
                        paper: classes.modal + " " + classes.blackModal
                    }}
                    open={viewBadge}
                    TransitionComponent={Transition}
                    keepMounted
                    // onClose={() => setViewBadge(false)}
                    aria-labelledby="classic-modal-slide-title"
                    aria-describedby="classic-modal-slide-description"
                >
                    <DialogTitle
                        id="classic-modal-slide-title"
                        disableTypography
                        className={classes.modalHeader}
                    >
                        {/* <Button
                            justIcon
                            className={classes.modalCloseButton}
                            key="close"
                            aria-label="Close"
                            color="transparent"
                            onClick={() => setViewBadge(false)}
                        >
                            <Close className={classes.modalClose + "" + classes.modalCloseWhite} />
                        </Button> */}
                        <h4 className={classes.modalTitle + " " + classes.modalWhiteTitle}>{badgeTitle ? badgeTitle : ''}</h4>
                    </DialogTitle>
                    <DialogContent
                        id="classic-modal-slide-description"
                        className={classes.modalBody}
                    >
                        { badgeV360 !== null ? (
                        <ReactPlayer 
                            // url='/videos/test-video.mp4' 
                            url={process.env.MIX_UMBL_STORAGE_URI + 'badges/' + badgeV360 + '.mp4'}
                            playing={true} 
                            loop={true} 
                            width='100%'
                            height='100%'/>
                        ) : null }
                    </DialogContent>
                    <DialogActions className={classes.modalFooter}>
                        <Button
                            onClick={() => setViewBadge(false)}
                            color="white"
                            simple
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                { alert }
            </GridContainer>
        </div>
    );
};