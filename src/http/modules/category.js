import {get,post} from "@/http/axios";

export function findCategory(url,params){
    return get(url,params);
}

export function modifyCategory(url,params){
    return post(url,params);
}