import {get} from "@/http/axios";
import {post} from "@/http/axios";
import {del} from "@/http/axios";

export function findNavTree(url,params){
    return get(url,params);
}

export function changeMsg(url,params){
    return post(url,params);
}

export function deleteMsg(url,params){
    return del(url,params);
}