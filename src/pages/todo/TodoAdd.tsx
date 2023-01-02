import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { isObjectEmpty } from "../../utils/object";
import fetchTodo from "./services/fetchTodo";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Todo } from "../../models/todo.interface";
import { CSSTransition } from "react-transition-group";


const validationSchema = yup.object().shape({
  deadline: yup.date().typeError('This field must be a datetime')
    .min(new Date(), 'This field value must be in the future')
    .required('This field is required'),
  description: yup.string()
    .max(100, 'This field value must be less than 100 characters')
    .required('This field is required'),
  snapshootImageFile: yup.mixed()
    .test('size', 'This field size must be less than 10KB', (value) => {
      if (!value.length) {
        return true
      }
      return value[0].size <= (10 * 1024)
    })
})

export const TodoAdd: React.FC = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {register, handleSubmit, formState: {errors}} = useForm<Todo>({
    resolver: yupResolver(validationSchema)
  });

  async function onSubmit(data: Todo) {
    setIsSubmitting(true)
    const res = await fetchTodo.postTodos(data)
    if (!res.hasError) {
      navigate('/', {replace: true})
      return
    }

    setIsSubmitting(false)
  }

  return (
    <>
      <main className="max-w-[40em] w-full mx-[auto]">
        <div className="pt-[4.25em] px-[1em] min-h-screen flex flex-col justify-between">
          <Header withBackButton={'/'}/>
          <CSSTransition in={true} classNames="fadeOnlyAppear" appear={true} timeout={500}>
            <div className="mt-[1em]">
              <form onSubmit={handleSubmit(onSubmit)}>
                <label className="flex flex-col">
                  <p className="text-[0.875em] text-purple-900">Deadline</p>
                  <input {...register("deadline")}
                         type="datetime-local"
                         data-testid="deadlineInput"
                         className="mt-[0.5em] px-[0.75em] py-[0.5em] text-[1em] border border-purple-200"/>
                  {(errors?.deadline?.message) && (
                    <small className="mt-[0.5em] text-[0.75em] text-red-600" data-testid="errorMsgElm">
                      {errors?.deadline?.message}
                    </small>
                  )}
                </label>

                <label className="mt-[1em] flex flex-col">
                  <p className="text-[0.875em] text-purple-900">Description</p>
                  <textarea {...register("description")}
                            data-testid="descriptionInput"
                            rows={5}
                            className="mt-[0.5em] px-[0.75em] py-[0.5em] text-[1em] border border-purple-200">
                  </textarea>
                  {(errors?.description?.message) && (
                    <small className="mt-[0.5em] text-[0.75em] text-red-600" data-testid="errorMsgElm">
                      {errors?.description?.message}
                    </small>
                  )}
                </label>

                <label className="mt-[1em] flex flex-col">
                  <p className="text-[0.875em] text-purple-900">Snapshoot Image</p>
                  <input {...register("snapshootImageFile")}
                         type="file"
                         className="mt-[0.5em] px-[0.75em] py-[0.5em] text-[1em] border border-purple-200"/>
                  {(errors?.snapshootImageFile?.message) && (
                    <small className="mt-[0.5em] text-[0.75em] text-red-600" data-testid="errorMsgElm">
                      {errors?.snapshootImageFile?.message}
                    </small>
                  )}
                </label>

                <div className="mt-[2em]">
                  <button type={((isSubmitting) ? 'button' : 'submit')}
                          className={(isObjectEmpty(errors) ? 'bg-purple-900' : 'bg-[#d8b4fe]') + ' w-full text-[1em] font-medium text-white px-[1em] py-[0.5em]'}>
                    {(!isSubmitting) && (<> Save </>)}
                    {(isSubmitting) && (<> Saving... </>)}
                  </button>
                </div>
              </form>
            </div>
          </CSSTransition>
          <Footer/>
        </div>
      </main>
    </>
  )
}