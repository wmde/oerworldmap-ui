/* global document */
/* global confirm */
/* global _paq */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { uniqueId } from 'lodash'

import JsonSchema from './JSONPointerForm/JsonSchema'
import Form from './JSONPointerForm/Form'
import Builder from './JSONPointerForm/Builder'
import validate from './JSONPointerForm/validate'
import withFormData from './JSONPointerForm/withFormData'

import withI18n from './withI18n'
import withEmitter from './withEmitter'
import withUser from './withUser'
import Link from './Link'

import expose from '../expose'
import { types } from '../common'

const WebPageEdit = ({
  about, emitter, translate, action, user, schema, closeLink, showOptionalFields, _self, onSubmit,
}) => {
  const [type, setType] = useState(about['@type'])
  useEffect(() => setType(about['@type']), [about])

  const TypeSwitcher = withFormData(({ setValue }) => (
    <select
      value={type}
      onChange={(e) => {
        setType(e.target.value)
        setValue(e.target.value)
      }}
    >
      {types.filter(t => t !== 'Person').map(type => <option key={type} value={type}>{translate(type)}</option>)}
    </select>
  ))

  return (
    <Form
      data={about}
      validate={validate(JsonSchema(schema).get(`#/definitions/${type}`))}
      onSubmit={(data) => {
        if (_self && _self.includes('?add')) {
          typeof _paq !== 'undefined' && _paq.push(['trackEvent', 'AddFormOverlay', 'SubmitButtonClick'])
        } else {
          typeof _paq !== 'undefined' && _paq.push(['trackEvent', 'EditFormOverlay', 'SubmitButtonClick'])
        }
        onSubmit(data)
      }}
      onError={() => document.querySelector('.hasError') && (document.querySelector('.webPageWrapper')
        .scrollTop = document.querySelector('.hasError').offsetTop
      )}
    >
      {_self.endsWith('/user/profile') ? (
        <React.Fragment>
          <h2>{translate('main.myProfile')}</h2>
          <p>{translate('ResourceIndex.Person.edit.message')}</p>
          {user && !user.persistent && (
            <p>
              <Link href="/resource/" className="btn">
                {translate('main.skipProfile')}
              </Link>
            </p>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <h2>
            {translate(action)}
            :&nbsp;
            {action === 'edit' && expose('changeType', user, about)
              ? <TypeSwitcher property="@type" />
              : translate(type)
            }
          </h2>
        </React.Fragment>
      )}
      <Builder
        schema={JsonSchema(schema).get(`#/definitions/${type}`)}
        key={uniqueId()}
        showOptionalFields={showOptionalFields}
      />
      <p className="agree" dangerouslySetInnerHTML={{ __html: translate('ResourceIndex.index.agreeMessage') }} />

      <div className="formButtons">
        <div className="primaryButtons">
          <button className="btn prominent" type="submit">{translate('publish')}</button>
          <Link href={closeLink || Link.home} className="btn">
            Cancel
          </Link>
        </div>
        {expose('deleteEntry', user, about) && (
          <button
            className="btn delete"
            type="button"
            onClick={(e) => {
              e.preventDefault()
              confirm(translate('other.deleteResource')) && emitter.emit('delete', {
                url: `/resource/${about['@id']}`,
              })
            }}
          >
            {translate('ResourceIndex.read.delete')}
          </button>
        )}
      </div>

    </Form>
  )
}

WebPageEdit.propTypes = {
  about: PropTypes.objectOf(PropTypes.any).isRequired,
  emitter: PropTypes.objectOf(PropTypes.any).isRequired,
  translate: PropTypes.func.isRequired,
  action: PropTypes.string,
  user: PropTypes.objectOf(PropTypes.any),
  schema: PropTypes.objectOf(PropTypes.any).isRequired,
  closeLink: PropTypes.string,
  showOptionalFields: PropTypes.bool,
  onSubmit: PropTypes.func,
  _self: PropTypes.string.isRequired,
}

WebPageEdit.defaultProps = {
  action: 'edit',
  user: null,
  closeLink: null,
  showOptionalFields: true,
  onSubmit: formData => console.log(formData),
}

export default withI18n(withEmitter(withUser(WebPageEdit)))
