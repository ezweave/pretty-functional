import {
  flow,
  range,
  partialRight,
  map,
  concat
} from 'lodash'

/**
 * We have to do a little more decoration to make TS happy.
 *
 * Here I just wrap the whole thing in a flow, which is
 * kind of pointless, but because of TS...
 *
 * @param n
 * @param replacement
 */
export const replacer = (
  n: number,
  replacement: string
 ): (
  numbers: (string|number)[]
 ) => (string|number)[] => flow([
   partialRight(
     map,
     i => i % n === 0 ? replacement : i
    )
])

/**
 * We include this as an example of what you should expect.
 *
 * Note that unlike the CodePen example, we have to treat our
 * functions as an array of functions vs a vararg.  Hence the []
 *
 * Also notice how we are guarding against bad values of n.
 *
 * Is there a better way of doing this?
 *
 */
export const fizzBuzz: (
  n: number
 ) => string[] = flow([
  n => n > 0 ? range(1, n + 1) : [],
  replacer(15, 'FizzBuzz'),
  replacer(3, 'Fizz'),
  replacer(5, 'Buzz')
 ])

/**
 * Take in two arrays (which might not be the same size) and
 * return a new array that is the product of each ith entry.
 *
 * Look at the operators in the lodash world that have the keyword
 * 'with'
 */
export const productAll = (
  array1: number[],
  array2: number[]
): number[] => concat(
  array1,
  array2
)

/**
 * Take in a sentence and capitalize every nth word.
 * 
 * Remember that a sentence is just an array of
 * words joined by spaces.
 * 
 * Extra hint: look at capitalize from lodash
 */
export const capitalizeEveryNthWord = (
  n: number
): (
  sentence: string
) => string => flow([
  i => i
])

/**
 * Solve this in a functional way.
 * 
 * There are a few ways of doing this... you might
 * have to use recursion!
 *
 * Be wary of boundary conditions!
 */
export const fibonacciToN: (
  n: number
) => number[] = flow([
  range
])