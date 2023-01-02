import axios from "axios";
import toast from "react-hot-toast";
import { env } from "../../../app/env";
import { handleFetchError } from "../../../utils/handle-fetch-error";
import { FetchResult } from "../../../models/fetch-result.interface";
import { Login } from "../../../models/login.interface";
import { Register } from "../../../models/register.interface";


export const fetchPostRegister = async (body: Register): Promise<FetchResult> => {
    const url = env.apiUrl + 'auth/register'
    try {
        const response = await axios.post(url, body)
        return {
            rawData: response.data
        }
    } catch (e) {
        const errors = handleFetchError(e)
        toast.error(errors.errorMessage)
        return errors
    }
}

export const fetchPostLogin = async (body: Login): Promise<FetchResult> => {
    const url = env.apiUrl + 'auth/login'
    try {
        const response = await axios.post(url, body)
        return {
            rawData: response.data
        }
    } catch (e) {
        const errors = handleFetchError(e)
        toast.error(errors.errorMessage)
        return errors
    }
}
