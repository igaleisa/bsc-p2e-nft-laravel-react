export default class HttpService
{
    url = "http://portal.umbrellaproject.localhost/api";
    // url = "https://portal.umbrellaproject.cc/api";

    postData = async(item, added_url, tokenId="") => {
        const token = await localStorage.getItem(tokenId);
        const requestOptions = this.postRequestOptions(token, item);

        return fetch(this.url+"/"+added_url, requestOptions).then(
            response=>response.json()
        )
    }

    patchData = async(item, added_url, tokenId="") => {
        const token = await localStorage.getItem(tokenId);
        const requestOptions = this.patchRequestOptions(token, item);

        return fetch(this.url+"/"+added_url, requestOptions).then(
            response=>response.json()
        )
    }

    deleteData = async(added_url, tokenId="") => {
        const token = await localStorage.getItem(tokenId);
        const requestOptions = this.deleteRequestOptions(token);

        return fetch(this.url+"/"+added_url, requestOptions).then(
            response=>response.json()
        )
    }

    formData = async(item, added_url, tokenId="") => {
        const token = await localStorage.getItem(tokenId);
        const requestOptions = this.formRequestOptions(token, item);

        return fetch(this.url+"/"+added_url, requestOptions).then(
            response=>response.json()
        )
    }

    getData = async(added_url, tokenId="") => {
        const token = await localStorage.getItem(tokenId);
        const requestOptions = this.getRequestOptions(token);

        return fetch(this.url+"/"+added_url, requestOptions).then(
            response=>response.json()
        )
    }

    getRequestOptions = (token) => {
        let requestOptions = {
            method: 'GET',
            headers: {
                'Authorization' : 'Bearer ' + token,
                'Content-type' : 'application/json'
            }
        }
        return requestOptions;
    }

    postRequestOptions = (token, item) => {
        let requestOptions = {
            method: 'POST',
            headers: {
                'Authorization' : 'Bearer ' + token,
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(item)
        }
        return requestOptions;
    }

    patchRequestOptions = (token, item) => {
        let requestOptions = {
            method: 'PATCH',
            headers: {
                'Authorization' : 'Bearer ' + token,
                'Content-type' : 'application/x-www-form-urlencoded'
            },
            body : item.toString(),
            json: true
        }
        return requestOptions;
    }

    deleteRequestOptions = (token, item) => {
        let requestOptions = {
            method: 'DELETE',
            headers: {
                'Authorization' : 'Bearer ' + token,
                'Content-type' : 'application/json'
            }
        }
        return requestOptions;
    }

    formRequestOptions = (token, item) => {
        let requestOptions = {
            method: 'POST',
            headers: {
                'Authorization' : 'Bearer ' + token,
                // 'Content-type' : 'multipart/form-data; boundary=' + item._boundary
            },
            body : item
        }
        return requestOptions;
    }
}