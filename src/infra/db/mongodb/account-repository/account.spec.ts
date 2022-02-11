import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account ongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return in account success ', async () => {
    const sut = new AccountMongoRepository()

    const accountData = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    await sut.add(accountData)
    expect(accountData).toBeTruthy()
    expect(accountData.id).toBeTruthy()
    expect(accountData.name).toBe('any_name')
    expect(accountData.email).toBe('any_email')
    expect(accountData.password).toBe('any_password')
  })
})
