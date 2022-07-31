import {get,post} from "../axios";


export function getOrder(url,params){
    return get(url,params);
}
export function deleteOrder(url,params) {
    return post(url,params)
}
export function modifyOrder(url,params) {
    return post(url,params)
}

export function insertOrder(url,params) {
    return post(url,params)
}

