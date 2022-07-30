import {get} from "@/http/axios";
import {del} from "@/http/axios";
import {post} from "@/http/axios";

export function getAll(url,params){
    return get(url,params);
}

export function deleteMsg(url,params){
    return del(url,params);
}

export function addMessage(url,params){
    return post(url,params);
}