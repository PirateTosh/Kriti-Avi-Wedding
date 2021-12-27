import {DATA_SAVED,INVALID_LOGIN} from "./actionTypes";



export function dataSavedSuccessfully(data){

    return {

        type: DATA_SAVED,

        payload : data

    }

}

export function invalidLogin(data){

    return {

        type: INVALID_LOGIN,

        payload : data

    }

}