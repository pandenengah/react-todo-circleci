import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { Login } from "../../models/login.interface";
import { isObjectEmpty } from "../../utils/object";
import { fetchPostLogin } from "./services/fetchAuth";
import { CSSTransition } from "react-transition-group";
import authStorage from "./services/authStorage";


const validationSchema = yup.object().shape({
  email: yup.string()
    .email('This field must be a valid email')
    .required('This field is required'),
  password: yup.string()
    .min(6, 'This field value must contain minimal 6 characters')
    .required('This field is required'),
})

export const AuthLogin = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {register, handleSubmit, formState: {errors}} = useForm<Login>({
    resolver: yupResolver(validationSchema)
  });

  async function onSubmit(data: Login) {
    setIsSubmitting(true)
    const res = await fetchPostLogin(data)
    setIsSubmitting(false)
    if (!res.hasError) {
      authStorage.setUser(res.rawData)
      navigate('/')
    }
  }

  return (
    <>
      <CSSTransition in={true} classNames="fadeOnlyAppear" appear={true} timeout={500}>
        <main className="max-w-[40em] w-full mx-[auto]">
          <div className="pt-[4.25em] px-[1em] min-h-screen flex flex-col justify-between">
            <div className="mt-[1em]">
              <h1 className="text-[1.5em] font-bold text-purple-900">Login to Your Account</h1>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-[2em]">
                <label className="flex flex-col">
                  <p className="text-[0.875em] text-purple-900">Username</p>
                  <input {...register("email")}
                         type="email"
                         className="mt-[0.5em] px-[0.75em] py-[0.5em] text-[1em] border border-purple-200"/>
                  {(errors?.email?.message) && (
                    <small className="mt-[0.5em] text-[0.75em] text-red-600">
                      {errors?.email?.message}
                    </small>
                  )}
                </label>

                <label className="mt-[1em] flex flex-col">
                  <p className="text-[0.875em] text-purple-900">Password</p>
                  <input {...register("password")}
                         type="password"
                         className="mt-[0.5em] px-[0.75em] py-[0.5em] text-[1em] border border-purple-200"/>
                  {(errors?.password?.message) && (
                    <small className="mt-[0.5em] text-[0.75em] text-red-600">
                      {errors?.password?.message}
                    </small>
                  )}
                </label>

                <div className="mt-[2em]">
                  <button type={((isSubmitting) ? 'button' : 'submit')}
                          className={(isObjectEmpty(errors) ? 'bg-purple-900' : 'bg-[#d8b4fe]') + ' w-full text-[1em] font-medium text-white px-[1em] py-[0.5em]'}>
                    {(!isSubmitting) && (<> Login </>)}
                    {(isSubmitting) && (<> Logged In... </>)}
                  </button>
                </div>

                <div className="mt-[2em]">
                  <p className="text-[0.75em] text-gray-600">
                    Don't have any account?&nbsp;
                    <Link to={'/auth/register'} className="underline text-purple-900 font-bold">Register here</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </main>
      </CSSTransition>
    </>
  )
}