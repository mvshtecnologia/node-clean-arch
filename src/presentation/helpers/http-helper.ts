import { ServerError } from '../errors/server-error'
import { HttpResponse } from '../protocols/http'

export const badRequest = (error: Error): HttpResponse | undefined => (
  {
    statusCode: 400,
    body: error
  }
)

export const serverError = (): HttpResponse | undefined => (
  {
    statusCode: 500,
    body: new ServerError()
  }
)

export const ok = (body: any): HttpResponse | undefined => (
  {
    statusCode: 200,
    body: body
  }
)
