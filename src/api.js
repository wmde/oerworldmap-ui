/* global Headers */

import fetch from 'isomorphic-fetch'
import promise from 'es6-promise'
import linkHeader from 'http-link-header'

promise.polyfill()

export class APIError {
  constructor(message, status) {
    this.name = 'APIError'
    this.message = message
    this.status = status
  }
}

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  }
  return Promise.reject(new APIError(`${response.url} returned ${response.statusText}`, response.status))
}

const toJson = response => response.json().then((json) => {
  if (response.headers.has('Link')) {
    json._links = linkHeader.parse(response.headers.get('Link'))
  }
  if (response.headers.has('Location')) {
    json._location = response.headers.get('Location')
  }
  json._self = (new URL(response.url)).href
  json._status = response.statusText
  return json
})

class Api {
  constructor(apiConfig) {
    this.host = apiConfig.host
    this.port = apiConfig.port
    this.scheme = apiConfig.scheme
  }

  // eslint-disable-next-line class-methods-use-this
  fetch(url, options) {
    return fetch(url, options).then(checkStatus).then(toJson)
  }

  post(url, data, headers = new Headers()) {
    headers.set('Content-Type', 'application/json')
    headers.set('Accept', 'application/json')
    return fetch(`${this.scheme}://${this.host}:${this.port}${url}`, {
      headers,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(data),
    }).then(checkStatus)
      .then(toJson)
  }

  get(url, headers = new Headers()) {
    headers.set('Accept', 'application/json')
    return fetch(`${this.scheme}://${this.host}:${this.port}${url}`, {
      headers,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then(checkStatus)
      .then(toJson)
  }

  delete(url, headers = new Headers()) {
    headers.set('Accept', 'application/json')
    return fetch(`${this.scheme}://${this.host}:${this.port}${url}`, {
      headers,
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
    }).then(checkStatus)
      .then(toJson)
  }

  // eslint-disable-next-line class-methods-use-this
  vocab(url) {
    switch (url) {
    case 'https://w3id.org/class/esc/scheme':
      return Promise.resolve({
        member: require('./json/esc.json').hasTopConcept.map(entry => ({ about: entry })),
      })
    case 'https://w3id.org/isced/1997/scheme':
      return Promise.resolve({
        member: require('./json/isced-1997.json').hasTopConcept.map(entry => ({ about: entry })),
      })
    case 'https://capacity-exchange.wmcloud.org/assets/json/licenses.json':
      return Promise.resolve({
        member: require('./json/licenses.json').hasTopConcept.map(entry => ({ about: entry })),
      })
    case 'https://capacity-exchange.wmcloud.org/assets/json/sectors.json':
      return Promise.resolve({
        member: require('./json/sectors.json').hasTopConcept.map(entry => ({ about: entry })),
      })
    case 'https://capacity-exchange.wmcloud.org/assets/json/persons.json':
      return Promise.resolve({
        member: require('./json/persons.json').hasTopConcept.map(entry => ({ about: entry })),
      })
    case 'https://capacity-exchange.wmcloud.org/assets/json/services.json':
      return Promise.resolve({
        member: require('./json/services.json').hasTopConcept.map(entry => ({ about: entry })),
      })
    case 'https://capacity-exchange.wmcloud.org/assets/json/publications.json':
      return Promise.resolve({
        member: require('./json/publications.json').hasTopConcept.map(entry => ({ about: entry })),
      })
    case 'https://capacity-exchange.wmcloud.org/assets/json/organizations.json':
      return Promise.resolve({
        member: require('./json/organizations.json').hasTopConcept.map(entry => ({ about: entry })),
      })
    case 'https://capacity-exchange.wmcloud.org/assets/json/projects.json':
      return Promise.resolve({
        member: require('./json/projects.json').hasTopConcept.map(entry => ({ about: entry })),
      })
    case 'https://capacity-exchange.wmcloud.org/assets/json/activities.json':
      return Promise.resolve({
        member: require('./json/activities.json').hasTopConcept.map(entry => ({ about: entry })),
      })
    case 'https://capacity-exchange.wmcloud.org/assets/json/policies.json':
      return Promise.resolve({
        member: require('./json/policies.json').hasTopConcept.map(entry => ({ about: entry })),
      })
    case 'https://capacity-exchange.wmcloud.org/assets/json/policyTypes.json':
      return Promise.resolve({
        member: require('./json/policyTypes.json').hasTopConcept.map(entry => ({ about: entry })),
      })
    default:
      return Promise.resolve({
        member: [],
      })
    }
  }
}

export default Api
