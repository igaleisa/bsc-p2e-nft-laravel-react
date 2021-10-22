import HttpService from './HttpService';

export const GetUserListService = () => {
    const http = new HttpService();
    let signupUrl = "admin/users";
    const tokenId = "user-token";

    return http.getData(signupUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const GetObjectCategoriesService = () => {
    const http = new HttpService();
    let getUrl = "categories";
    const tokenId = "user-token";

    return http.getData(getUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const GetObjectRaritiesService = () => {
    const http = new HttpService();
    let getUrl = "rarities";
    const tokenId = "user-token";

    return http.getData(getUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const PostMintTokensService = (postData) => {
    const http = new HttpService();
    let postUrl = "admin/mint";
    const tokenId = "user-token";

    return http.formData(postData, postUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const AssignTokenService = (postData) => {
    const http = new HttpService();
    let postUrl = "admin/assign";
    const tokenId = "user-token";

    return http.postData(postData, postUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const GetTokenInformationService = (id) => {
    const http = new HttpService();
    let getUrl = "admin/token/" + id;
    const tokenId = "user-token";

    return http.getData(getUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const GetCratesService = () => {
    const http = new HttpService();
    let getUrl = "admin/crates";
    const tokenId = "user-token";

    return http.getData(getUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const GetRaritiesService = () => {
    const http = new HttpService();
    let getUrl = "rarities";
    const tokenId = "user-token";

    return http.getData(getUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const AddNewCrateService = (crate) => {
    const http = new HttpService();
    let postUrl = "admin/crates";
    const tokenId = "user-token";

    return http.formData(crate, postUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const GetCrateService = (id) => {
    const http = new HttpService();
    let getUrl = "admin/crates/" + id;
    const tokenId = "user-token";

    return http.getData(getUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const UpdateCrateService = (id, crateData) => {
    const http = new HttpService();
    let patchUrl = "admin/crates/" + id;
    const tokenId = "user-token";

    return http.patchData(crateData, patchUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const DeleteCrateService = (id) => {
    const http = new HttpService();
    let deleteUrl = "admin/crates/" + id;
    const tokenId = "user-token";

    return http.deleteData(deleteUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const GetUserCountService = () => {
    const http = new HttpService();
    let getUrl = "admin/usercount";
    const tokenId = "user-token";

    return http.getData(getUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const GetCrateCountService = () => {
    const http = new HttpService();
    let getUrl = "admin/cratecount";
    const tokenId = "user-token";

    return http.getData(getUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const GetObjectCountService = () => {
    const http = new HttpService();
    let getUrl = "admin/objectcount";
    const tokenId = "user-token";

    return http.getData(getUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const GetLoginCountService = () => {
    const http = new HttpService();
    let getUrl = "admin/logincount";
    const tokenId = "user-token";

    return http.getData(getUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const GetCategoryNameService = (data) => {
    const http = new HttpService();
    let postUrl = "user/category/name";
    const tokenId = "user-token";

    return http.postData(data, postUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const GetTokenListService = (data) => {
    const http = new HttpService();
    let postUrl = "user/token/list";
    const tokenId = "user-token";

    return http.postData(data, postUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const GetUserAccountProfileService = (data) => {
    const http = new HttpService();
    let postUrl = "user/account/profile";
    const tokenId = "user-token";

    return http.postData(data, postUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const GetCrateInfoService = (id) => {
    const http = new HttpService();
    let getUrl = "user/crates/" + id;
    const tokenId = "user-token";

    return http.getData(getUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;
    })
}

export const GetTokenTypes = () => {
    const http = new HttpService();
    let getUrl = 'tokentypes';
    const tokenId = "user-token";

    return http.getData(getUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;
    })
}

export const GetBadgeTypes = () => {
    const http = new HttpService();
    let getUrl = 'badgetypes';
    const tokenId = "user-token";

    return http.getData(getUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;
    })
}

export const GetZoneTypes = () => {
    const http = new HttpService();
    let getUrl = 'zonetypes';
    const tokenId = "user-token";

    return http.getData(getUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;
    })
}

export const PostMakePresetService = (postData) => {
    const http = new HttpService();
    let postUrl = "admin/preset";
    const tokenId = "user-token";

    return http.formData(postData, postUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const GetPresetData = () => {
    const http = new HttpService();
    let getUrl = "admin/preset";
    const tokenId = "user-token";

    return http.getData(getUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const GetPresetItem = (id) => {
    const http = new HttpService();
    let getUrl = "admin/preset/" + id;
    const tokenId = "user-token";

    return http.getData(getUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const UpdatePresetItem = (id, presetData) => {
    const http = new HttpService();
    let patchUrl = "admin/preset/" + id;
    const tokenId = "user-token";

    return http.patchData(presetData, patchUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const DeletePresetItem = (id) => {
    const http = new HttpService();
    let deleteUrl = "admin/preset/" + id;
    const tokenId = "user-token";

    return http.deleteData(deleteUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}


export const AddBatchTokenList = (data) => {
    const http = new HttpService();
    let postUrl = "share/token/register";
    const tokenId = "user-token";

    return http.postData(data, postUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}
export const AssignTokenListData = (data) => {
    const http = new HttpService();
    let postUrl = "admin/token/assign";
    const tokenId = "user-token";

    return http.postData(data, postUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}


export const RegisterCratePayment = (data) => {
    const http = new HttpService();
    let postUrl = "user/payment/crate";
    const tokenId = "user-token";

    return http.postData(data, postUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const ResendVerificationEmail = () => {
    const http = new HttpService();
    let getUrl = "user/email/resend";
    const tokenId = "user-token";

    return http.getData(getUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const SwitchTfaSetting = () => {
    const http = new HttpService();
    let postUrl = "user/account/tfa";
    const tokenId = "user-token";

    return http.postData({}, postUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const GetCratePresetService = (data) => {
    const http = new HttpService();
    let postUrl = "user/crates/buy";
    const tokenId = "user-token";

    return http.postData(data, postUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}
