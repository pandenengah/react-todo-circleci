import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "../../../models/todo.interface";
import { RootState } from "../../../app/store";


interface LocalState {
  value: Todo
}

const initialState: LocalState = {
  value: {},
}

export const selectedTodoSlice = createSlice({
  name: 'selectedTodo',
  initialState,
  reducers: {
    setSelectedTodo: (state, action: PayloadAction<Todo>) => {
      state.value = action.payload
    },
  }
})

export const {setSelectedTodo} = selectedTodoSlice.actions
export let getSelectedTodo = (state: RootState) => state.selectedTodo.value
export default selectedTodoSlice.reducer