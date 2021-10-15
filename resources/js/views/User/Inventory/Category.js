import React, { useState, useEffect, } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

// @material-ui/core components

// core components
import GridContainer from "@/components/Grid/GridContainer.js";
import GridItem from "@/components/Grid/GridItem.js";
import Button from "@/components/CustomButtons/Button.js";
import Card from "@/components/Card/Card.js";
import CardBody from "@/components/Card/CardBody.js";

import SweetAlert from "react-bootstrap-sweetalert";

// Icons
import armorIcon from "@/assets/img/icons/armorIcon.svg";
import weaponIcon from "@/assets/img/icons/weaponIcon.svg";
import accesoriesIcon from "@/assets/img/icons/accesoriesIcon.svg";
import virusIcon from "@/assets/img/icons/virusIcon.svg";
import paracitesIcon from "@/assets/img/icons/paracitesIcon.svg";
import variantsIcon from "@/assets/img/icons/variantsIcon.svg";

// styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "@/assets/jss/material-dashboard-pro-react/views/commonPageStyle.js";
const useStyles = makeStyles(styles);

// actions
import { LogoutAction } from '@/redux/actions/AuthActions';
import { GetCategoryNameService, GetTokenListService, } from '@/services/UserServices';

// contract
import { useUmblCoreContract, useUmblMarketPlaceContract } from "@/hooks";

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

                const selectedTokenList = res.tokenList.filter((data) => {
                    if(data.preset.category)
                        return data.preset.category.id === categoryIndex;
                });

                setTokenCount(selectedTokenList.length);
                setTokenList(selectedTokenList.map((prop, key) => {
                    return {
                        tokenId: prop.token_id,
                        name: prop.preset.name,
                        description: prop.preset.description,
                        category: prop.preset.category.name,
                        rarity: prop.preset.rarity.id,
                        rarityName: prop.preset.rarity.name,
                        state: prop.state.id,
                        image: prop.preset.thumbnail,
                        attributes: JSON.parse(prop.preset.attributes)
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
        const length_limit = 14;
        return msg.length > length_limit ? msg.substring(0, length_limit - 3) + '...' : msg;
    }

    const getBorderColor = (rarity) => {
        if(rarity === 1) return '#cfd8dc';
        else if(rarity === 2) return '#e65100';
        else if(rarity === 3) return '#aeea00';
        else if(rarity === 4) return '#004d40';
        else if(rarity === 5) return '#2962ff';
        else if(rarity === 6) return '#aa00ff';
        else if(rarity === 7) return '#c51162';
        return '#ffffff';
    };

    const getRarityMarker = (rarity) => {
        if(rarity === 1) return 'C';
        else if(rarity === 2) return 'U';
        else if(rarity === 3) return 'N';
        else if(rarity === 4) return 'R';
        else if(rarity === 5) return 'E';
        else if(rarity === 6) return 'L';
        else if(rarity === 7) return 'M';
        return 'K';
    };

    return(
        <div className={classes.container}> 
            <GridContainer justifyContent="center">
                <GridItem xs={12} sm={12} md={12}>
                    <Card transparent>
                        <CardBody>
                            <div className="whiteTitleText">
                                {categoryName}
                            </div>
                            <div className="lightBlueLink" onClick={handleBack}>
                                back
                            </div>
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
                            <div className="itemBlock" style={{borderColor: getBorderColor(prop.rarity) }}>
                                <div className="itemImg">
                                    <img src={process.env.MIX_UMBL_STORAGE_URI + 'thumbnails/' + prop.image} />
                                </div>
                                <div className="itemContent">
                                    <div className="itemName">{showString(prop.name)}</div>                                    
                                    <div className="itemBottom">
                                        <div className="itemCategory">{prop.category}</div>
                                    </div>  
                                </div>
                                <div className="itemAction" onClick={() => handleClick(prop.tokenId)}>
                                    <i className="fas fa-arrow-right"></i>
                                </div>
                                <div className="itemRarity" style={{color: getBorderColor(prop.rarity) }}>{getRarityMarker(prop.rarity)}</div>
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