import {get,post} from "@/http/axios";

export function findGoods(url,params){
    return get(url,params);
}

export function modifyGoods(url,params){
    return post(url,params);
}