import {configureStore} from '@reduxjs/toolkit'
import todosReducer from "../pages/todo/features/todosSlice";
import todoSortTypeReducer from "../pages/todo/features/todoSortTypeSlice";
import selectedTodoReducer from "../pages/todo/features/selectedTodoSlice";


const store = configureStore({
    reducer: {
        todos: todosReducer,
        todoSortType: todoSortTypeReducer,
        selectedTodo: selectedTodoReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store