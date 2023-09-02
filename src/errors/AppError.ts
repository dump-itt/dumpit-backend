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
