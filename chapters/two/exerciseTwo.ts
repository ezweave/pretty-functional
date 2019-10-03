import {
  Observable,
  range,
  zip,
  from
} from 'rxjs'

import {
  map,
  reduce,
  tap
} from 'rxjs/operators'

import {
 ajax, 
 AjaxResponse
} from 'rxjs/ajax'

import { buildGetRequest } from '../../util/jestableAjax'

/**
 * Normally you would not mix Promises in with rxjs,
 * this is done to make it easier to test.
 *  
 * @param n number to fizz buzz to
 */
export const fizzBuzz = (
  n: number 
): Promise<string[]> => new Promise(resolve => {
  const generateN = (
    n: number
  ): Observable<number> => range(1, n)

  const subForN = (
    obs$: Observable<number>,
    n: number,
    substitution: string
  ): Observable<string> => obs$.pipe(
    map(
      x => x % n === 0 ? substitution : ''
    )
  )

  const numbers$: Observable<number> = generateN(15)
  const fizz$: Observable<string> = subForN(numbers$, 3, 'Fizz')
  const buzz$: Observable<string> = subForN(numbers$, 5, 'Buzz')

  zip(
    numbers$,
    fizz$,
    buzz$
  ).pipe(
    map(
      ([n, fizz, buzz]) => fizz + buzz || `${n}`
    ),
    reduce( // note the use of reduce vs scan here
      (results, curr) => results.concat(curr),
      [] 
    )
  ).subscribe(
    resolve
  )
})

/**
 * Take in a sentence and capitalize every nth word. just like you did in Chapter 1!
 * 
 * Only now you need to use an Observable to kick off this party
 * 
 * Remember that a sentence is just an array of
 * words joined by spaces.
 * 
 * Extra hint: you can still use capitalize from lodash
 */
export const capitalizeEveryNthWord = (
  n: number
) => (
  sentence: string
) => new Promise<string>(resolve => from(
    sentence.split(' ')
  ).pipe(
    tap(x => console.log('DO SOMETHING WITH THIS', x))
  ).subscribe(
    resolve
  )
)

/**
 * This is a very easy problem, but I'm leaving less of it filled in.
 * 
 * Similar to one of our examples, I want you to do some clever inner Observable
 * things to generate the chorus to the classic Jawbreaker song "Boxcar"
 * 
 * You will need to setup an account with the genius api and you
 * will need to obtain an access token. https://docs.genius.com/
 * 
 * For extra credit, you can _request_ a token programmatically (see
 * https://docs.genius.com/#/authentication-h1), but the tokens live for a while, so
 * you shouldn't need to for the purposes of this exercise.
 * 
 * NOTE: we're using a utility function I wrote to handle the token and prevent
 * CORS issues when running through jest.  Under the hood it is just the ajax
 * operator with some header love.  It also puts the token in the right spot,
 * but feel free to look at the source.
 */
export const boxcar = () => new Promise<string>(
  (resolve, reject) => ajax(
    buildGetRequest(
      'https://api.genius.com/songs/551669',
      '//put your token here' 
    )
  ).pipe(
   map(({
     response: {
       response: {
         song: {
           media
         }
       }
     }
   }: AjaxResponse) => media[0].url)
  ).subscribe(resolve, reject)
)
