import React, { useState, useEffect, } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

// @material-ui/core components

// progress bar
import ProgressBar from "@ramonak/react-progress-bar";

// core components
import GridContainer from "@/components/Grid/GridContainer.js";
import GridItem from "@/components/Grid/GridItem.js";
import Button from "@/components/CustomButtons/Button.js";
import Card from "@/components/Card/Card.js";
import CardBody from "@/components/Card/CardBody.js";

import SweetAlert from "react-bootstrap-sweetalert";

// Icons
import commonIcon from "@/assets/img/icons/common.png";
import unCommonIcon from "@/assets/img/icons/uncommon.png";
import uniqueIcon from "@/assets/img/icons/unique.png";

// styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "@/assets/jss/material-dashboard-pro-react/views/commonPageStyle.js";
const useStyles = makeStyles(styles);

// actions
import { LogoutAction } from '@/redux/actions/AuthActions';
import { GetCategoryNameService, GetTokenListService, } from '@/services/UserServices';

// contract
import { useUmblCoreContract, useUmblMarketPlaceContract } from "@/hooks";

import weaponsBanner from "@/assets/img/inventory/weapons-inventory.png";
import armorBanner from "@/assets/img/inventory/armor-inventory.png";
import accesoriesBanner from "@/assets/img/inventory/accesories-inventory.png";
import virusVariantBanner from "@/assets/img/inventory/virus-variant-inventory.png";
import parasitesFungusBanner from "@/assets/img/inventory/parasites-and-fungus-inventory.png";
import virusBanner from "@/assets/img/inventory/virus-inventory.png";
import landPlotsBanner from "@/assets/img/inventory/land-plots-inventory.png";

// Icons
import armorIcon from "@/assets/img/icons/shield.png";
import weaponIcon from "@/assets/img/icons/Gun2.png";
import accesoriesIcon from "@/assets/img/icons/accessory.png";
import virusIcon from "@/assets/img/icons/virus.png";
import paracitesIcon from "@/assets/img/icons/parasites-and-fungus.png";
import variantsIcon from "@/assets/img/icons/variants.png";
import cityplotIcon from "@/assets/img/icons/plot-map.png";

export default function CategoryPage() {
    const history = useHistory();
    const { category } = useParams();
    const classes = useStyles();
    const dispatch = useDispatch();

    const umblCoreContract = useUmblCoreContract();

    // redux state variables
    const { isAuthenticated, isAdmin, } = useSelector((state) => state.userAuth);
    const { status, account, } = useSelector((state) => state.userWallet);

    // local state variables
    const [alert, setAlert] = React.useState(null);
    const [categoryId, setCategoryId] = React.useState(null);
    const [categoryName, setCategoryName] = React.useState('');
    const [tokenCount, setTokenCount] = React.useState(0);
    const [tokenList, setTokenList] = React.useState([]);

    useEffect(() => {
        if(isAdmin && isAuthenticated) {
            history.push('/admin');
        }
        if(!isAuthenticated) {
            dispatch(LogoutAction(history));
        }
    }, [isAdmin, isAuthenticated]); 
    
    useEffect(() => {
        if(category === 'weapons') setCategoryId(1);
        else if(category === 'armor') setCategoryId(2);
        else if(category === 'accesories') setCategoryId(3);
        else if(category === 'virus') setCategoryId(4);
        else if(category === 'paracites') setCategoryId(5);
        else if(category === 'variants') setCategoryId(6);
        else if(category === 'plots') setCategoryId(7);
        else history.push('/inventory');    
        
        if(!status) {
            showErrorMsg('You must connect Metamask');
        }
    }, []);

    useEffect(() => {
        if(categoryId) {
            GetCategoryNameService({categoryId: categoryId}).then(res => {
                if(res.hasOwnProperty('success') && res.success === true) {
                    setCategoryName(res.category);
                } else {
                    if(res.error === 'token') {
                        dispatch(LogoutAction(history));
                    }
                }
            })
        }
    }, [categoryId]);

    useEffect( async () => {
        if(status && account) {
            if (!umblCoreContract) {
                return;
            }
            
            GetTokenListService({address: account.toLowerCase()})
            .then(res => {
                setTokenCount(res.tokenList.length);

                let categoryIndex = 0;
                if(category === 'weapons') {categoryIndex = 1;}
                else if(category === 'armor') {categoryIndex = 2;}
                else if(category === 'accesories') {categoryIndex = 3;}
                else if(category === 'virus') {categoryIndex = 4;}
                else if(category === 'paracites') {categoryIndex = 5;}
                else if(category === 'variants') {categoryIndex = 6;}
                else if(category === 'plots') {categoryIndex = 7;}

                const selectedTokenList = res.tokenList.filter((data) => {
                    if(data.preset.category) {
                        return data.preset.category.id === categoryIndex;
                    } else if(categoryIndex === 7) {
                        if(data.preset.tokentype)
                            return data.preset.tokentype.name === "Zone";
                    }
                });

                setTokenCount(selectedTokenList.length);
                setTokenList(selectedTokenList.map((prop, key) => {
                    return {
                        tokenId: prop.token_id,
                        name: prop.preset.name,
                        description: prop.preset.description,
                        category: prop.preset.category ? prop.preset.category.name : '',
                        faction: prop.preset.faction ? prop.preset.faction.name : '',
                        rarity: prop.preset.rarity ? prop.preset.rarity.id : '',
                        rarityName: prop.preset.rarity ? prop.preset.rarity.name : '',
                        state: prop.state.id,
                        image: prop.preset.thumbnail,
                        attributes: JSON.parse(prop.preset.attributes),
                        health: prop.health
                    };
                }));                
            })
            .catch(err => {
                showErrorMsg(err);
                return;
            });
        }
    }, [status, account])

    const handleBack = () => {
        history.push('/inventory');
    };

    // sweet alert functions
    const hideAlert = () => {
        setAlert(null);
    };

    const handleClick = (tokenId) => {
        console.log(tokenId);
        history.push('/inventory/' + category + '/' + tokenId);
    };

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
    
    const showString = (msg) => {
        const length_limit = 36;
        return msg.length > length_limit ? msg.substring(0, length_limit - 3) + '...' : msg;
    }

    const getBorderColor = (rarity) => {
        if(rarity === 1) return '#cfd8dc';
        else if(rarity === 2) return '#00ff00';
        else if(rarity === 3) return '#0000ff';
        else if(rarity === 4) return '#004d40';
        else if(rarity === 5) return '#2962ff';
        else if(rarity === 6) return '#aa00ff';
        else if(rarity === 7) return '#c51162';
        return '#ffffff';
    };

    const getBackgroundImage = (faction) => {
        if(faction == 'Survivors') return 'url("/images/objects/survivors-object-background.png")';
        if(faction == 'Scientists') return 'url("/images/objects/scientists-object-background.png")';
        return '';
    }

    const getRarityMarker = (rarity) => {
        if(rarity === 1) return 'C';
        else if(rarity === 2) return 'U';
        else if(rarity === 3) return 'N';
        else if(rarity === 4) return 'R';
        else if(rarity === 5) return 'E';
        else if(rarity === 6) return 'L';
        else if(rarity === 7) return 'M';
        return '';
    };

    const getRarityIcon = (rarity) => {
        if(rarity === 1) return commonIcon;
        else if(rarity === 2) return unCommonIcon;
        else if(rarity === 3) return uniqueIcon;
        return null;
    };

    const getRarityText = (rarity) => {
        if(rarity === 1) return 'Common';
        else if(rarity === 2) return 'Uncommon';
        else if(rarity === 3) return 'Unique';
        return null;
    };

    const getCategoryIcon = (id) => {
        if(id === 1) return weaponIcon;
        else if(id === 2) return armorIcon;
        else if(id === 3) return accesoriesIcon;
        else if(id === 4) return virusIcon;
        else if(id === 5) return paracitesIcon;
        else if(id === 6) return variantsIcon;
        else if(id === 7) return cityplotIcon;
        return null;
    };

    const getCategoryBanner = (id) => {
        if(id === 1) return weaponsBanner;
        else if(id === 2) return armorBanner;
        else if(id === 3) return accesoriesBanner;
        else if(id === 4) return virusBanner;
        else if(id === 5) return parasitesFungusBanner;
        else if(id === 6) return virusVariantBanner;
        else if(id === 7) return landPlotsBanner;
        return null;
    };

    const getProgressBarColor = (value) => {
        let health = parseInt(value);

        if(health < 20) return "#ff0000";
        else if(health < 50) return "#ffff00";
        else if(health <= 100) return "#00ff00";
        return "#000000";
    }

    return(
        <div className={classes.container}> 
            <GridContainer justifyContent="center">
                <GridItem xs={12} sm={12} md={12}>
                    <Card transparent>
                        <CardBody style={{ padding: "0"}}>
                            {/* <div className="whiteTitleText">
                                {categoryName}
                            </div>
                            <div className="lightBlueLink" onClick={handleBack}>
                                back
                            </div> */}
                            <div className="inventoryCategoryBlock">
                                <div className={classes.flexContainer}>
                                    <div className={classes.blockIcon}>
                                        <img src={getCategoryIcon(categoryId)} className={classes.imageIcon} alt="Weapon" />
                                    </div>
                                    <div className={classes.blockContent}>
                                        <div className="content-title">
                                            {categoryName}
                                        </div>
                                        {/* <div className="content-small-text">
                                            View Owned Weapons
                                        </div> */}
                                    </div>
                                </div>
                                <div className={classes.blockArrow} onClick={() => handleBack()}>
                                    <i className="fas fa-arrow-circle-left"></i>
                                </div>                                
                            </div>
                            {/* <div className={classes.fullBackImage} style={{ backgroundImage: "url(" + weaponsBanner + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}/> */}
                            <div className={classes.fullBackImage} style={{ backgroundImage: "url(" + getCategoryBanner(categoryId) + ")", backgroundColor: "transparent", backgroundSize: "cover", backgroundPosition: "center" }}/>
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
            { status ? 
            !tokenCount ? (
            <GridContainer justifyContent="center">
                <GridItem xs={12} sm={12} md={12}>
                    <Card inventory>
                        <CardBody nopadding>
                            <div className="emptyBlock">
                                <div className={classes.blockContent}>
                                    <div className="content-title">Empty</div>
                                </div>                           
                            </div>
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
            ) : (
            <GridContainer justifyContent="flex-start">
                {tokenList.map((prop, key) => {
                    return (
                        <GridItem xs={12} sm={6} md={3} key={key}>                            
                            <div className="itemBlock" style={{borderColor: getBorderColor(prop.rarity), backgroundImage: getBackgroundImage(prop.faction) }}>
                                <div className="itemImg">
                                    <img src={process.env.MIX_UMBL_STORAGE_URI + 'thumbnails/' + prop.image} />
                                </div>
                                <div className="itemContent">
                                    <div className="itemName">{showString(prop.name)}</div>                                    
                                    <div className="itemCategory">{prop.category}</div>
                                    <div className="itemBottom">
                                        <div className="itemHealth">HEALTH</div>
                                        <ProgressBar 
                                            completed={prop.health}
                                            bgColor={getProgressBarColor(prop.health)}
                                            className="progress-wrapper"
                                            barContainerClassName="progress-container"
                                            // completedClassName="progress-barCompleted"
                                            labelClassName="progress-label"
                                            />
                                    </div>  
                                </div>
                                <div className="itemAction" onClick={() => handleClick(prop.tokenId)}>
                                    <i className="fas fa-arrow-right"></i>
                                </div>
                                <div className="itemRarity" style={{color: getBorderColor(prop.rarity) }}>
                                    { getRarityIcon(prop.rarity) !== null ? (
                                        <img src={getRarityIcon(prop.rarity)} className={classes.imageIcon} alt={getRarityText(prop.rarity)} />
                                        ) : (<></>) }
                                    {/* {getRarityMarker(prop.rarity)} */}
                                </div>
                            </div>
                        </GridItem>
                    )
                })}               
            </GridContainer>
            ) : null}
            {alert}
        </div>
    );
};