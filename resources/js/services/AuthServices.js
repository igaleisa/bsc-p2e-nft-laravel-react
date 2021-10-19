import HttpService from './HttpService';

export const RegisterUserService = (credentials) => {
    const http = new HttpService();
    let signupUrl = "register";

    return http.postData(credentials, signupUrl).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const LoginUserService = (credentials) => {
    const http = new HttpService();
    let loginUrl = "login";

    return http.postData(credentials, loginUrl).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const LogOutUserService = () => {
    const http = new HttpService();
    let logoutUrl = "logout";
    const tokenId = "user-token";
    return http.getData(logoutUrl, tokenId).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const ForgotPasswordService = (credentials) => {
    const http = new HttpService();
    let resetUrl = "forgot";

    return http.postData(credentials, resetUrl).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}

export const ResetPasswordService = (credentials) => {
    const http = new HttpService();
    let resetUrl = "reset-password";

    return http.postData(credentials, resetUrl).then((data) => {
        console.log(data);
        return data;
    }).catch((error) => {
        return error;;
    })
}