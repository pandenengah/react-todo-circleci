import React from 'react';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TodoEdit } from "../TodoEdit";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../../app/store";
import { Todo } from "../../../models/todo.interface";
import * as selectedTodoSlice from "../features/selectedTodoSlice";
import { pipeDateToInputDateTime } from "../../../utils/date";
import moment from "moment/moment";

jest.mock("../services/fetchTodo")

const dateNow = moment().format()
const dateTomorrow = moment().add(1, 'day').format()

const todoMock: Todo = {
  id: "5819866c-45a6-48ee-b305-c54d77fc7b91",
  description: "Do Something 1",
  deadline: "2022-12-21T19:56:00Z",
  done: false,
  snapshootImage: ""
}

describe('TodoEdit', () => {
  it('should render selected todo', async () => {

    // @ts-ignore
    selectedTodoSlice.getSelectedTodo = jest.fn().mockReturnValue(todoMock)

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TodoEdit/>
        </MemoryRouter>
      </Provider>
    )

    const deadlineElm = screen.getByTestId('deadlineInput') as HTMLInputElement
    expect(deadlineElm.value).toBe(pipeDateToInputDateTime(todoMock.deadline+''))

    const descElm = screen.getByTestId('descriptionInput') as HTMLInputElement
    expect(descElm.value).toBe(todoMock.description)

    const isDoneElm = screen.getByTestId('isDoneInput') as HTMLInputElement
    expect(isDoneElm.value).toBe(todoMock.done+'')

  });

  it('should able to type on deadline field', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TodoEdit/>
        </MemoryRouter>
      </Provider>
    )
    const elm = screen.getByTestId('deadlineInput') as HTMLInputElement
    const now = pipeDateToInputDateTime(dateNow)
    fireEvent.change(elm, {target: {value: now}})
    expect(elm.value).toBe(now)
  });

  it('should able to type on description field', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TodoEdit/>
        </MemoryRouter>
      </Provider>
    )
    const elm = screen.getByTestId('descriptionInput') as HTMLInputElement
    const text = 'Do something'
    fireEvent.change(elm, {target: {value: text}})
    expect(elm.value).toBe(text)
  });

  it('should able to select on is-done field', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TodoEdit/>
        </MemoryRouter>
      </Provider>
    )
    const elm = screen.getByTestId('isDoneInput') as HTMLInputElement
    fireEvent.change(elm, {target: {value: true}})
    expect(elm.value).toBe("true")
  });

  it('should render error message', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TodoEdit/>
        </MemoryRouter>
      </Provider>
    )
    const deadlineElm = screen.getByTestId('deadlineInput') as HTMLInputElement
    fireEvent.change(deadlineElm, {target: {value: ''}})

    const descElm = screen.getByTestId('descriptionInput') as HTMLInputElement
    fireEvent.change(descElm, {target: {value: ''}})

    const isDoneElm = screen.getByTestId('isDoneInput') as HTMLInputElement
    fireEvent.change(isDoneElm, {target: {value: ''}})

    const btn = screen.getByText(/Update/i)
    fireEvent.click(btn)

    const errors = await screen.findAllByTestId('errorMsgElm')
    expect(errors.length).toBe(3)
  });

  it('should update todo', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TodoEdit/>
        </MemoryRouter>
      </Provider>
    )

    const deadlineElm = screen.getByTestId('deadlineInput') as HTMLInputElement
    fireEvent.change(deadlineElm, {target: {value: pipeDateToInputDateTime(dateTomorrow)}})

    let btn = screen.getByText(/Update/i)
    fireEvent.click(btn)
    await waitFor(async () => {
      expect(btn.textContent).toContain('Updating...')
    })
  });
});