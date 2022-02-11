import { AccountModel } from '../../../domain/model/account'
import { AddAccountModel } from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../../protocols/add-account-repository'
import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface SutTypes{
  sut: DbAddAccount
  encryptStub: EncryptStub
  addAccountRepositoryStub: AddAccountRepositoryStub
}
class EncryptStub implements Encrypter {
  async encrypt (value: string): Promise<string> {
    return 'hashed_password'
  }
}

class AddAccountRepositoryStub implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const fakeAccount: AccountModel = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    return fakeAccount
  }
}

const makeAddAccountStub = (): AddAccountRepositoryStub => {
  return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const encryptStub = makeEncryptStub()
  const addAccountRepositoryStub = makeAddAccountStub()
  const sut = new DbAddAccount(encryptStub, addAccountRepositoryStub)

  return {
    sut,
    encryptStub,
    addAccountRepositoryStub
  }
}

const makeEncryptStub = (): EncryptStub => {
  return new EncryptStub()
}

describe('DbAddAccount Usecase', () => {
  test('should call Encrypter with correct password', async () => {
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const { sut, encryptStub } = makeSut()
    const encryptSpy = jest.spyOn(encryptStub, 'encrypt')
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenLastCalledWith('valid_password')
  })

  test('should Throw Encrypter if Throws', async () => {
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const { sut, encryptStub } = makeSut()
    jest.spyOn(encryptStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promisse = sut.add(accountData)
    await expect(promisse).rejects.toThrow()
  })

  test('should addAccountRepository  with correct values', async () => {
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(accountData)
    expect(addSpy).toHaveBeenLastCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('should Throw AddAccountRepository if Throws', async () => {
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promisse = sut.add(accountData)
    await expect(promisse).rejects.toThrow()
  })

  test('should return AddAccountRepository with correct values', async () => {
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const { sut } = makeSut()

    const account = await sut.add(accountData)
    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    })
  })
})
