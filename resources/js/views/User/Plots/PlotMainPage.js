import React, { useState, useEffect, } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

// core components
import GridContainer from "@/components/Grid/GridContainer.js";
import GridItem from "@/components/Grid/GridItem.js";

// styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "@/assets/jss/material-dashboard-pro-react/views/commonPageStyle.js";
const useStyles = makeStyles(styles);

// actions
import { LogoutAction, } from '@/redux/actions/AuthActions';

export default function PlotMainPage() {
    const history = useHistory();
    const dispatch = useDispatch();

    const { isAuthenticated, isAdmin, } = useSelector((state) => state.userAuth);

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
            backgroundImg = 'url(/images/cityplots/box1_blur.png)';
        } else if(id === 2) {
            backgroundImg = 'url(/images/cityplots/box2_blur.png)';
        } else if(id === 3) {
            backgroundImg = 'url(/images/cityplots/box3_blur.png)';
        } else if(id === 4) {
            backgroundImg = 'url(/images/cityplots/box4_blur.png)';
        }

        document.getElementById('plot_main_block').style.backgroundImage = backgroundImg;
    };

    const goTocityplotPage = (id) => {
        // history.push('/plots/' + id);
    }

    return(
        <div className="plot-main-container">
            <GridContainer className="plot-grid-container" id="plot_main_block">
                <GridItem xs={12} sm={12} md={3} className="plot-block plot-1" onMouseEnter={() => handleMouseEnter(1)} onClick={() => goTocityplotPage(1)}>
                    <div className="block-body">
                        {/* <div className="title-container">
                            <h5 className="card-title">SURVIVORS</h5>
                            <p className="card-text"><span>BASIC</span> <span>cityplot</span></p>
                        </div>
                        <div className="rarity-container">
                            <label className="card-text common">COMMON</label>
                            <label className="card-text uncommon">UNCOMMON</label>
                        </div> */}
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={3} className="plot-block plot-2" onMouseEnter={() => handleMouseEnter(2)} onClick={() => goTocityplotPage(2)}>
                    <div className="block-body">
                        {/* <div className="title-container">
                            <h5 className="card-title">SURVIVORS</h5>
                            <p className="card-text"><span>TACTICAL</span> cityplot</p>
                        </div>
                        <div className="rarity-container">
                            <label className="card-text unique">UNIQUE</label>
                        </div> */}
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={3} className="plot-block plot-3" onMouseEnter={() => handleMouseEnter(3)} onClick={() => goTocityplotPage(3)}>
                    <div className="block-body">
                        {/* <div className="title-container">
                            <h5 className="card-title">SCIENTIST</h5>
                            <p className="card-text"><span>ALPHA</span> TYPE</p>
                        </div>
                        <div className="rarity-container">
                            <label className="card-text common">COMMON</label>
                            <label className="card-text uncommon">UNCOMMON</label>
                        </div> */}
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={3} className="plot-block plot-4" onMouseEnter={() => handleMouseEnter(4)} onClick={() => goTocityplotPage(4)}>
                    <div className="block-body">
                        {/* <div className="title-container">
                            <h5 className="card-title">SCIENTIST</h5>
                            <p className="card-text"><span>OMEGA</span> TYPE</p>
                        </div>
                        <div className="rarity-container">
                            <label className="card-text unique">UNIQUE</label>
                        </div> */}
                    </div>
                </GridItem>
            </GridContainer>
        </div>
    );
};