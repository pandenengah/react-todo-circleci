import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "../../../models/todo.interface";
import { RootState } from "../../../app/store";


interface LocalState {
  value: Array<Todo>
}

const initialState: LocalState = {
  value: [],
}

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Array<Todo>>) => {
      state.value = action.payload
    },
  }
})

export const {setTodos} = todosSlice.actions
export const getTodos = (state: RootState) => state.todos.value
export default todosSlice.reducer