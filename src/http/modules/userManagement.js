import {del} from "@/http/axios";
import {get} from "@/http/axios";
import {post} from "@/http/axios";



export function deleteUser(url){
    return del(url);
}

export function findAllUser(url){
    return get(url);
}

export function findAllRole(url){
    return get(url);
}

export function findUserByName(url){
    return get(url);
}

export function findById(url){
    return get(url);
}

export function updateUser(url,params){
    return post(url,params);
}

export function findUserByMsg(url){
    return get(url);
}

export function insertUser(url,params){
    return post(url,params);
}

export function deleteImg(url){
    return del(url);
}