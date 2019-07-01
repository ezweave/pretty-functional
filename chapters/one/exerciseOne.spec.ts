import { fibonacciToN, fizzBuzz, replacer } from './exerciseOne'

describe('Excercise one tests', () => {
  describe('FizzBuzz tests', () => {
    describe('replacer', () => {
      const fizzBuzzReplacer = replacer(15, 'FizzBuzz')

      it('Should return \'FizzBuzz\' for n % 15 === 0', () => {
        expect(
          fizzBuzzReplacer([15])
        ).toEqual(['FizzBuzz'])
      })
      it('Should handle an empty array', () => {
        expect(
          fizzBuzzReplacer([])
        ).toEqual([])
      })
    })
    describe('fizzBuzz', () => {
      it('Should return the correct values up to 20', () => {
        expect(
          fizzBuzz(20)
        ).toEqual([
          1, 
          2, 
          'Fizz', 
          4, 
          'Buzz', 
          'Fizz', 
          7, 
          8, 
          'Fizz', 
          'Buzz', 
          11, 
          'Fizz', 
          13, 
          14, 
          'FizzBuzz', 
          16, 
          17, 
          'Fizz', 
          19, 
          'Buzz'
        ])
      })
      it('Should handle bad inputs gracefully', () => {
        expect(
          fizzBuzz(-1)
        ).toEqual([])
      })
    })
  })
  describe('Fibonacci tests', () => {
    describe('fibonacciToN', () => {
      it('Should calculate a Fibonacci series to 10', () => {
        expect(
          fibonacciToN(10)
        ).toEqual(
          [1, 2, 3, 5, 8]
        )
      })
      it('Should handle bad inputs', () => {
        expect(
          fibonacciToN(-1)
        ).toEqual([])
      })
    })
  })
  describe('ProductAll tests', () => {
    describe('productAll', () => {

    })
  })
  describe('Capitalize every nth word tests', () => {
    describe('capitalizeEveryNthWord', () => {

    })
  })
})