import {get} from "@/http/axios";

export function getAllCustomer(url){
    return get(url);
}