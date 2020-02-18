/* global localStorage */

import React from 'react'
import PropTypes from 'prop-types'

import ReactiveMap from './ReactiveMap'
import ReactiveFilters from './ReactiveFilters'

import withEmitter from './withEmitter'

import '../styles/components/ResourceIndex.pcss'

const ReactiveResourceIndex = ({
  mapboxConfig,
  elasticsearchConfig,
  emitter,
  iso3166,
  map,
  _self,
  phrases,
  isEmbed,
  region,
  view,
}) => {
  const home = _self.endsWith('/resource/?features=true')
  const initPins = isEmbed || (typeof localStorage !== 'undefined' && localStorage.getItem('showPins') === 'true')

  return (
    <ReactiveFilters
      iso3166={iso3166}
      region={region}
      _self={_self}
      elasticsearchConfig={elasticsearchConfig}
      initPins={initPins}
      viewHash={view}
    >

      <ReactiveMap
        phrases={phrases}
        emitter={emitter}
        mapboxConfig={mapboxConfig}
        iso3166={iso3166}
        map={map}
        home={home}
        initPins={initPins}
        region={region}
      />
    </ReactiveFilters>
  )
}

ReactiveResourceIndex.propTypes = {
  mapboxConfig: PropTypes.objectOf(PropTypes.any).isRequired,
  iso3166: PropTypes.string,
  emitter: PropTypes.objectOf(PropTypes.any).isRequired,
  map: PropTypes.string,
  _self: PropTypes.string.isRequired,
  phrases: PropTypes.objectOf(PropTypes.any).isRequired,
  isEmbed: PropTypes.bool.isRequired,
  region: PropTypes.string,
  elasticsearchConfig: PropTypes.shape(
    {
      index: PropTypes.string,
      url: PropTypes.string,
    },
  ).isRequired,
  view: PropTypes.string,
}

ReactiveResourceIndex.defaultProps = {
  map: null,
  iso3166: '',
  region: null,
  view: null,
}

export default withEmitter(ReactiveResourceIndex)
