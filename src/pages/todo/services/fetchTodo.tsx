import axios from "axios";
import toast from "react-hot-toast";
import { env } from "../../../app/env";
import { handleFetchError } from "../../../utils/handle-fetch-error";
import { Todo } from "../../../models/todo.interface";
import { FetchResult } from "../../../models/fetch-result.interface";
import moment from "moment";
import authStorage from "../../auth/services/authStorage";

const getTodos = async (sortType = ""): Promise<FetchResult> => {
    const url = env.apiUrl + 'todos?SortType=' + sortType
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${authStorage.getUserAccessToken()}`
            }
        })
        return {
            rawData: response.data
        }
    }
    catch (e) {
        const errors = handleFetchError(e)
        toast.error(errors.errorMessage)
        return errors
    }
}

const putTodos = async (id: string, body: Todo): Promise<FetchResult> => {
    const url = env.apiUrl + 'todos/' + id
    const formData = new FormData()
    formData.append('Description', body.description + '')
    formData.append('Deadline', moment(body.deadline+'').utc().format())
    formData.append('Done', body.done + '')
    if (body.snapshootImageFile?.length) {
        formData.append('SnapshootImage', body.snapshootImageFile[0])
    }

    try {
        const response = await axios.put(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${authStorage.getUserAccessToken()}`
            },
        })
        return {
            rawData: response.data
        }
    } catch (e) {
        const errors = handleFetchError(e)
        toast.error(errors.errorMessage)
        return errors
    }
}

const postTodos = async (body: Todo): Promise<FetchResult> => {
    const url = env.apiUrl + 'todos'
    const formData = new FormData()
    formData.append('Description', body.description + '')
    formData.append('Deadline', moment(body.deadline+'').utc().format())
    if (body.snapshootImageFile?.length) {
        formData.append('SnapshootImage', body.snapshootImageFile[0])
    }
    try {
        const response = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${authStorage.getUserAccessToken()}`
            },
        })
        return {
            rawData: response.data
        }
    } catch (e) {
        const errors = handleFetchError(e)
        toast.error(errors.errorMessage)
        return errors
    }
}

const deleteTodos = async (id: string): Promise<FetchResult> => {
    const url = env.apiUrl + 'todos/' + id
    try {
        const response = await axios.delete(url,{
            headers: {
                'Authorization': `Bearer ${authStorage.getUserAccessToken()}`
            }
        })
        return {
            rawData: response.data
        }
    } catch (e) {
        const errors = handleFetchError(e)
        toast.error(errors.errorMessage)
        return errors
    }
}

const fetchTodo = {
    getTodos,
    postTodos,
    putTodos,
    deleteTodos
}
export default fetchTodo