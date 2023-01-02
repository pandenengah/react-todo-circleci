import React, { useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Link } from "react-router-dom";
import { getTodos, setTodos } from "./features/todosSlice";
import { getTodoSortType, setTodoSortType } from "./features/todoSortTypeSlice";
import { pipeDate } from "../../utils/date";
import { setSelectedTodo } from "./features/selectedTodoSlice";
import { Todo } from "../../models/todo.interface";
import { CSSTransition } from "react-transition-group";
import { sleep } from "../../utils/sleep";
import { env } from "../../app/env";
import fetchTodo from "./services/fetchTodo";
import authStorage from "../auth/services/authStorage";
import { useAppDispatch, useAppSelector } from "../../app/hook";

export const TodoList = () => {
  const dispatch = useAppDispatch()
  const todos = useAppSelector(getTodos)
  const sortType = useAppSelector(getTodoSortType)
  const user = authStorage.getUser()

  useEffect(() => {
    fetchTodo.getTodos(sortType).then((res) => dispatch(setTodos(res.rawData)))
  }, [sortType, dispatch]);

  function updateTodoIsDeletingByIndex(index: number, isDeletingValue: boolean) {
    const newTodos = todos.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          isDeleting: isDeletingValue,
        }
      }
      return {...item}
    })
    dispatch(setTodos(newTodos))
  }

  function updateTodoIsDeleteDoneByIndex(index: number, value: boolean) {
    const newTodos = todos.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          isDeleting: true,
          isDeleteDone: value,
        }
      }
      return {...item}
    })
    dispatch(setTodos(newTodos))
  }

  function refreshSortType() {
    if (sortType === 'asc') {
      dispatch(setTodoSortType('desc'))
      return
    }
    dispatch(setTodoSortType('asc'))
  }

  function onClickButtonSort() {
    refreshSortType()
    fetchTodo.getTodos(sortType).then((res) => dispatch(setTodos(res.rawData)))
  }

  async function onChangeCheckBox(todo: Todo) {
    const newTodo = {
      ...todo,
      done: !todo.done,
      snapshootImageFile: undefined,
    }
    await fetchTodo.putTodos(todo.id + '', newTodo)
    fetchTodo.getTodos(sortType).then((res) => dispatch(setTodos(res.rawData)))
  }

  async function onClickDelete(index: number, id: string) {
    updateTodoIsDeletingByIndex(index, true)
    const res = await fetchTodo.deleteTodos(id)
    if (res.hasError) {
      updateTodoIsDeletingByIndex(index, false)
      return
    }
    updateTodoIsDeleteDoneByIndex(index, true)
    await sleep(500)
    fetchTodo.getTodos(sortType).then((res) => dispatch(setTodos(res.rawData)))
  }

  return (
    <>
      <main className="max-w-[40em] w-full mx-[auto]">
        <div className="pt-[4.25em] px-[1em] min-h-screen flex flex-col justify-between">
          <Header withAddButton={true}/>
          <CSSTransition in={true} classNames="fadeOnlyAppear" appear={true} timeout={500}>
            <div>
              <div className="mt-[1em]">
                <p className="text-[1.25em] text-center">Welcome back, {user.fullName}</p>
              </div>
              <div className="mt-[1em] flex items-center space-x-[0.75em]">
                <p className="text-[0.75em] text-purple-900">Sort by date</p>
                <button onClick={onClickButtonSort}
                        data-testid="sortBtn"
                        className="text-[0.75em] font-medium text-purple-900 bg-gray-200 px-[1em] py-[0.5em]">
                  <span className="uppercase" data-testid="sortText">{sortType}</span>
                </button>
              </div>
              {(todos?.length > 0) ? (
                <ul>
                  {todos.map((item, i) => {
                    return (
                      <CSSTransition key={i}
                                     in={!item.isDeleteDone}
                                     classNames="fadeOut"
                                     appear={true}
                                     timeout={500}>
                        <li
                          className="mt-[1em] p-[1em] border border-purple-200 rounded-[0.5em] flex justify-between">
                          <div className="flex items-center space-x-[1em]">
                            <input onChange={() => onChangeCheckBox(item)} className="accent-purple-900"
                                   data-testid="inputForEdit"
                                   type="checkbox"
                                   checked={item.done}/>
                            <figure className="rounded-[0.5em] overflow-hidden">
                              {(!item.snapshootImage) ? (
                                <span className="block w-[4em] h-[4em] bg-gray-100"></span>
                              ) : (
                                <img
                                  src={env.imagePath+item.snapshootImage}
                                  alt="" className="object-cover w-[4em] h-[4em]"/>
                              )}
                            </figure>
                            <div>
                              <p className="text-[0.75em] text-purple-900">{pipeDate(item.deadline + '')}</p>
                              <p data-testid="descriptionElm" className={(item.done ? 'line-through' : '')}>{item.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Link onClick={() => dispatch(setSelectedTodo(item))} to={'/edit/' + item.id}
                                  className="block text-[0.75em] font-medium text-white bg-lime-600 px-[1em] py-[0.5em]">
                              Edit
                            </Link>
                            <button onClick={() => onClickDelete(i, item.id + '')}
                                    className="text-[0.75em] font-medium text-white bg-red-700 px-[1em] py-[0.5em]">
                              {(!item.isDeleting) && (<> Delete </>)}
                              {(item.isDeleting) && (<> Deleting... </>)}
                            </button>
                          </div>
                        </li>
                      </CSSTransition>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-center mt-[3em] text-gray-600">No data</p>
              )}
            </div>
          </CSSTransition>
          <Footer/>
        </div>
      </main>
    </>
  )
}