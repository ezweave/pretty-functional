import { Observable } from 'rxjs'
import { XMLHttpRequest } from 'xmlhttprequest'
import { AjaxResponse, ajax, AjaxRequest } from 'rxjs/ajax'

export const createXHR = () => new XMLHttpRequest()

export const buildGetRequest = (
  url: string,
  token: string
): AjaxRequest => ({
  url,
  crossDomain: true,
  withCredentials: true,
  headers : {
    'Content-Type': 'application-json',
     Authorization: `Bearer ${token}`
  },
  method: 'GET',
  createXHR
})


export const ajaxGet = (
  url: string,
  token: string
): Observable<AjaxResponse> => ajax(
  buildGetRequest(url, token)
)
