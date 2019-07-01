import { flow, range, partialRight, map, join } from 'lodash'

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
     i => i % n === 0 ? replacement: i
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
  replacer(5,'Buzz')
 ])

/**
 * Solve this in a functional way.
 * 
 * Be wary of boundary conditions!
 */
export const fibonacciToN: (
  n: number
) => number[] = flow([
  range 
])

/**
 * Take in two arrays (which might not be the same size) and
 * return a new array that is the product of each ith entry.
 */
export const productAll: (
  array1: number[],
  array2: number[]
) => number[] = flow([
  join
])

/**
 * Take in a sentance and capitalize every nth word.
 */
export const capitalizeEveryNthWord = (
  n: number
): (
  sentence: string
) => string => flow([
  i => i
])