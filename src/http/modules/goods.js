import {get,post} from "@/http/axios";

export function findAllGoods(url,params){
    return get(url,params);
}