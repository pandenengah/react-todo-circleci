import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from "../Header";
import { MemoryRouter } from "react-router-dom";
import authStorage from "../../../auth/services/authStorage";

jest.mock("../../../auth/services/authStorage")

describe('Header', () => {
  it('should not render back button', () => {
    render(
      <MemoryRouter>
        <Header/>
      </MemoryRouter>
    );
    const elm = screen?.queryByTestId('backBtn');
    expect(elm).not.toBeInTheDocument();
  });

  it('should render back button', () => {
    render(
      <MemoryRouter>
        <Header withBackButton={'/'}/>
      </MemoryRouter>
    );
    const elm = screen.getByTestId('backBtn');
    expect(elm).toBeInTheDocument();
  });

  it('should not render add button', () => {
    render(
      <MemoryRouter>
        <Header/>
      </MemoryRouter>
    );
    const elm = screen?.queryByTestId('addBtn');
    expect(elm).not.toBeInTheDocument();
  });

  it('should render add button', () => {
    render(
      <MemoryRouter>
        <Header withAddButton={true}/>
      </MemoryRouter>
    );
    const elm = screen.getByTestId('addBtn');
    expect(elm).toBeInTheDocument();
  });

  it('should not render logout button', () => {
    authStorage.isUserHasAccessToken = jest.fn().mockReturnValue(false)

    render(
      <MemoryRouter>
        <Header/>
      </MemoryRouter>
    );
    const elm = screen.queryByTestId('logoutBtn');
    expect(elm).not.toBeInTheDocument();
  });

  it('should render logout button', () => {
    authStorage.isUserHasAccessToken = jest.fn().mockReturnValue(true)

    render(
      <MemoryRouter>
        <Header/>
      </MemoryRouter>
    );
    const elm = screen.queryByTestId('logoutBtn');
    expect(elm).toBeInTheDocument();
  });
})