interface AppErrorProps {
  message: string
  status: number
}

export class AppError {
  constructor(private readonly props: AppErrorProps) {}

  get status() {
    return this.props.status
  }

  get message() {
    return this.props.message
  }
}

export const ResourceNotFoundError = new AppError({
  message: 'Resource not found',
  status: 404,
})

export const AuthenticateError = new AppError({
  message: 'Authenticate error',
  status: 404,
})

export const InvalidPassword = new AppError({
  message: 'Invalid password',
  status: 400,
})

export const UnauthorizedError = new AppError({
  message: 'Unauthorized',
  status: 401,
})
