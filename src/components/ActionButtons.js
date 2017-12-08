import React from 'react'
import PropTypes from 'prop-types'
import translate from './translate'
import Link from './Link'

import '../styles/ActionButtons.pcss'

class ActionButtons extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      showMenu: false
    }
  }

  render() {
    return (
      <div className="ActionButtons">
        <button
          title={this.props.translate('ActionButtons.addEntry')}
          onClick={() => this.setState({showMenu:!this.state.showMenu})}
        >
          <i className="fa fa-plus" />

          <ul className={this.state.showMenu ? '' : 'noDisplay'}>
            <li>
              <a href="#addOrganization">
                + {this.props.translate('Organization')} <i className="fa fa-users" />
              </a>
            </li>

            <li>
              <a href="#addService">
                + {this.props.translate('Service')} <i className="fa fa-desktop" />
              </a>
            </li>

            <li>
              <a href="#addProject">
                + {this.props.translate('Project')} <i className="fa fa-gears" />
              </a>
            </li>

            <li>
              <a href="#addStory">
                + {this.props.translate('Story')} <i className="fa fa-comment" />
              </a>
            </li>

            <li>
              <a href="#addEvent">
                + {this.props.translate('Event')} <i className="fa fa-calendar" />
              </a>
            </li>

            <li>
              <a href="#addPublication">
                + {this.props.translate('Publication')} <i className="fa fa-book" />
              </a>
            </li>

            <li>
              <a href="#addTool">
                + {this.props.translate('Tool')} <i className="fa fa-folder" />
              </a>
            </li>

          </ul>

        </button>
        <a href="/user/newsletter" title={translate('ActionButtons.subscribeToNewsletter')}>
          <i className="fa fa-envelope" />
        </a>

        <a href="/aggregation/" title={translate('ActionButtons.statistics')}>
          <i className="fa fa-pie-chart" />
        </a>

        <a href="/feed/" title={translate('ActionButtons.recentAdditions')}>
          <i className="fa fa-rss" />
        </a>
        <a href="#liked" title={translate('ActionButtons.liked')}>
          <i className="fa fa-thumbs-up" />
        </a>
        <Link href="/resource/?filter.about.objectIn.@type=LighthouseAction&sort=like_count:DESC" title={translate('ActionButtons.lighthouse')}>
          <i className="fa fa-lightbulb-o" />
        </Link>
      </div>
    )
  }
}

ActionButtons.propTypes = {
  translate: PropTypes.func.isRequired
}

export default translate(ActionButtons)
