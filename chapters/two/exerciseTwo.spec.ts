import {
  fizzBuzz, subscribeToWeather, capitalizeEveryNthWord
} from './exerciseTwo'

describe('Exercise Two tests', () => {
  describe('FizzBuzz tests', () => {
    describe('fizzBuzz', () => {
      it('Should meet the specs of FizzBuzz', async (done) => {
        expect.assertions(1)
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
  describe('Capitalize every nth word tests', () => {
    describe('capitalizeEveryNthWord', () => {
      it('Should capitalize every 3rd word', async (done) => {
        expect.assertions(1)
        const value = await capitalizeEveryNthWord(3)(
          'The quick brown fox jumped over the lazy dog.'
        )
        expect(value).toEqual(
          'The quick Brown fox jumped Over the lazy Dog.'
        )
        done()
      })
    })
  })
  describe('subscribeToWeather', () => {
    it('Should get the weather', async (done) => {
      expect.assertions(1)
      jest.setTimeout(60000)
      const results = await subscribeToWeather(80204, 10)
      console.log(results)
      done()
    })
  })
})