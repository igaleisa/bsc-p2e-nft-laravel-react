/*eslint-disable*/
import React, { useEffect, } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'; 

import { useUmblCoreContract } from "@/hooks";

// SweetAlert
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormLabel from "@material-ui/core/FormLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Edit from "@material-ui/icons/Edit";

// material ui icons
import Close from "@material-ui/icons/Close";

// core components
import GridContainer from "@/components/Grid/GridContainer.js";
import GridItem from "@/components/Grid/GridItem.js";
import CustomInput from "@/components/CustomInput/CustomInput.js";
import Button from "@/components/CustomButtons/Button.js";
import Card from "@/components/Card/Card.js";
import CardHeader from "@/components/Card/CardHeader.js";
import CardText from "@/components/Card/CardText.js";
import CardIcon from "@/components/Card/CardIcon.js";
import CardBody from "@/components/Card/CardBody.js";
import CardFooter from "@/components/Card/CardFooter.js";
import ImageUpload from "@/components/CustomUpload/ImageUpload.js";
import ImageMultipleUpload from "@/components/CustomUpload/ImageMultipleUpload.js";
import Table from "@/components/Table/Table.js";

// styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "@/assets/jss/material-dashboard-pro-react/views/adminCommonPageStyle.js";
const useStyles = makeStyles(styles);

// service and actions
import { 
  GetTokenTypes, 
  GetObjectCategoriesService, 
  GetObjectRaritiesService,
  GetBadgeTypes,
  GetZoneTypes,
  PostMakePresetService,
  GetPresetData,
  GetPresetItem,
  UpdatePresetItem,
  DeletePresetItem,
} from '@/services/UserServices';
import { LogoutAction } from '@/redux/actions/AuthActions';

export default function PresetPage() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { status, account, } = useSelector((state) => state.userWallet);
  const umblCoreContract = useUmblCoreContract();

  const [accountError, setAccountError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

  const [pageStatus, setPageStatus] = React.useState(0);
  const [presetId, setPresetId] = React.useState(null);
  const [tokenPresetId, setTokenPresetId] = React.useState(null);
  const [presetData, setPresetData] = React.useState([]);
  
  const [tokenTypes, setTokenTypes] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [rarities, setRarities] = React.useState([]);
  const [badgeTypes, setBadgeTypes] = React.useState([]);
  const [zoneTypes, setZoneTypes] = React.useState([]);

  const [tokenType, setTokenType] = React.useState('');
  const [level, setLevel] = React.useState(0);
  const [faction, setFaction] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [rarity, setRarity] = React.useState('');
  const [badgeType, setBadgeType] = React.useState('');
  const [zoneType, setZoneType] = React.useState('');
  const [price, setPrice] = React.useState(0.000);

  const [tokenName, setTokenName] = React.useState("");
  const [tokenNameState, setTokenNameState] = React.useState("");
  const [tokenDescription, setTokenDescription] = React.useState("");
  const [tokenDescriptionState, setTokenDescriptionState] = React.useState("");

  const [tokenThumbnail, setTokenThumbnail] = React.useState(null);
  const [tokenV360, setTokenV360] = React.useState('');
  const [tokenAttributes, setTokenAttributes] = React.useState([]);

  useEffect(() => {
    const checkAccunt = async () => {
      if (!umblCoreContract) {
        setAccountError(true);
        return;
      }

      const ownerAccount = await umblCoreContract.methods
        .owner()
        .call({ from: account });

      if(ownerAccount.toLowerCase() !== account) {
        setAccountError(true);
        showErrorMsg("Please connect with owner account");
      } else {
        setAccountError(false);
      }
    }
    checkAccunt();
  }, [account]);

  useEffect(() => {
    console.log(process.env.MIX_UMBL_CORE_ADDRESS);

    GetTokenTypes().then((res) => {
      if(res.hasOwnProperty('success') && res.success === true) {
        setTokenTypes(res.tokenTypes);
      } else {
        if(res.error === 'token') {
          dispatch(LogoutAction(history));
        }
      }
    }, error => {
    })   
    
    GetObjectCategoriesService().then((res) => {
      if(res.hasOwnProperty('success') && res.success === true) {
        setCategories(res.categories);
      } else {
        if(res.error === 'token') {
          dispatch(LogoutAction(history));
        }
      }
    }, error => {
    }) 

    GetObjectRaritiesService().then((res) => {
      if(res.hasOwnProperty('success') && res.success === true) {
        setRarities(res.rarities);
      } else {
        if(res.error === 'token') {
          dispatch(LogoutAction(history));
        }
      }
    }, error => {
    })

    GetBadgeTypes().then((res) => {
      if(res.hasOwnProperty('success') && res.success === true) {
        setBadgeTypes(res.badgeTypes);
      } else {
        if(res.error === 'token') {
          dispatch(LogoutAction(history));
        }
      }
    }, error => {
    })

    GetZoneTypes().then((res) => {
      if(res.hasOwnProperty('success') && res.success === true) {
        setZoneTypes(res.zoneTypes);
      } else {
        if(res.error === 'token') {
          dispatch(LogoutAction(history));
        }
      }
    }, error => {
    })

    GetPresetData().then((res) => {
      if(res.hasOwnProperty('success') && res.success === true) {
        const presetDataValues = res.presets.map((prop, key) => {
          return [
            prop.preset_id,
            prop.name,
            prop.tokentype.name,
            prop.faction ? prop.faction.name : 'None',
            prop.category ? prop.category.name : 'None',
            prop.rarity ? prop.rarity.name : 'None',
            prop.badgetype ? prop.badgetype.name : 'None',
            prop.zonetype ? prop.zonetype.name : 'None',
            prop.price,
            <div>
              <Button color='success' simple className={classes.actionButton} onClick={() => handleEdit(prop.id)}><Edit className={classes.Edit} />
              </Button><Button color='danger' simple className={classes.actionButton} onClick={() => handleRemove(prop.id)}><Close className={classes.Close} /></Button>
            </div>
          ];
        });
        setPresetData(presetDataValues);
      } else if(res.error === 'token') {
        dispatch(LogoutAction(history));
      }
    });  

  }, [])

  useEffect(() => {
    if(pageStatus === 2 && presetId !== null) {
      GetPresetItem(presetId).then((res) => {
        if(res.hasOwnProperty('success') && res.success === true) {
          let presetDataValue = res.preset;

          setTokenPresetId(presetDataValue.preset_id);
          setTokenType(presetDataValue.tokentype.id);
          setLevel(presetDataValue.level);

          if(presetDataValue.faction) setFaction(presetDataValue.faction.id);
          else setFaction(0);

          if(presetDataValue.category) setCategory(presetDataValue.category.id);
          else setCategory(0);

          if(presetDataValue.rarity) setRarity(presetDataValue.rarity.id);
          else setRarity(0);

          if(presetDataValue.badgetype) setBadgeType(presetDataValue.bagdetype.id);
          else setBadgeType(0);

          if(presetDataValue.zonetype) setZoneType(presetDataValue.zonetype.id);
          else setZoneType(0);

          setPrice(presetDataValue.price);
          setTokenName(presetDataValue.name);
          setTokenDescription(presetDataValue.description);
          setTokenThumbnail(presetDataValue.thumbnail);
          if(presetDataValue.v360) setTokenV360(presetDataValue.v360);
          setTokenAttributes(JSON.parse(presetDataValue.attributes));
        } 
      }); 
    }
  }, [pageStatus]);

  useEffect(() => {
    if(tokenAttributes.length) {      
      for(var i=0; i<10; i++) {
        if(tokenAttributes.length <= i) break;

        var keyId = 'attribute_key_' + (i+1);
        var valueId = 'attribute_value_' + (i+1);
        
        document.getElementById(keyId).value = tokenAttributes[i].trait_type;
        document.getElementById(valueId).value = tokenAttributes[i].value;   
      }   
    }
  }, [tokenAttributes])

  const verifyLength = (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
  }

  const showErrorMsg = (message) => {
    setAlert(
      <SweetAlert
        closeOnClickOutside={false}
        html={true}
        style={{ display: "block", marginTop: "-100px" }}
        title="Error!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.info}
      >
        {message}
      </SweetAlert>
    );
  }

  const showSuccessMsg = (title='Success!', message='', refresh=false) => {
    setAlert(<SweetAlert
        success
        closeOnClickOutside={false}
        style={{ display: "block", marginTop: "-100px" }}
        title={title}
        onConfirm={() => hideAlert(refresh)}
        onCancel={() => hideAlert(refresh)}
        confirmBtnCssClass={classes.button + " " + classes.success}
      >
        {message}
    </SweetAlert>);
  };

  const hideAlert = (refresh=false) => {
    setAlert(null);
    if(refresh) window.location.reload();
  };

  const handleTokenTypeSelect = event => {
    setTokenType(event.target.value);
  }

  const handleFactionSelect = event => {
    setFaction(event.target.value);
  }

  const handleCategorySelect = event => {
    setCategory(event.target.value);
  }

  const handleRaritySelect = event => {
    setRarity(event.target.value);
  }

  const handleBadgeTypeSelect = event => {
    setBadgeType(event.target.value);
  }

  const handleZoneTypeSelect = event => {
    setZoneType(event.target.value);
  }

  const handleTokenThumbnail = file => {
    setTokenThumbnail(file);
  };

  const typeClick = () => {
    if (tokenNameState === "") {
      setTokenNameState("error");
    }
    if (tokenDescriptionState === "") {
      setTokenDescriptionState("error");
    }
  }

  const handleApply = async () => {
    if(validateForm()) {
      if (!umblCoreContract || !status) {
        showErrorMsg("Non-Ethereum browser detected. You should consider trying MetaMask!");
        return;
      }   

      setLoading(true);

      // attributes
      let attributes = [];
      for(var i=0; i<10; i++) {
        var keyId = 'attribute_key_' + (i+1);
        var valueId = 'attribute_value_' + (i+1);

        if(document.getElementById(keyId).value !== '' && document.getElementById(valueId).value !== '') {
          attributes.push({
            trait_type: document.getElementById(keyId).value,
            value: document.getElementById(valueId).value,
          });
        }
      }

      if(pageStatus == 1) {
        const tokenPrice = window.web3.utils.toWei(price.toString(), "Ether");

        const transaction = await umblCoreContract.methods
          .makePreset(0, parseInt(tokenType), parseInt(level), parseInt(faction), parseInt(category), parseInt(rarity), parseInt(badgeType), parseInt(zoneType), tokenPrice)
          .send({ from: account }, (error, transactionHash) => {
            if(transactionHash === undefined) {
              setLoading(false);
              return;
            }
          });

        const returnValues = transaction.events.UmblPresetCreated.returnValues;
        if(returnValues.owner.toLowerCase() !== account) {
          setLoading(false);
          return;
        }

        // make formdata
        let formData = new FormData();
        formData.append('preset_id', parseInt(returnValues.id));
        formData.append('tokenType', tokenType);
        formData.append('level', level);
        formData.append('faction', faction);
        formData.append('category', category);
        formData.append('rarity', rarity);
        formData.append('badgeType', badgeType);
        formData.append('zoneType', zoneType);      
        formData.append('price', price);
        formData.append('name', tokenName);
        formData.append('description', tokenDescription);
        formData.append('thumbnail', tokenThumbnail);
        formData.append('attributes', JSON.stringify(attributes));
        formData.append('v360', tokenV360);
        PostMakePresetService(formData).then((res) => {
          if(res.hasOwnProperty('success') && res.success === true) {
            setLoading(false);              
            const msg = 'New preset was created successfully!';
            showSuccessMsg('Success!', msg, true);
          } else {
            setLoading(false);
            showErrorMsg(res);
            if(res.error === 'token') {
              dispatch(LogoutAction(history));
            }
          }
        }).catch(error => {
          console.log(error);
          showErrorMsg(error);
          setLoading(false);
        });
      } else if(pageStatus == 2) {
        const tokenPrice = window.web3.utils.toWei(price.toString(), "Ether");

        const transaction = await umblCoreContract.methods
          .makePreset(parseInt(tokenPresetId), parseInt(tokenType), parseInt(level), parseInt(faction), parseInt(category), parseInt(rarity), parseInt(badgeType), parseInt(zoneType), tokenPrice)
          .send({ from: account }, (error, transactionHash) => {
            if(transactionHash === undefined) {
              setLoading(false);
              return;
            }
          });

        const returnValues = transaction.events.UmblPresetUpdated.returnValues;
        if(returnValues.owner.toLowerCase() !== account || parseInt(returnValues.id) !== parseInt(tokenPresetId)) {
          setLoading(false);
          return;
        }

        // make formdata
        let formData = new URLSearchParams();
        formData.append('tokenType', tokenType);
        formData.append('level', level);
        formData.append('faction', faction);
        formData.append('category', category);
        formData.append('rarity', rarity);
        formData.append('badgeType', badgeType);
        formData.append('zoneType', zoneType);      
        formData.append('price', price);
        formData.append('name', tokenName);
        formData.append('description', tokenDescription);
        formData.append('thumbnail', tokenThumbnail);
        formData.append('attributes', JSON.stringify(attributes));
        formData.append('v360', tokenV360);
        formData.append('id', presetId);
        UpdatePresetItem(presetId, formData).then((res) => {
          if(res.hasOwnProperty('success') && res.success === true) {
            setLoading(false);              
            const msg = 'Preset was updated successfully!';
            showSuccessMsg('Success!', msg, true);
          } else {
            setLoading(false);
            showErrorMsg(res);
            if(res.error === 'token') {
              dispatch(LogoutAction(history));
            }
          }
        }).catch(error => {
          console.log(error);
          showErrorMsg(error);
          setLoading(false);
        });
      }
    }
  }

  const validateForm = () => {
    var validation = true;
    var errMsg = [];

    typeClick();

    if(tokenType === '') {
      validation = false;
      errMsg.push("Token Type cannot be empty.");
    } 

    if(faction === '') {
      validation = false;
      errMsg.push("Token Faction cannot be empty.");
    } 

    if(category === '') {
      validation = false;
      errMsg.push("Token category cannot be empty.");
    } 

    if(rarity === '') {
      validation = false;
      errMsg.push("Token rarity cannot be empty.");
    } 

    if(badgeType === '') {
      validation = false;
      errMsg.push("Badge Type cannot be empty.");
    } 

    if(zoneType === '') {
      validation = false;
      errMsg.push("Zone Type cannot be empty.");
    } 

    if(price === 0) {
      validation = false;
      errMsg.push("Price cannot be zero.");
    } 

    if(!validation) {
      showMultiErrorMsg(errMsg);
      return false;
    }

    return true;
  }

  const showMultiErrorMsg = (messages) => {
    setAlert(
      <SweetAlert
        closeOnClickOutside={false}
        html={true}
        style={{ display: "block", marginTop: "-100px" }}
        title="Error!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.info}
      >
        {messages.map((data, key) => {
          return (
            <p key={key}>{data}</p>
          )
        })}
      </SweetAlert>
    )
  }

  const successDelete = async (id) => {
    hideAlert();
    setLoading(true);

    if (!umblCoreContract || !status) {
      setLoading(false);
      errMsg = "Non-Ethereum browser detected. You should consider trying MetaMask!";
      showErrorMsg(errMsg);
      return;
    }  

    var delete_preset_id = null;
    await GetPresetItem(id).then((res) => {
      if(res.hasOwnProperty('success') && res.success === true) {
        let presetDataValue = res.preset;

        delete_preset_id = presetDataValue.preset_id;
        console.log(delete_preset_id);
      } 
    });    

    if(delete_preset_id === null) {
      setLoading(false);
      return;
    }

    const transaction = await umblCoreContract.methods
      .deletePreset(parseInt(delete_preset_id))
      .send({ from: account }, (error, transactionHash) => {
        if(transactionHash === undefined) {
          setLoading(false);
          return;
        }
      });

    const returnValues = transaction.events.UmblPresetDeleted.returnValues;
    if(returnValues.owner.toLowerCase() !== account || parseInt(returnValues.id) !== parseInt(delete_preset_id)) {
      setLoading(false);
      return;
    }

    DeletePresetItem(id).then(res => {
      if(res.hasOwnProperty('success') && res.success === true) {
        setLoading(false);
        showSuccessMsg('Deleted!', 'The preset has been deleted.', true);
      } else {
        setLoading(false);
      }
    }).catch(error => {
      setLoading(false);
      showErrorMsg(error);
    });    
  }

  const handleEdit = (id) => {
    setPresetId(id);
    setPageStatus(2);
  };

  const handleRemove = (id) => {
    setAlert(
      <SweetAlert
        warning
        closeOnClickOutside={false}
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => successDelete(id)}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.success}
        cancelBtnCssClass={classes.button + " " + classes.danger}
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
      >
        You will not be able to recover this Preset!
      </SweetAlert>
    );
  };

  const handleAddNew = () => {
    setPageStatus(1);
  };

  const handleCancel = () => {
    setPageStatus(0);
  };



  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>        
        <Card>
          <CardHeader color="info" text>
            <CardText color="info">
              <h4 className={classes.cardTitle + ' ' + classes.cardTitleWhite}>UMBL PRESET</h4>
            </CardText>
          </CardHeader>
          <CardBody>
          {!accountError ? 
            pageStatus == 0 ? 
            (<div className="p20">
              <GridContainer>
                <GridItem xs={12} sm={12} className={classes.addNewItem}>
                  <Button color="info" className={classes.clearButton} onClick={handleAddNew}>
                    Add New
                  </Button>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12}>
                  <Table
                    tableHead={[
                      "#",
                      "Name",
                      "Type",
                      "Faction",
                      "Category",
                      "Rarity",
                      "Badge",
                      "Zone",
                      "Price",
                      "Actions",
                    ]}
                    tableData={presetData}
                    customCellClasses={[classes.center]}
                    customClassesForCells={[7]}
                    customHeadCellClasses={[
                      classes.center
                    ]}
                    customHeadClassesForCells={[7]}
                  />
                </GridItem>
              </GridContainer>
            </div>) : 
            (
            <form className={classes.infoForm}>     
              <GridContainer>
                <GridItem xs={12} sm={3} lg={3}>
                  <FormLabel className={classes.labelHorizontal}>Type</FormLabel>
                </GridItem>
                <GridItem xs={12} sm={9} lg={6}>
                  <FormControl fullWidth className={classes.selectFormControl}>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={tokenType}
                      onChange={handleTokenTypeSelect}
                      inputProps={{
                        name: "tokenType",
                        id: "token_type_select"
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem
                        }}
                      >
                        Choose Type
                      </MenuItem>
                      { tokenTypes.map((data, key) => {
                        return (
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value={data.id}
                            key={key}
                          >
                            {data.name}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} lg={3}></GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={3} lg={3}>
                  <FormLabel className={classes.labelHorizontal}>Level</FormLabel>
                </GridItem>
                <GridItem xs={12} sm={9} lg={6}>
                <FormControl fullWidth className={classes.customInputFormControl}>
                    <CustomInput
                      id="token_level"
                      formControlProps={{
                        fullWidth: true
                      }}
                      value={level}
                      inputProps={{
                        onChange: event => {
                          setLevel(event.target.value);
                        },
                        type: "number",
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} lg={3}></GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={3} lg={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Faction
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={9} lg={6}>
                  <FormControl fullWidth className={classes.selectFormControl}>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={faction}
                      onChange={handleFactionSelect}
                      inputProps={{
                        name: "faction",
                        id: "faction_select"
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem
                        }}
                      >
                        Choose Faction
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value='0'
                      >
                        None
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value='1'
                      >
                        Survivors
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value='2'
                      >
                        Scientists
                      </MenuItem>
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} lg={3}></GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={3} lg={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Category
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={9} lg={6}>
                  <FormControl fullWidth className={classes.selectFormControl}>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={category}
                      onChange={handleCategorySelect}
                      inputProps={{
                        name: "category",
                        id: "category-select"
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem
                        }}
                      >
                        Choose Category
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value='0'
                      >
                        None
                      </MenuItem>
                      { categories.map((data, key) => {
                        return (
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value={data.id}
                            key={key}
                          >
                            {data.name}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} lg={3}></GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={3} lg={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Rarity
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={9} lg={6}>
                  <FormControl fullWidth className={classes.selectFormControl}>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={rarity}
                      onChange={handleRaritySelect}
                      inputProps={{
                        name: "rarity",
                        id: "rarity_select"
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem
                        }}
                      >
                        Choose Rarity
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value='0'
                      >
                        None
                      </MenuItem>
                      { rarities.map((data, key) => {
                        return (
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value={data.id}
                            key={key}
                          >
                            {data.name}
                          </MenuItem>
                        )
                      }) } 
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} lg={3}></GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={3} lg={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    BadgeType
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={9} lg={6}>
                  <FormControl fullWidth className={classes.selectFormControl}>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={badgeType}
                      onChange={handleBadgeTypeSelect}
                      inputProps={{
                        name: "badgeType",
                        id: "badgeType_select"
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem
                        }}
                      >
                        Choose BadgeType
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value='0'
                      >
                        None
                      </MenuItem>
                      { badgeTypes.map((data, key) => {
                        return (
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value={data.id}
                            key={key}
                          >
                            {data.name}
                          </MenuItem>
                        )
                      }) } 
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} lg={3}></GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={3} lg={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    ZoneType
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={9} lg={6}>
                  <FormControl fullWidth className={classes.selectFormControl}>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={zoneType}
                      onChange={handleZoneTypeSelect}
                      inputProps={{
                        name: "zoneType",
                        id: "zonetype_select"
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem
                        }}
                      >
                        Choose ZoneType
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value='0'
                      >
                        None
                      </MenuItem>
                      { zoneTypes.map((data, key) => {
                        return (
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value={data.id}
                            key={key}
                          >
                            {data.name}
                          </MenuItem>
                        )
                      }) } 
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} lg={3}></GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={3} lg={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Price
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={9} lg={6}>
                  <FormControl fullWidth className={classes.customInputFormControl}>
                    <CustomInput
                      id="token_price"
                      formControlProps={{
                        fullWidth: true
                      }}
                      value={price}
                      inputProps={{
                        onChange: event => {
                          setPrice(parseFloat(event.target.value).toFixed(3));
                        },
                        type: "number",
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} lg={3}></GridItem>
              </GridContainer> 
              <GridContainer>
                <GridItem xs={12} sm={3} lg={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Name
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={9} lg={6}>
                  <CustomInput
                    success={tokenNameState === "success"}
                    error={tokenNameState === "error"}
                    id="token_name"
                    value={tokenName ? tokenName : ''}
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (verifyLength(event.target.value, 0)) {
                          setTokenNameState("success");
                        } else {
                          setTokenNameState("error");
                        }
                        setTokenName(event.target.value);
                      },
                      type: "text",
                      endAdornment:
                        tokenNameState === "error" ? (
                          <InputAdornment position="end">
                            <Close className={classes.validationError} />
                          </InputAdornment>
                        ) : (
                          undefined
                        )
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} lg={3}>                  
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={3} lg={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Description
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={9} lg={6}>
                  <CustomInput
                    success={tokenDescriptionState === "success"}
                    error={tokenDescriptionState === "error"}
                    id="token_description"
                    value={tokenDescription ? tokenDescription : ''}
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (verifyLength(event.target.value, 0)) {
                          setTokenDescriptionState("success");
                        } else {
                          setTokenDescriptionState("error");
                        }
                        setTokenDescription(event.target.value);
                      },
                      type: "text",
                      endAdornment:
                        tokenDescriptionState === "error" ? (
                          <InputAdornment position="end">
                            <Close className={classes.validationError} />
                          </InputAdornment>
                        ) : (
                          undefined
                        )
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} lg={3}>                  
                </GridItem>
              </GridContainer>  
              <GridContainer>
                <GridItem xs={12} sm={3} lg={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Thumbnail
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={9} lg={6} className={classes.imageUpload}>
                  <ImageUpload
                    onChange={handleTokenThumbnail}
                    addButtonProps={{
                      color: "rose",
                      round: true
                    }}
                    changeButtonProps={{
                      color: "rose",
                      round: true
                    }}
                    removeButtonProps={{
                      color: "danger",
                      round: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} lg={3}></GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={3} lg={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Attributes
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={9} lg={6}>
                  {[...Array(10)].map((x, i) => (              
                  <GridContainer key={i}>
                    <GridItem xs={12} sm={6}>
                      <CustomInput
                        // labelText={"key_" + (i + 1)}
                        id={"attribute_key_" + (i + 1)}
                        // value={tokenAttributes.length > i ? tokenAttributes[i].trait_type : ''}
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={6}> 
                      <CustomInput
                        // labelText={"value_" + (i + 1)}
                        id={"attribute_value_" + (i + 1)}
                        // value={tokenAttributes.length > i ? tokenAttributes[i].value : ''}
                        formControlProps={{
                          fullWidth: true
                        }}
                      />                 
                    </GridItem>
                  </GridContainer>
                  ))}                  
                </GridItem>
                <GridItem xs={12} sm={12} lg={3}></GridItem>
              </GridContainer>                  
              <GridContainer>
                <GridItem xs={12} sm={3} lg={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    V360
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={9} lg={6}>
                  <CustomInput
                    id="token_v360"
                    value={tokenV360 ? tokenV360 : ''}
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        setTokenV360(event.target.value);
                      },
                      type: "text"
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} lg={3}>                  
                </GridItem>
              </GridContainer>  
              <GridContainer>
                  <GridItem xs={12} sm={12} lg={9} className={classes.gridItemCenter}>
                    <Button color="rose" onClick={handleCancel} style={{ marginRight: '30px'}}>
                      Cancel
                    </Button>
                    <Button color="info" onClick={handleApply}>
                      Apply
                    </Button>
                  </GridItem>
                  <GridItem xs={12} sm={12} lg={3}></GridItem>
                </GridContainer>
            </form>
            ) : 
            (<h4 style={{margin: "30px"}}>Please connect with owner account, and refresh this page again</h4>)}
          </CardBody>
          <CardFooter className={classes.justifyContentCenter}>            
            
          </CardFooter>          
        </Card>        
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        {alert}
      </GridItem>
    </GridContainer>  
  );
};