import * as axios from "axios";

let http = axios.create({
    baseURL: "http://localhost:8088/",
    withCredentials: false,
    headers: {
        "Content-Type": "application/json;charset=utf-8",
    },
});

function apiAxios(method, url, params, response) {
    http({
        method: method,
        url: url,
        data: method === "POST" || method === "PUT" ? params : null,
        params: method === "GET" || method === "DELETE" ? params : null,
    })
        .then(function (res) {
            response(res);
        })
        .catch(function (err) {
            response(err);
        });
}

export default {
    get: function (url, params, response) {
        return apiAxios("GET", url, params, response);
    },
    post: function (url, params, response) {
        return apiAxios("POST", url, params, response);
    },
    put: function (url, params, response) {
        return apiAxios("PUT", url, params, response);
    },
    delete: function (url, params, response) {
        return apiAxios("DELETE", url, params, response);
    },
};
