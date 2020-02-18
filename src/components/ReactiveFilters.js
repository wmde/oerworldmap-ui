/* global document */
/* global window */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  ReactiveBase,
  ReactiveList,
  DataSearch,
  MultiDropdownList,
  SelectedFilters,
  ReactiveComponent,
  StateProvider,
} from '@appbaseio/reactivesearch'


import { types } from '../common'
import withI18n from './withI18n'
import withEmitter from './withEmitter'
import ResultList from './ResultList'
import TotalEntries from './TotalEntries'
import TogglePoints from './TogglePoints'
import ShareExport from './ShareExport'
import Link from './Link'
import Calendar from './Calendar'
import ReactiveTypeButtons from './ReactiveTypeButtons'

const timeout = async ms => new Promise(resolve => setTimeout(resolve, ms))

const sizes = [20, 50, 100, 200, 9999]

const getView = (viewHash) => {
  switch (viewHash) {
  case 'map':
    return 'mapView'
  case 'stats':
    return 'statisticsView'
  default:
    return 'listView'
  }
}

const ReactiveFilters = ({
  emitter, translate, elasticsearchConfig, children, iso3166, region, initPins, _self, viewHash,
}) => {
  const [currentSize, setCurrentSize] = useState(20)
  const [view, setView] = useState(getView(viewHash))
  const [isClient, setIsClient] = useState(false)
  const [collapsed, setCollapsed] = useState(true)
  const [showPastEvents, setShowPastEvents] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (isClient) {
    let subFilters = [
      {
        componentId: 'filter.about.keywords',
        dataField: 'about.keywords',
        showMissing: true,
        showSearch: true,
        translate: false,
        size: 100,
      },
      {
        componentId: 'filter.about.availableChannel.availableLanguage',
        dataField: 'about.availableChannel.availableLanguage',
        showSearch: false,
      },
      {
        componentId: 'filter.about.additionalType.@id',
        dataField: 'about.additionalType.@id',
        showSearch: false,
      },
      {
        componentId: 'filter.about.audience.@id',
        dataField: 'about.audience.@id',
        showSearch: false,
      },
      {
        componentId: 'filter.about.primarySector.@id',
        dataField: 'about.primarySector.@id',
        showSearch: false,
      },
      {
        componentId: 'filter.about.secondarySector.@id',
        dataField: 'about.secondarySector.@id',
        showSearch: false,
      },
      {
        componentId: 'filter.about.award',
        dataField: 'about.award',
        showSearch: false,
      },
      {
        componentId: 'filter.about.license.@id',
        dataField: 'about.license.@id',
        showSearch: false,
      },
      {
        componentId: 'filter.about.about.@id',
        dataField: 'about.about.@id',
        showSearch: false,
      },
      {
        componentId: 'filter.about.activityField.@id',
        dataField: 'about.activityField.@id',
        showSearch: false,
      },
    ]

    if (!iso3166 && !subFilters.find(filter => filter.componentId === 'filter.about.location.address.addressCountry')) {
      subFilters.push({
        componentId: 'filter.about.location.address.addressCountry',
        dataField: 'about.location.address.addressCountry',
        showSearch: false,
        title: 'country',
      })
    }

    if (!region && !subFilters.find(filter => filter.componentId === 'filter.about.location.address.addressRegion')) {
      subFilters.push({
        componentId: 'filter.about.location.address.addressRegion',
        dataField: 'about.location.address.addressRegion',
        showSearch: false,
        title: 'filter.feature.properties.location.address.addressRegion',
      })
    }

    const filterIDs = ['q', 'size', 'filter.about.@type'].concat(subFilters.map(filter => filter.componentId))
    subFilters = subFilters.map((filter) => {
      filter.react = {
        and: filterIDs.filter(id => id !== filter.componentId),
      }
      return filter
    })

    return (
      <div
        className="ReactiveFilters"
      >
        <ReactiveBase
          app={elasticsearchConfig.index}
          url={elasticsearchConfig.url}
          className="reactiveBase"
        >

          <section className="filtersHeader">

            <div className="basicFilters">

              <StateProvider
                componentIds={['filter.about.@type']}
                render={({ searchState }) => {
                  const filter = (searchState && searchState['filter.about.@type']
                    && searchState['filter.about.@type'].value && !Array.isArray(searchState['filter.about.@type'].value)
                    && searchState['filter.about.@type'].value) || false

                  let searchPlaceholder = translate('search.entries')
                  if (iso3166) {
                    (filter)
                      ? searchPlaceholder = translate('search.entries.country.filter', {
                        country: translate(region ? `${iso3166}.${region}` : iso3166),
                        filter: translate(filter).toLowerCase(),
                      })
                      : searchPlaceholder = translate('search.entries.country', { country: translate(region ? `${iso3166}.${region}` : iso3166) })
                  } else if (filter) {
                    if (filter === 'Policy') {
                      searchPlaceholder = translate('search.entries.filter.policy')
                    } else {
                      searchPlaceholder = translate('search.entries.filter', {
                        filter: translate(filter),
                      })
                    }
                  }

                  return (
                    <DataSearch
                      className="nameSearch"
                      componentId="q"
                      dataField={['about.name.*', 'about.description.*']}
                      placeholder={searchPlaceholder}
                      URLParams
                      react={{
                        and: filterIDs.filter(id => id !== 'q'),
                      }}
                    />
                  )
                }}
              />

              <TogglePoints initPins={initPins} />

            </div>

            <StateProvider
              componentIds={['filter.about.@type']}
              render={({ searchState }) => {
                const selectedType = (searchState && searchState['filter.about.@type'] && searchState['filter.about.@type'].value) || null

                return (
                  <ReactiveComponent
                    componentId="filter.about.@type"
                    URLParams
                    customQuery={({ selectedValue }) => {
                      let query = {
                        query: {
                          match_all: {},
                        },
                      }

                      if (selectedValue) {
                        query = {
                          query: {
                            term: {
                              'about.@type': selectedValue,
                            },
                          },
                        }
                      }

                      return query
                    }}
                    render={({ setQuery }) => (
                      <ReactiveTypeButtons setQuery={setQuery} selectedType={selectedType} />
                    )}
                  />
                )
              }}
            />

            <div className="controls">
              <TotalEntries className="hidden-mobile" />

              <div className="rightButtons">

                <select
                  value={currentSize}
                  className="btn hidden-mobile"
                  onChange={(e) => {
                    setCurrentSize(e.target.value)
                  }}
                >
                  {sizes.map(size => (
                    <option
                      key={size}
                      value={size}
                    >
                      {size === 9999 ? 'all' : size}
                      &nbsp;
                      {translate('entries / page')}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className={`btn hidden-desktop${showMobileFilters ? ' active' : ''}`}
                  onClick={() => {
                    setShowMobileFilters(!showMobileFilters)
                  }}
                >
                  <i className="fa fa-filter" />
                </button>

                <button
                  disabled={view === 'listView'}
                  type="button"
                  className="btn"
                  onClick={() => {
                    window.location.hash = 'list'
                    setView('listView')
                  }}
                >
                  <i className="fa fa-list" />
                  &nbsp;
                  {translate('main.list')}
                </button>
                <button
                  disabled={view === 'mapView'}
                  type="button"
                  className="btn"
                  onClick={async () => {
                    window.location.hash = 'map'
                    setView('mapView')
                    await timeout(10)
                    emitter.emit('resize')
                  }}
                >
                  <i className="fa fa-map" />
                  &nbsp;
                  {translate('main.map')}
                </button>

                <button
                  disabled={view === 'statisticsView'}
                  type="button"
                  className="btn"
                  onClick={() => {
                    window.location.hash = 'stats'
                    setView('statisticsView')
                  }}
                >
                  <i className="fa fa-pie-chart" />
                  &nbsp;
                  {translate('ClientTemplates.app.statistics')}
                </button>
                <ShareExport
                  _self={_self}
                  _links={{
                    refs: [
                      {
                        uri: 'https://beta.oerworldmap.org/resource/?size=-1&ext=geojson',
                        rel: 'alternate',
                        type: 'application/geo+json',
                      },
                      {
                        uri: 'https://beta.oerworldmap.org/resource/?size=-1&ext=ics',
                        rel: 'alternate',
                        type: 'text/calendar',
                      },
                      {
                        uri: 'https://beta.oerworldmap.org/resource/?size=-1&ext=json',
                        rel: 'alternate',
                        type: 'application/json',
                      },
                      {
                        uri: 'https://beta.oerworldmap.org/resource/?size=-1&ext=csv',
                        rel: 'alternate',
                        type: 'text/csv',
                      },
                    ],
                  }}
                  view={viewHash}
                  embedValue="true"
                />
              </div>
            </div>
          </section>


          <div className={`mainContent ${view}${collapsed ? ' collapsed' : ''}`}>

            <aside className={showMobileFilters ? 'show' : ''}>

              {iso3166 && (
                <div className="FilterBox country">
                  <img
                    className="countryFlag"
                    src={`https://lipis.github.io/flag-icon-css/flags/4x3/${iso3166.toLowerCase()}.svg`}
                    alt={`Flag for ${translate(iso3166)}`}
                  />
                  {region ? (
                    <>
                      <h2>{translate(`${iso3166}.${region}`)}</h2>
                      <Link href={`/country/${iso3166}`} className="closePage">
                        &times;
                      </Link>
                    </>
                  ) : (
                    <>
                      <h2>{translate(iso3166)}</h2>
                      <Link href="/resource/" className="closePage">
                        &times;
                      </Link>
                    </>
                  )}
                </div>
              )}

              <SelectedFilters
                render={(data) => {
                  const applied = Object.keys(data.selectedValues)
                  return (
                    (applied.length > 0
                    && (applied.map(filter => data.selectedValues[filter])
                      .map(f => f.value)
                      .some(value => ((value !== null) && (value.length > 0))))) && (
                      <div className="selectedFilters">
                        <h2>{translate('Filters')}</h2>
                        <ul>
                          {applied.map(filter => (
                            (data.selectedValues[filter].value !== null) && (
                              <li
                                key={`${filter}`}
                                className="selectedFilter"
                              >
                                {(typeof data.selectedValues[filter].value === 'string') ? (
                                  <button
                                    type="button"
                                    onClick={() => data.setValue(filter, null)}
                                  >
                                    <b>{translate(filter)}</b>
                                    :
                                    &nbsp;
                                    {translate(data.selectedValues[filter].value)}
                                  </button>
                                ) : (
                                  data.selectedValues[filter].value.map(value => (
                                    <button
                                      type="button"
                                      key={`${filter}-${value}`}
                                      onClick={() => {
                                        data.setValue(filter, data.selectedValues[filter].value
                                          .filter(v => v !== value))
                                      }}
                                    >
                                      <b>{translate(filter)}</b>
                                      :
                                      &nbsp;
                                      {translate(value)}
                                    </button>
                                  )))}
                              </li>
                            )
                          ))}
                        </ul>
                        <button
                          type="button"
                          className="clearAll"
                          onClick={data.clearValues}
                        >
                          {translate('Clear All')}
                        </button>
                      </div>
                    )
                  )
                }}
              />

              {(view === 'mapView') && (
                <ReactiveComponent
                  componentId="myCountryPicker"
                  defaultQuery={() => {
                    const query = {
                      size: 9999,
                      _source: 'feature.*',
                      query: {
                        bool: {
                          filter: [
                            {
                              exists: {
                                field: 'feature',
                              },
                            },
                          ],
                        },
                      },
                      aggs: {
                        color: {
                          terms: {
                            field: 'feature.properties.location.address.addressCountry',
                          },
                        },
                      },
                    }

                    if (iso3166) {
                      query.query.bool.filter.push({
                        term: {
                          'feature.properties.location.address.addressCountry': iso3166.toUpperCase(),
                        },
                      })
                    }

                    if (region) {
                      query.query.bool.filter.push({
                        term: {
                          'feature.properties.location.address.addressRegion': `${iso3166.toUpperCase()}.${region.toUpperCase()}`,
                        },
                      })
                    }

                    return query
                  }}
                  onData={({ aggregations, data }) => {
                    if (aggregations !== null) {
                      const features = (data && data.map(item => item.feature).filter(el => typeof el !== 'undefined')) || []
                      const agg = (aggregations
                        && aggregations.color && aggregations.color.buckets || [])
                      emitter.emit('mapData', { features, aggregations: agg })
                      const total = features.length
                      emitter.emit('updateCount', total)
                      document.title = `${total} entries - OER World Map`
                    }
                  }}
                  react={{
                    and: filterIDs,
                  }}
                />
              )}

              {subFilters.map(filter => (
                <MultiDropdownList
                  key={filter.dataField}
                  className="FilterBox"
                  {...filter}
                  title={filter.title ? translate(filter.title) : translate(filter.componentId)}
                  renderItem={(label, count) => (
                    <span>
                      <span>{(filter.translate !== false) ? translate(label) : label}</span>
                      &nbsp;
                      <span
                        className="count"
                      >
                        (
                        {count}
                        )
                      </span>
                    </span>
                  )}
                  URLParams
                />
              ))}

            </aside>

            <button
              className="toggleList"
              type="button"
              onClick={() => {
                setCollapsed(!collapsed)
              }}
            >
              <i className={`fa fa-chevron-${collapsed ? 'right' : 'left'}`} />
            </button>

            <div className="right">

              <div
                className="searchResults"
              >
                {(view === 'listView') && (
                  <StateProvider
                    componentIds={['filter.about.@type']}
                    strict={false}
                    render={({ searchState }) => {
                      const eventSelected = (searchState && searchState['filter.about.@type'] && searchState['filter.about.@type'].value === 'Event') || false

                      if (eventSelected) {
                        return (
                          <ReactiveComponent
                            componentId="test"
                            defaultQuery={() => {
                              if (eventSelected) {
                                const query = {
                                  size: 0,
                                  aggs: {
                                    Calendar: {
                                      date_histogram: {
                                        min_doc_count: 1,
                                        field: 'about.startDate',
                                        interval: 'month',
                                      },
                                      aggs: {
                                        'top_hits#about.@id': {
                                          top_hits: {
                                            size: 100,
                                            _source: ['about.@id', 'about.@type', 'about.name', 'about.startDate', 'about.endDate', 'about.location'],
                                          },
                                        },
                                      },
                                    },
                                  },
                                }

                                if (eventSelected && !showPastEvents) {
                                  query.query = {
                                    range: {
                                      'about.startDate': {
                                        gte: 'now/d',
                                      },
                                    },
                                  }
                                }

                                return query
                              }
                            }}
                            react={{
                              and: filterIDs,
                            }}
                            render={({ aggregations }) => {
                              if (aggregations !== null) {
                                const entries = (aggregations
                                  && aggregations.Calendar
                                  && aggregations.Calendar.buckets) || []
                                return (
                                  <>
                                    {eventSelected && (
                                      <div>
                                        <label>
                                          <input
                                            type="checkbox"
                                            value={showPastEvents}
                                            onClick={() => setShowPastEvents(!showPastEvents)}
                                            s
                                            style={{ position: 'relative', top: '2px', marginRight: '10px' }}
                                          />
                                          {translate('Include past events')}
                                        </label>
                                      </div>
                                    )}
                                    <Calendar entries={entries} />
                                  </>
                                )
                              }

                              return <div>Loading...</div>
                            }}
                          />
                        )
                      }

                      return (
                        <ReactiveList
                          className={`listResults${showMobileFilters ? ' hidden-mobile' : ''}`}
                          componentId="SearchResult"
                          title="Results"
                          defaultQuery={() => {
                            const query = {
                              query: {
                                bool: {
                                  filter: [
                                    {
                                      terms: {
                                        'about.@type': types,
                                      },
                                    },
                                    {
                                      exists: {
                                        field: 'about.name',
                                      },
                                    },
                                  ],
                                },
                              },
                            }

                            if (iso3166) {
                              query.query.bool.filter.push({
                                term: {
                                  'feature.properties.location.address.addressCountry': iso3166.toUpperCase(),
                                },
                              })
                            }

                            if (region) {
                              query.query.bool.filter.push({
                                term: {
                                  'feature.properties.location.address.addressRegion': `${iso3166.toUpperCase()}.${region.toUpperCase()}`,
                                },
                              })
                            }

                            return query
                          }}
                          dataField="@type"
                          showResultStats={false}
                          from={0}
                          size={currentSize}
                          pagination
                          loader={(
                            <div className="Loading">
                              <div className="loadingCircle" />
                            </div>
                          )}
                          showLoader
                          react={{
                            and: filterIDs,
                          }}

                          render={({ data, resultStats: { numberOfResults } }) => {
                            const items = data || []
                            emitter.emit('updateCount', numberOfResults)
                            if (typeof document !== 'undefined' && numberOfResults) {
                              document.title = `${numberOfResults} entries - OER World Map`
                            }
                            return <ResultList listItems={items} />
                          }}
                        />
                      )
                    }}
                  />
                )}

                {children}

                <div
                  hidden={view !== 'statisticsView'}
                  className={showMobileFilters ? 'hidden-mobile' : ''}
                >

                  <StateProvider render={({ searchState }) => {
                    const filters = Object.entries(searchState)
                      .filter(([field, { value }]) => field.startsWith('filter.') && value && value.length)
                      .map(([field, { value }]) => `${field}=${encodeURIComponent(JSON.stringify(value))}`)
                      .join('&')

                    // [...document.querySelectorAll('.graphContainer')].forEach((e) => {
                    //   e.style.display = 'none'
                    // })
                    return (
                      <div>
                        {subFilters.map(({ dataField, title, componentId }) => (
                          <div
                            key={dataField}
                            className="graphContainer"
                            // style={{ display: 'none' }}
                          >
                            <h2>{title ? translate(title) : translate(componentId)}</h2>
                            <embed
                              // onLoad={(e) => {
                              //   e.target.parentElement.style.display = 'block'
                              // }}
                              type="image/svg+xml"
                              src={`/stats?field=${dataField}`
                                .concat(searchState.q && searchState.q.value ? `&q=${searchState.q.value}` : '')
                                .concat(filters ? `&${filters}` : '')
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )
                  }}
                  />
                </div>

              </div>

            </div>
          </div>


        </ReactiveBase>
      </div>
    )
  }
  return null
}

ReactiveFilters.propTypes = {
  emitter: PropTypes.objectOf(PropTypes.any).isRequired,
  translate: PropTypes.func.isRequired,
  elasticsearchConfig: PropTypes.shape(
    {
      index: PropTypes.string,
      url: PropTypes.string,
    },
  ).isRequired,
  children: PropTypes.node.isRequired,
  initPins: PropTypes.bool.isRequired,
  iso3166: PropTypes.string,
  region: PropTypes.string,
  _self: PropTypes.string.isRequired,
  viewHash: PropTypes.string,
}

ReactiveFilters.defaultProps = {
  iso3166: '',
  region: null,
  viewHash: null,
}

export default withEmitter(withI18n(ReactiveFilters))
