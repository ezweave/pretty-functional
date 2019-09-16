import {
  Observable,
  range,
  zip
} from 'rxjs'

import {
  map,
  reduce
} from 'rxjs/operators'

/**
 * Normally you would not mix Promises in with rxjs,
 * this is done to make it easier to test.
 *  
 * @param n number to fizz buzz to
 */
export const fizzBuzz = (
  n: number 
): Promise<string[]> => new Promise((resolve, reject) => {
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

