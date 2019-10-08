import {
  fizzBuzz, capitalizeEveryNthWord, boxcar
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
  describe('Boxcar tests', () => {
    describe('boxcar', () => {
      it('Get me some data about this song!', async (done) => {
        expect.assertions(1)
        boxcar().then(songData => {
          console.log(songData)
          expect(songData).not.toEqual('http://www.youtube.com/watch?v=37dBq_4TsZI')
          done()
        }).catch(error => {
          console.error(error)
          done()
        })
      })
    })
  })
})