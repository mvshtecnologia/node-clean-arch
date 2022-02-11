import { AccountModel } from '../../../domain/model/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { InvalidParamError } from '../../errors/invalid-param-error'
import { MissingParamError } from '../../errors/missing-param-error'
import { ServerError } from '../../errors/server-error'
import { EmailValidator } from '../../protocols/email-validator'
import { HttpRequest } from '../../protocols/http'
import { SignUpController } from './signup'

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}
class AddAccountStub implements AddAccount {
  async add (account: AddAccountModel): Promise <AccountModel> {
    const fakeAccount: AccountModel = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    return fakeAccount
  }
}
interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidatorStub
  addAccountStub: AddAccountStub
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

const makeEmailValidator = (): EmailValidator => {
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  return new AddAccountStub()
}

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const httpRequest: HttpRequest = {
      body: {
        // name: 'Oslan Caio',
        email: 'caio.aguiar2528@gmail.com',
        password: '12345'
      }
    }
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new MissingParamError('name'))
  })
})

describe('Signup Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const httpRequest = {
      body: {
        name: 'Oslan Caio',
        // email: 'caio.aguiar2528@gmail.com'
        password: '12345'
      }
    }
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new MissingParamError('email'))
  })
})

describe('Signup Controller', () => {
  test('Should return 400 if no password is provided', async () => {
    const httpRequest = {
      body: {
        name: 'Oslan Caio',
        email: 'caio.aguiar2528@gmail.com'
        // password: '12345'
      }
    }
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new MissingParamError('password'))
  })
})

describe('Signup Controller', () => {
  test('Should return 400 if no email invalid is provided', async () => {
    const httpRequest = {
      body: {
        name: 'Oslan Caio',
        email: 'caio.aguiar228gmail.com',
        password: '12345'
      }
    }
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new InvalidParamError('email'))
  })
})

describe('Signup Controller', () => {
  test('Should call EmailValidator with email correct', async () => {
    const httpRequest = {
      body: {
        name: 'Oslan Caio',
        email: 'caio.aguiar2528@gmail.com',
        password: '12345'
      }
    }
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('caio.aguiar2528@gmail.com')
  })
})

describe('Signup Controller', () => {
  test('Should return 500 if EmailValidator throws', async () => {
    const httpRequest = {
      body: {
        name: 'Oslan Caio',
        email: 'caio.aguiar228gmail.com',
        password: '12345'
      }
    }

    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(500)
    expect(httpResponse?.body).toEqual(new ServerError())
  })
})

describe('Signup Controller', () => {
  test('Should call AddAccount with values', async () => {
    const httpRequest = {
      body: {
        name: 'Oslan Caio',
        email: 'caio.aguiar2528@gmail.com',
        password: '12345'
      }
    }
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'Oslan Caio',
      email: 'caio.aguiar2528@gmail.com',
      password: '12345'
    })
  })
})

describe('Signup Controller', () => {
  test('Should return 500 if AddAccountStub throws', async () => {
    const httpRequest = {
      body: {
        name: 'Oslan Caio',
        email: 'caio.aguiar228gmail.com',
        password: '12345'
      }
    }

    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(500)
    expect(httpResponse?.body).toEqual(new ServerError())
  })
})

describe('Signup Controller', () => {
  test('Should return 200 if AddAccountStub success', async () => {
    const httpRequest = {
      body: {
        name: 'Oslan Caio',
        email: 'caio.aguiar228gmail.com',
        password: '12345'
      }
    }

    const { sut } = makeSut()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse?.statusCode).toBe(200)
    expect(httpResponse?.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    })
  })
})
