import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";

interface LocalState {
  value: string
}

const initialState: LocalState = {
  value: 'asc',
}

export const todoSortTypeSlice = createSlice({
  name: 'todoSortType',
  initialState,
  reducers: {
    setTodoSortType: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    }
  }
})

export const {setTodoSortType} = todoSortTypeSlice.actions
export const getTodoSortType = (state: RootState) => state.todoSortType.value
export default todoSortTypeSlice.reducer