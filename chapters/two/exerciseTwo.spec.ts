import {
  fizzBuzz
} from './exerciseTwo'

describe('Exercise Two tests', () => {
  describe('fizzBuzz', () => {
    it('Should meet the specs of FizzBuzz', async (done) => {
      const results = await fizzBuzz(15)
      expect(results).toEqual(
        [
          "1",
          "2", 
          "Fizz", 
          "4", 
          "Buzz", 
          "Fizz", 
          "7", 
          "8", 
          "Fizz", 
          "Buzz", 
          "11", 
          "Fizz", 
          "13", 
          "14", 
          "FizzBuzz"
        ]
      )
      done()
    })
  })
})