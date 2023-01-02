import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { isObjectEmpty } from "../../utils/object";
import { fetchPostRegister } from "./services/fetchAuth";
import { Register } from "../../models/register.interface";
import toast from "react-hot-toast";
import { CSSTransition } from "react-transition-group";


const validationSchema = yup.object().shape({
  email: yup.string()
    .email('This field must be a valid email')
    .required('This field is required'),
  fullName: yup.string()
    .required('This field is required'),
  password: yup.string()
    .min(6, 'This field value must contain minimal 6 characters')
    .required('This field is required'),
})

export const AuthRegister = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {register, handleSubmit, formState: {errors}} = useForm<Register>({
    resolver: yupResolver(validationSchema)
  });

  async function onSubmit(data: Register) {
    setIsSubmitting(true)
    const res = await fetchPostRegister(data)
    setIsSubmitting(false)
    if (!res.hasError) {
      toast.success('Your account is registered successfully. Now you can login')
      navigate('/auth/login', {replace: true})
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
                  <p className="text-[0.875em] text-purple-900">Email</p>
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
                  <p className="text-[0.875em] text-purple-900">Full Name</p>
                  <input {...register("fullName")}
                         type="text"
                         className="mt-[0.5em] px-[0.75em] py-[0.5em] text-[1em] border border-purple-200"/>
                  {(errors?.fullName?.message) && (
                    <small className="mt-[0.5em] text-[0.75em] text-red-600">
                      {errors?.fullName?.message}
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
                    {(!isSubmitting) && (<> Register </>)}
                    {(isSubmitting) && (<> Registering... </>)}
                  </button>
                </div>

                <div className="mt-[2em]">
                  <p className="text-[0.75em] text-gray-600">
                    Already have an account?&nbsp;
                    <Link to={'/auth/login'} className="underline text-purple-900 font-bold">Login now</Link>
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