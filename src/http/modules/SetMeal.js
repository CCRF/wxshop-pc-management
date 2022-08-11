import {get} from "@/http/axios";
import {post} from "@/http/axios";

export function findSetMeal(url,params){
    return get(url,params);
}

export function deleteById(url,params){
    return post(url,params);
}

export function addMeal(url,params){
    return post(url,params)
}

export function findById(url,params){
    return get(url,params)
}

export function uploadImage(url,params){
    return post(url,params)
}

export function FindImages(url,params){
    return get(url,params)
}
export function deleteFile(url,params){
    return post(url,params)
}