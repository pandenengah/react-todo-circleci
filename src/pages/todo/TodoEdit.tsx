import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getSelectedTodo } from "./features/selectedTodoSlice";
import React, { useState } from "react";
import { isObjectEmpty } from "../../utils/object";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { pipeDateToInputDateTime } from "../../utils/date";
import fetchTodo from "./services/fetchTodo";
// import { useSelector } from "react-redux";
import { Todo } from "../../models/todo.interface";
import { CSSTransition } from "react-transition-group";
import { useAppSelector } from "../../app/hook";


const validationSchema = yup.object().shape({
  deadline: yup.date().typeError('This field must be a datetime')
    .min(new Date(), 'This field value must be in the future')
    .required('This field is required'),
  description: yup.string()
    .max(100, 'This field value must be less than 100 characters')
    .required('This field is required'),
  done: yup.boolean()
    .required('This field is required'),
  snapshootImageFile: yup.mixed()
    .test('size', 'This field size must be less than 10KB', (value) => {
      if (!value.length) {
        return true
      }
      return value[0].size <= (10 * 1024)
    })
})

export const TodoEdit: React.FC = () => {
  const navigate = useNavigate()
  const idFromParams = (useParams()).id
  const selectedTodo = useAppSelector(getSelectedTodo)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {register, handleSubmit, formState: {errors}} = useForm<Todo>({
    resolver: yupResolver(validationSchema)
  });

  async function onSubmit(data: Todo) {
    setIsSubmitting(true)
    const res = await fetchTodo.putTodos(idFromParams + '', data)
    if (!res.hasError) {
      navigate('/', {replace: true})
      return
    }

    setIsSubmitting(false)
  }

  return (
    <>
      {(isObjectEmpty(selectedTodo)) && (
        <Navigate to={'/'} />
      )}
      {(!isObjectEmpty(selectedTodo)) && (
          <main className="max-w-[40em] w-full mx-[auto]">
            <div className="pt-[4.25em] px-[1em] min-h-screen flex flex-col justify-between">
              <Header withBackButton={'/'}/>
              <CSSTransition in={true} classNames="fadeOnlyAppear" appear={true} timeout={500}>
                <div className="mt-[1em]">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <label className="flex flex-col">
                      <p className="text-[0.875em] text-purple-900">Deadline</p>
                      <input {...register("deadline")}
                             defaultValue={pipeDateToInputDateTime(selectedTodo?.deadline + '')}
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
                                defaultValue={selectedTodo.description}
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

                    <label className="mt-[1em] flex flex-col">
                      <p className="text-[0.875em] text-purple-900">Is Done?</p>
                      <select {...register('done')}
                              defaultValue={selectedTodo.done + ''}
                              data-testid="isDoneInput"
                              className="mt-[0.5em] px-[0.75em] py-[0.5em] text-[1em] border border-purple-200 bg-white">
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                      {(errors?.done?.message) && (
                        <small className="mt-[0.5em] text-[0.75em] text-red-600" data-testid="errorMsgElm">
                          {errors?.done?.message}
                        </small>
                      )}
                    </label>

                    <div className="mt-[2em]">
                      <button type={((isSubmitting) ? 'button' : 'submit')}
                              className={(isObjectEmpty(errors) ? 'bg-purple-900' : 'bg-[#d8b4fe]') + ' w-full text-[1em] font-medium text-white px-[1em] py-[0.5em]'}>
                        {(!isSubmitting) && (<> Update </>)}
                        {(isSubmitting) && (<> Updating... </>)}
                      </button>
                    </div>
                  </form>
                </div>
              </CSSTransition>
              <Footer/>
            </div>
          </main>
      )}
    </>
  )
}