import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import { TodoList } from "../TodoList";
import { Provider } from "react-redux";
import store from "../../../app/store";
import fetchTodo from "../services/fetchTodo";
import { FetchResult } from "../../../models/fetch-result.interface";
import { User } from "../../../models/user.interface";
import authStorage from "../../auth/services/authStorage";

jest.mock("../../auth/services/authStorage")
jest.mock("../services/fetchTodo")

const userMock: User = {
  fullName: "Pande Nengah Purnawan"
}
const todosMock: FetchResult = {
  rawData: [
    {
      id: "5819866c-45a6-48ee-b305-c54d77fc7b91",
      description: "Do Something 1",
      deadline: "2022-12-21T19:56:00Z",
      done: false,
      snapshootImage: ""
    },
    {
      id: "5819866c-45a6-48ee-b305-c54d77fc7b92",
      description: "Do Something 2",
      deadline: "2022-12-22T19:56:00Z",
      done: true,
      snapshootImage: ""
    }
  ]
}
const todosAfterDeleteMock: FetchResult = {
  rawData: [
    {
      id: "5819866c-45a6-48ee-b305-c54d77fc7b92",
      description: "Do Something 2",
      deadline: "2022-12-22T19:56:00Z",
      done: false,
      snapshootImage: ""
    }
  ]
}
const todosAfterUpdateToDoneMock: FetchResult = {
  rawData: [
    {
      id: "5819866c-45a6-48ee-b305-c54d77fc7b91",
      description: "Do Something 1",
      deadline: "2022-12-21T19:56:00Z",
      done: true,
      snapshootImage: ""
    },
    {
      id: "5819866c-45a6-48ee-b305-c54d77fc7b92",
      description: "Do Something 2",
      deadline: "2022-12-22T19:56:00Z",
      done: true,
      snapshootImage: ""
    }
  ]
}
const todosAfterUpdateToUndoneMock: FetchResult = {
  rawData: [
    {
      id: "5819866c-45a6-48ee-b305-c54d77fc7b91",
      description: "Do Something 1",
      deadline: "2022-12-21T19:56:00Z",
      done: false,
      snapshootImage: ""
    },
    {
      id: "5819866c-45a6-48ee-b305-c54d77fc7b92",
      description: "Do Something 2",
      deadline: "2022-12-22T19:56:00Z",
      done: false,
      snapshootImage: ""
    }
  ]
}
const todosDescMock: FetchResult = {
  rawData: [
    {
      id: "5819866c-45a6-48ee-b305-c54d77fc7b92",
      description: "Do Something 2",
      deadline: "2022-12-22T19:56:00Z",
      done: false,
      snapshootImage: ""
    },
    {
      id: "5819866c-45a6-48ee-b305-c54d77fc7b91",
      description: "Do Something 1",
      deadline: "2022-12-21T19:56:00Z",
      done: false,
      snapshootImage: ""
    },
  ]
}
const todosMockEmpty: FetchResult = {
  rawData: []
}

describe('TodoList', () => {
  it('should render user full name', async () => {
    fetchTodo.getTodos = jest.fn().mockResolvedValue(todosMockEmpty)
    authStorage.getUser = jest.fn().mockReturnValue(userMock)

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TodoList/>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(async () => {
      const elm = screen.queryByText(/Pande Nengah Purnawan/i);
      expect(elm).toBeInTheDocument();
    })
  });

  it('should not render list of todo', async () => {
    fetchTodo.getTodos = jest.fn().mockResolvedValue(todosMockEmpty)

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TodoList/>
        </MemoryRouter>
      </Provider>
    );
    await waitFor(async () => {
      const elm = await screen.findByText(/No data/i);
      expect(elm).toBeInTheDocument();
    })
  });

  it('should render list of todo', async () => {
    fetchTodo.getTodos = jest.fn().mockResolvedValue(todosMock)

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TodoList/>
        </MemoryRouter>
      </Provider>
    );
    await waitFor(async () => {
      const elm = await screen.findByText(/Do Something 1/i);
      expect(elm).toBeInTheDocument();
    })
  });

  it('should render more list of todo', async () => {
    fetchTodo.getTodos = jest.fn().mockResolvedValue(todosMock)

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TodoList/>
        </MemoryRouter>
      </Provider>
    );
    await waitFor(async () => {
      const elms = await screen.findAllByText(/Do Something/i);
      expect(elms.length).toBeGreaterThanOrEqual(2);
    })
  });

  it('should render list by asc', async () => {
    fetchTodo.getTodos = jest.fn().mockResolvedValue(todosMock)

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TodoList/>
        </MemoryRouter>
      </Provider>
    );

    let sortText = screen.getByTestId("sortText");
    expect(sortText.textContent).toBe("asc")

    await waitFor(async () => {
      const elms = await screen.findAllByText(/Do Something/i);
      expect(elms[0].textContent).toBe("Do Something 1");
    })
  });

  it('should render list by desc', async () => {
    fetchTodo.getTodos = jest.fn().mockResolvedValue(todosMock)

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TodoList/>
        </MemoryRouter>
      </Provider>
    );

    let sortText = screen.getByTestId("sortText");
    expect(sortText.textContent).toBe("asc")

    fetchTodo.getTodos = jest.fn().mockResolvedValue(todosDescMock)
    const sortBtn = screen.getByTestId("sortBtn");
    fireEvent.click(sortBtn)

    sortText = screen.getByTestId("sortText");
    expect(sortText.textContent).toBe("desc")

    await waitFor(async () => {
      const elms = await screen.findAllByText(/Do Something/i);
      expect(elms[0].textContent).toBe("Do Something 2");
    })
  });

  it('should delete todo', async () => {
    fetchTodo.getTodos = jest.fn().mockResolvedValue(todosMock)

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TodoList/>
        </MemoryRouter>
      </Provider>
    );

    let deleteBtns = await screen.findAllByText(/Delete/i);
    fetchTodo.getTodos = jest.fn().mockResolvedValue(todosAfterDeleteMock)
    fireEvent.click(deleteBtns[0])
    expect(deleteBtns[0].textContent).toContain('Deleting...')

    await waitFor(async () => {
      const elm = await screen.findByText(/Do Something 2/i);
      expect(elm.textContent).toBe('Do Something 2');
    })
  });

  it('should update todo tobe done', async () => {
    fetchTodo.getTodos = jest.fn().mockResolvedValue(todosMock)

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TodoList/>
        </MemoryRouter>
      </Provider>
    );

    let editBtns: HTMLInputElement[] = []
    await waitFor(async () => {
      editBtns = await screen.findAllByTestId("inputForEdit") as HTMLInputElement[];
    })

    fetchTodo.getTodos = jest.fn().mockResolvedValue(todosAfterUpdateToDoneMock)
    fireEvent.click(editBtns[0])

    await waitFor(async () => {
      editBtns = await screen.findAllByTestId("inputForEdit")
      expect(editBtns[0].checked).toBeTruthy()
    })

    const descElms = screen.getAllByTestId("descriptionElm")
    expect(descElms[0]).toHaveClass('line-through')
  });

  it('should update todo tobe undone', async () => {
    fetchTodo.getTodos = jest.fn().mockResolvedValue(todosMock)

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TodoList/>
        </MemoryRouter>
      </Provider>
    );

    let editBtns: HTMLInputElement[] = []
    await waitFor(async () => {
      editBtns = await screen.findAllByTestId("inputForEdit") as HTMLInputElement[];
    })

    fetchTodo.getTodos = jest.fn().mockResolvedValue(todosAfterUpdateToUndoneMock)
    fireEvent.click(editBtns[1])

    await waitFor(async () => {
      editBtns = await screen.findAllByTestId("inputForEdit")
      expect(editBtns[0].checked).toBeFalsy()
    })

    const descElms = screen.getAllByTestId("descriptionElm")
    expect(descElms[0]).not.toHaveClass('line-through')
  });
})