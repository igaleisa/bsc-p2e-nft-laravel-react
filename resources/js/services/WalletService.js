import HttpService from './HttpService';

export const WalletNonceService = (account) => {
    const http = new HttpService();
    let postUrl = "user/wallet/nonce";
    const tokenId = "user-token";
    let postData = {
        'address': account.toLowerCase()
    };

    return http.postData(postData, postUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
};

export const WalletAuthService = (account, signature) => {
    const http = new HttpService();
    let postUrl = "user/wallet/auth";
    const tokenId = "user-token";
    let postData = {
        'address': account.toLowerCase(),
        'signature': signature.toLowerCase(),
    };

    return http.postData(postData, postUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
};