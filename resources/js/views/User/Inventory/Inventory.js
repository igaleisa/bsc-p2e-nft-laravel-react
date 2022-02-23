import React, { useState, useEffect, } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

// @material-ui/core components

// core components
import GridContainer from "@/components/Grid/GridContainer.js";
import GridItem from "@/components/Grid/GridItem.js";
import Button from "@/components/CustomButtons/Button.js";
import Card from "@/components/Card/Card.js";
import CardBody from "@/components/Card/CardBody.js";

// Icons
import armorIcon from "@/assets/img/icons/shield.png";
import weaponIcon from "@/assets/img/icons/Gun2.png";
import accesoriesIcon from "@/assets/img/icons/accessory.png";
import virusIcon from "@/assets/img/icons/virus.png";
// import paracitesIcon from "@/assets/img/icons/paracitesIcon.svg";
import paracitesIcon from "@/assets/img/icons/parasites-and-fungus.png";
import variantsIcon from "@/assets/img/icons/variants.png";
import cityplotIcon from "@/assets/img/icons/plot-map.png";

import weaponsBanner from "@/assets/img/inventory/weapons.png";
import armorBanner from "@/assets/img/inventory/armor.png";
import accesoriesBanner from "@/assets/img/inventory/accesories.png";
import virusVariantBanner from "@/assets/img/inventory/virus-variant.png";
import parasitesFungusBanner from "@/assets/img/inventory/parasites-and-fungus.png";
import virusBanner from "@/assets/img/inventory/virus.png";
import landPlotsBanner from "@/assets/img/inventory/land-plots.png";


// styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "@/assets/jss/material-dashboard-pro-react/views/commonPageStyle.js";
const useStyles = makeStyles(styles);
// import css from "@/assets/scss/test.scss";

// actions
import { LogoutAction } from '@/redux/actions/AuthActions';

export default function InventoryPage() {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const { isAuthenticated, isAdmin, } = useSelector((state) => state.userAuth);

    const goToCategory = (categoryId) => {
        var subCategory = 'armor';
        if(categoryId === 1) subCategory = 'weapons';
        else if(categoryId === 2) subCategory = 'armor';
        else if(categoryId === 3) subCategory = 'accesories';
        else if(categoryId === 4) subCategory = 'virus';
        else if(categoryId === 5) subCategory = 'paracites';
        else if(categoryId === 6) subCategory = 'variants';
        else if(categoryId === 7) subCategory = 'plots';
        history.push('/inventory/' + subCategory);
    };

    useEffect(() => {
        if(isAdmin && isAuthenticated) {
            history.push('/admin');
        }
        if(!isAuthenticated) {
            dispatch(LogoutAction(history));
        }
    }, [isAdmin, isAuthenticated]);    

    return(
        <div className={classes.container}> 
            <GridContainer justifyContent="center">
                <GridItem xs={12} sm={12} md={12}>
                    <Card transparent>
                        <CardBody>
                            <div className={classes.warmRedTitleText}>
                                Categories
                            </div>
                            <div className={classes.mt10 + ' ' + classes.lightBlueSmallText}>
                                Select a category
                            </div>
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
            <GridContainer justifyContent="center">
                <GridItem xs={12} sm={12} md={12}>
                    <Card inventory>
                        <CardBody nopadding>
                            <div className="inventoryBlock">
                                <div className={classes.flexContainer}>
                                    <div className={classes.blockIcon}>
                                        <img src={weaponIcon} className={classes.imageIcon} alt="Weapon" />
                                    </div>
                                    <div className={classes.blockContent}>
                                        <div className="content-title">
                                            Weapons
                                        </div>
                                        <div className="content-small-text">
                                            View Owned Weapons
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.blockArrow} onClick={() => goToCategory(1)}>
                                    <i className="fas fa-arrow-circle-right"></i>
                                </div>                                
                            </div>
                            <div className={classes.fullBackImage} style={{ backgroundImage: "url(" + weaponsBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}/>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                    <Card inventory>
                        <CardBody nopadding>
                            <div className="inventoryBlock">
                                <div className={classes.flexContainer}>
                                    <div className={classes.blockIcon}>
                                        <img src={armorIcon} className={classes.imageIcon} alt="Armor" />
                                    </div>
                                    <div className={classes.blockContent}>
                                        <div className="content-title">
                                            Armor
                                        </div>
                                        <div className="content-small-text">
                                            View Owned Armor
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.blockArrow} onClick={() => goToCategory(2)}>
                                    <i className="fas fa-arrow-circle-right"></i>
                                </div>                                
                            </div>
                            <div className={classes.fullBackImage} style={{ backgroundImage: "url(" + armorBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}/>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                    <Card inventory>
                        <CardBody nopadding>
                            <div className="inventoryBlock">
                                <div className={classes.flexContainer}>
                                    <div className={classes.blockIcon}>
                                        <img src={accesoriesIcon} className={classes.imageIcon} alt="Accesories" />
                                    </div>
                                    <div className={classes.blockContent}>
                                        <div className="content-title">
                                            Accessories
                                        </div>
                                        <div className="content-small-text">
                                            View Owned Accessories
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.blockArrow} onClick={() => goToCategory(3)}>
                                    <i className="fas fa-arrow-circle-right"></i>
                                </div>                                
                            </div>
                            <div className={classes.fullBackImage} style={{ backgroundImage: "url(" + accesoriesBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}/>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                    <Card inventory>
                        <CardBody nopadding>
                            <div className="inventoryBlock">
                                <div className={classes.flexContainer}>
                                    <div className={classes.blockIcon}>
                                        <img src={virusIcon} className={classes.imageIcon} alt="Viruses and Bacteria" />
                                    </div>
                                    <div className={classes.blockContent}>
                                        <div className="content-title">
                                            Viruses and Bacteria
                                        </div>
                                        <div className="content-small-text">
                                            View Owned Viruses and Bacteria
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.blockArrow} onClick={() => goToCategory(4)}>
                                    <i className="fas fa-arrow-circle-right"></i>
                                </div>                                
                            </div>
                            <div className={classes.fullBackImage} style={{ backgroundImage: "url(" + virusVariantBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}/>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                    <Card inventory>
                        <CardBody nopadding>
                            <div className="inventoryBlock">
                                <div className={classes.flexContainer}>
                                    <div className={classes.blockIcon}>
                                        <img src={paracitesIcon} className={classes.imageIcon} alt="Parasites and Fungus" />
                                    </div>
                                    <div className={classes.blockContent}>
                                        <div className="content-title">
                                            Parasites and Fungus
                                        </div>
                                        <div className="content-small-text">
                                            View Owned Parasites and Fungus
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.blockArrow} onClick={() => goToCategory(5)}>
                                    <i className="fas fa-arrow-circle-right"></i>
                                </div>                                
                            </div>
                            <div className={classes.fullBackImage} style={{ backgroundImage: "url(" + parasitesFungusBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}/>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                    <Card inventory>
                        <CardBody nopadding>
                            <div className="inventoryBlock">
                                <div className={classes.flexContainer}>
                                    <div className={classes.blockIcon}>
                                        <img src={variantsIcon} className={classes.imageIcon} alt="Virus Variants" />
                                    </div>
                                    <div className={classes.blockContent}>
                                        <div className="content-title">
                                            Virus Variants
                                        </div>
                                        <div className="content-small-text">
                                            View Owned Virus Variants
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.blockArrow} onClick={() => goToCategory(6)}>
                                    <i className="fas fa-arrow-circle-right"></i>
                                </div>                                
                            </div>
                            <div className={classes.fullBackImage} style={{ backgroundImage: "url(" + virusBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}/>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                    <Card inventory>
                        <CardBody nopadding>
                            <div className="inventoryBlock">
                                <div className={classes.flexContainer}>
                                    <div className={classes.blockIcon}>
                                        <img src={cityplotIcon} className={classes.imageIcon} alt="Virus Variants" />
                                    </div>
                                    <div className={classes.blockContent}>
                                        <div className="content-title">
                                            My Land Plots
                                        </div>
                                        <div className="content-small-text">
                                            View Owned Land Plots
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.blockArrow} onClick={() => goToCategory(7)}>
                                    <i className="fas fa-arrow-circle-right"></i>
                                </div>                                
                            </div>
                            <div className={classes.fullBackImage} style={{ backgroundImage: "url(" + landPlotsBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}/>
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
};