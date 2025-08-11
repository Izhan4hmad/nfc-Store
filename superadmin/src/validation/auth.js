import * as yup from 'yup'

const Login = yup.object({
  email    : yup.string().email().required(),
  password : yup.string().required(),
})

export { Login }
