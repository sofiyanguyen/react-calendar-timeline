import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { _get, arraysEqual } from '../utility/generic'

const SidebarItem = class extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.elementStyle.height !== this.props.elementStyle.height
  }

  renderGroupContent(group, isRightSidebar, groupTitleKey, groupRightTitleKey) {
    if (this.props.groupRenderer) {
      return React.createElement(this.props.groupRenderer, {
        group,
        isRightSidebar
      })
    } else {
      return _get(group, isRightSidebar ? groupRightTitleKey : groupTitleKey)
    }
  }

  render() {
    return (
      <div
        key={_get(this.props.group, this.props.groupIdKey)}
        className={
          'rct-sidebar-row rct-sidebar-row-' +
          (this.props.index % 2 === 0 ? 'even' : 'odd')
        }
        style={this.props.elementStyle}
      >
        {this.renderGroupContent(
          this.props.group,
          this.props.isRightSidebar,
          this.props.groupTitleKey,
          this.props.groupRightTitleKey
        )}
      </div>
    )
  }
}

export default class Sidebar extends Component {
  static propTypes = {
    groups: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    groupHeights: PropTypes.array.isRequired,
    keys: PropTypes.object.isRequired,
    groupRenderer: PropTypes.func,
    isRightSidebar: PropTypes.bool
  }

  shouldComponentUpdate(nextProps) {
    return !(
      nextProps.keys === this.props.keys &&
      nextProps.width === this.props.width &&
      nextProps.groupHeights === this.props.groupHeights &&
      nextProps.height === this.props.height
    )
  }

  render() {
    const { width, groupHeights, height, isRightSidebar } = this.props

    const { groupIdKey, groupTitleKey, groupRightTitleKey } = this.props.keys

    const sidebarStyle = {
      width: `${width}px`,
      height: `${height}px`
    }

    const groupsStyle = {
      width: `${width}px`
    }

    let groupLines = this.props.groups.map((group, index) => {
      const elementStyle = {
        height: `${groupHeights[index] - 1}px`,
        lineHeight: `${groupHeights[index] - 1}px`
      }

      return (
        <SidebarItem
          group={group}
          index={index}
          isRightSidebar={isRightSidebar}
          groupTitleKey={groupTitleKey}
          groupRightTitleKey={groupRightTitleKey}
          elementStyle={elementStyle}
          groupRenderer={this.props.groupRenderer}
          groupIdKey={groupIdKey}
        />
      )
    })

    return (
      <div
        className={'rct-sidebar' + (isRightSidebar ? ' rct-sidebar-right' : '')}
        style={sidebarStyle}
      >
        <div style={groupsStyle}>{groupLines}</div>
      </div>
    )
  }
}
