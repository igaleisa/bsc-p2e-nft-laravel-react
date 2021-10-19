import React, { useState, useEffect, } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

// @material-ui/core components
import Hidden from "@material-ui/core/Hidden";

// core components
import GridContainer from "@/components/Grid/GridContainer.js";
import GridItem from "@/components/Grid/GridItem.js";
import Button from "@/components/CustomButtons/Button.js";
import Card from "@/components/Card/Card.js";
import CardBody from "@/components/Card/CardBody.js";

// Icons
import armorIcon from "@/assets/img/icons/armorIcon.svg";

import SweetAlert from "react-bootstrap-sweetalert";

// styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "@/assets/jss/material-dashboard-pro-react/views/commonPageStyle.js";
const useStyles = makeStyles(styles);

// actions
import { LogoutAction, } from '@/redux/actions/AuthActions';
import { GetUserAccountProfileService, } from '@/services/UserServices';

// contract
import { useUmblCoreContract } from "@/hooks";

export default function CrateMainPage() {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();

    const { isAuthenticated, isAdmin, } = useSelector((state) => state.userAuth);

    const [alert, setAlert] = React.useState(null);

    useEffect(() => {
        if(isAdmin && isAuthenticated) {
            history.push('/admin');
            return;
        } else if(!isAuthenticated) {
            dispatch(LogoutAction(history));
            return;
        } 
    }, [isAdmin, isAuthenticated]);

    const handleMouseEnter = (id) => {
        let backgroundImg = '';
        if(id === 1) {
            backgroundImg = 'url(/images/crates/survivor-back-1.jpg)';
        } else if(id === 2) {
            backgroundImg = 'url(/images/crates/survivor-back-2.jpg)';
        } else if(id === 3) {
            backgroundImg = 'url(/images/crates/scientist-back-1.jpg)';
        } else if(id === 4) {
            backgroundImg = 'url(/images/crates/scientist-back-2.jpg)';
        }

        document.getElementById('crate_main_block').style.backgroundImage = backgroundImg;
    };

    const goToCratePage = (id) => {
        history.push('/crates/' + id);
    }

    return(
        <div className="crate-main-container">
            <GridContainer className="crate-grid-container" id="crate_main_block">
                <GridItem xs={12} sm={12} md={3} className="crate-block survivor-1" onMouseEnter={() => handleMouseEnter(1)} onClick={() => goToCratePage(1)}>
                    <div className="block-body">
                        <div className="title-container">
                            <h5 className="card-title">SURVIVORS</h5>
                            <p className="card-text"><span>BASIC</span> CRATE</p>
                        </div>
                        <div className="rarity-container">
                            <label className="card-text common">COMMON</label>
                            <label className="card-text uncommon">UNCOMMON</label>
                        </div>
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={3} className="crate-block survivor-2" onMouseEnter={() => handleMouseEnter(2)} onClick={() => goToCratePage(2)}>
                    <div className="block-body">
                        <div className="title-container">
                            <h5 className="card-title">SURVIVORS</h5>
                            <p className="card-text"><span>TACTICAL</span> CRATE</p>
                        </div>
                        <div className="rarity-container">
                            <label className="card-text unique">UNIQUE</label>
                        </div>
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={3} className="crate-block scientist-1" onMouseEnter={() => handleMouseEnter(3)} onClick={() => goToCratePage(3)}>
                    <div className="block-body">
                        <div className="title-container">
                            <h5 className="card-title">SCIENTIST</h5>
                            <p className="card-text"><span>ALPHA</span> CRATE</p>
                        </div>
                        <div className="rarity-container">
                            <label className="card-text common">COMMON</label>
                            <label className="card-text uncommon">UNCOMMON</label>
                        </div>
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={3} className="crate-block scientist-2" onMouseEnter={() => handleMouseEnter(4)} onClick={() => goToCratePage(4)}>
                    <div className="block-body">
                        <div className="title-container">
                            <h5 className="card-title">SCIENTIST</h5>
                            <p className="card-text"><span>OMEGA</span> CRATE</p>
                        </div>
                        <div className="rarity-container">
                            <label className="card-text unique">UNIQUE</label>
                        </div>
                    </div>
                </GridItem>
            </GridContainer>
        </div>
    );
};