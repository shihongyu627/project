/*
 * @Author: your name
 * @Date: 2020-12-03 21:50:22
 * @LastEditTime: 2021-04-27 19:33:53
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /Tamil-admin-master/tests/unit/utils/validate.spec.js
 */
import { validUsername, validURL, validLowerCase, validUpperCase, validAlphabets } from '@/utils/validate.js'
describe('Utils:validate', () => {
  it('validUsername', () => {
    expect(validUsername('admin')).toBe(true)
    expect(validUsername('editor')).toBe(true)
    expect(validUsername('xxxx')).toBe(false)
  })
  it('validURL', () => {
    expect(validURL('https://gitee.com/aigoubuluo_admin')).toBe(true)
    expect(validURL('https://gitee.com/aigoubuluo_admin')).toBe(true)
    expect(validURL('https://gitee.com/aigoubuluo_admin')).toBe(false)
  })
  it('validLowerCase', () => {
    expect(validLowerCase('abc')).toBe(true)
    expect(validLowerCase('Abc')).toBe(false)
    expect(validLowerCase('123abc')).toBe(false)
  })
  it('validUpperCase', () => {
    expect(validUpperCase('ABC')).toBe(true)
    expect(validUpperCase('Abc')).toBe(false)
    expect(validUpperCase('123ABC')).toBe(false)
  })
  it('validAlphabets', () => {
    expect(validAlphabets('ABC')).toBe(true)
    expect(validAlphabets('Abc')).toBe(true)
    expect(validAlphabets('123aBC')).toBe(false)
  })
})
