import React from 'react'
import PropTypes from 'prop-types'

import ItemList from './ItemList'
import translate from './translate'
import Pagination from './Pagination'

import '../styles/PagedCollection.pcss'

const PagedCollection = ({ translate, member }) => (
  <section className="PagedCollection pages">
    <div>
      {/* <h1>{translate('PagedCollection.totalItems', { smart_count: member.length })}</h1> */}
      <div className="counter">
        <span className="badge">{member.length}</span> {translate('PagedCollection.results')}
      </div>
      <Pagination current={2} total={member.lenght} />
      <ItemList listItems={member} />
    </div>
  </section>
)

PagedCollection.propTypes = {
  translate: PropTypes.func.isRequired,
  member: PropTypes.arrayOf(PropTypes.any).isRequired
}

export default translate(PagedCollection)
