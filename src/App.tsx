import React from 'react';
import './App.css';
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import { TodoList } from "./pages/todo/TodoList";
import { TodoAdd } from "./pages/todo/TodoAdd";
import { TodoEdit } from "./pages/todo/TodoEdit";
import { AuthLogin } from "./pages/auth/AuthLogin";
import { UserUnauthenticated } from "./guards/UserUnauthenticated";
import { UserAuthenticated } from "./guards/UserAuthenticated";
import { AuthRegister } from "./pages/auth/AuthRegister";

function App() {
  return (
    <>
      <Routes>
        <Route path="/auth/*" element={
          <UserUnauthenticated>
            <Routes>
              <Route path="login" element={<AuthLogin/>}></Route>
              <Route path="register" element={<AuthRegister/>}></Route>
              <Route path="*" element={
                <Navigate to={'login'} replace={true}/>
              }></Route>
            </Routes>
          </UserUnauthenticated>
        }></Route>
        <Route path="/*" element={
          <UserAuthenticated>
            <Routes>
              <Route path="" element={<TodoList/>}></Route>
              <Route path="add" element={<TodoAdd/>}></Route>
              <Route path="edit/:id" element={<TodoEdit/>}></Route>
            </Routes>
          </UserAuthenticated>
        }></Route>
      </Routes>
      <Toaster position="top-right"/>
    </>
  );
}

export default App;
