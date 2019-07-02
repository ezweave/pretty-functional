import {
  fibonacciToN,
  fizzBuzz,
  replacer,
  productAll,
  capitalizeEveryNthWord
} from './exerciseOne'

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
  describe('ProductAll tests', () => {
    describe('productAll', () => {
      it('Should make a sensible array of products', () => {
        expect(
          productAll(
            [1, 2, 3],
            [4, 5, 6]
          )
        ).toEqual([4, 10, 18])
      })
      it('Should make a sensible array of products, ' +
        'even with different sized arrays', () => {
        expect(
          productAll(
            [2, 3],
            [4, 5, 6]
          )
        ).toEqual([8, 15, 6])
      })
      it('Should make a sensible array of products, ' +
        'even with different sized arrays', () => {
        expect(
          productAll(
            [2, 3, 7],
            [4, 5]
          )
        ).toEqual([8, 15, 7])
      })
    })
  })
  describe('Capitalize every nth word tests', () => {
    describe('capitalizeEveryNthWord', () => {
      it('Should capitalize every 3rd word', () => {
        expect(
          capitalizeEveryNthWord(3)(
            'The quick brown fox jumped over the lazy dog.'
            )
        ).toEqual(
          'The quick Brown fox jumped Over the lazy Dog.'
        )
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
})