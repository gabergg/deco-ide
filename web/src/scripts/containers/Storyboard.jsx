/**
 *    Copyright (C) 2015 Deco Software Inat.
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Affero General Public License, version 3,
 *    as published by the Free Software Foundation.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import React, { Component, PropTypes, } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import { StylesEnhancer } from 'react-styles-provider'
import YOPS from 'yops'

import * as ContentLoader from '../api/ContentLoader'
import * as URIUtils from '../utils/URIUtils'
import { storyboardActions } from '../actions'
import NewSceneButton from '../components/storyboard/NewSceneButton'

const stylesCreator = (theme) => {
  const {colors} = theme
  return {
    container: {
      backgroundColor: 'white',
      flex: '1 1 auto',
    }
  }
}

const mapDispatchToProps = (dispatch) => ({
  storyboardActions: bindActionCreators(storyboardActions, dispatch),
})

const mapStateToProps = (state) => createSelector(
  (state) => state.storyboard,
  (storyboard) => ({
    storyboard: storyboard,
    connections: storyboard.connections,
    scenes: storyboard.scenes,
  })
)

@StylesEnhancer(stylesCreator)
class Storyboard extends Component {

  componentWillMount() {
    const { fileId, storyboardActions } = this.props
    storyboardActions.openStoryboard(fileId)
  }

  render() {
    const {
      connections,
      scenes,
      storyboardActions,
      styles,
      storyboard,
      yopsStyle
    } = this.props
    const syncServiceAddress = 'http://localhost:4082'
    const onLayoutUpdate = () => {}

    return (
      <div style={styles.container}>
        <NewSceneButton onClick={storyboardActions.addScene}/>
        <YOPS
          style={yopsStyle}
          connections={connections}
          scenes={scenes}
          onDeleteScene={storyboardActions.deleteScene}
          syncServiceAddress={syncServiceAddress}
          onLayoutUpdate={onLayoutUpdate}
        />
      </div>
    )
  }
}

const ConnectedClass = connect(mapStateToProps, mapDispatchToProps)(Storyboard)

export default ConnectedClass

export const registerLoader = () => {
  ContentLoader.registerLoader({
    name: 'Storyboard',
    id: 'com.decosoftware.storyboard',
    filter: (uri, state) => {
      return state.storyboard.shouldShow && uri &&
        uri.startsWith('file://') && uri.endsWith('.storyboard.js')
    },
    renderContent: (uri) => (
      <ConnectedClass
        fileId={uri && URIUtils.withoutProtocol(uri)}
      />
    ),
  })
}
