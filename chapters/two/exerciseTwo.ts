import {
  Observable,
  range,
  zip,
  timer
} from 'rxjs'

import {
  map,
  reduce,
  switchMap,
  tap,
  take
} from 'rxjs/operators'

import {
 ajax
} from 'rxjs/ajax'
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

interface WeatherOverview {
 description: string
 icon: string
 id: number
 main: string
}

interface Wind {
 deg: number
 speed:number
}

interface Sun {
 country: string
 id: number
 message: number
 sunrise: number
 sunset: number
 type: number
}

interface Main {
 humidity: number
 pressure: number
 temp: number
 temp_max: number
 temp_min: number
}

interface Coordinates {
 lat: number
 lon: number
}

interface Clouds {
 all: number
}

interface WeatherData {
 base: string
 clouds: Clouds
 cod: number
 coord: Coordinates
 dt: number
 id: number
 main: Main
 name: string
 sys: Sun
 timezone: number
 visibility: number
 weather: WeatherOverview[]
 wind: Wind
}

interface SimplifiedWeatherData {
 location: string
 sunrise: string
 sunset: string
 temperature: string
 time: string
}

const convertUTCSecondsToLocalTime = (
 epochTimeInMS: number
) => {
 const date = new Date(0)
 date.setUTCSeconds(epochTimeInMS)
 return date.toString()
}

const kelvinToF = (
 kelvin: number
) => 9/5 * (kelvin - 273.5)  + 32

export const subscribeToWeather = (
  zipCode: number,
  timeInSeconds: number,
  attempts: number = 5,
  apiKey: string = '' // insert your key here 
 ): Promise<SimplifiedWeatherData[]> => new Promise<SimplifiedWeatherData[]>(
  (resolve, reject) => timer(0, timeInSeconds * 1000).pipe(
   take(attempts),
   tap(x => console.log('Requesting weather data...', x)),
   switchMap(
     x => ajax.getJSON<WeatherData>(
       `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${apiKey}`
     )
   ),
   map(
    ({
     name: location,
     sys: {
       sunrise,
       sunset
     },
     main: {
      temp: degreesKelvin
     }
    }: WeatherData) => ({
      location,
      sunrise: convertUTCSecondsToLocalTime(sunrise),
      sunset: convertUTCSecondsToLocalTime(sunset),
      temperature: kelvinToF(degreesKelvin),
      time: new Date().toString()
    })
  ),
  reduce(
    (results, curr) => results.concat(curr),
    []
   )
  ).subscribe(resolve, reject)
 )
 