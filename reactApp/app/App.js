import React, { Component } from 'react'
import { NativeModules, View } from 'react-native'
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import { Provider } from 'react-redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import { PersistGate } from 'redux-persist/es/integration/react'
import { NativeRouter, Route, Link } from 'react-router-native'
import { withRouter } from 'react-router-dom'
import reducer from './reducers/index'
import sagas from './sagas'
import * as actions from './actionTypes'

import { Home, Detail } from './screens/'
import { GalleryLocationService } from './utils'

class App extends Component {
  constructor(props) {
    super(props)

    if (props.store === undefined) {
      const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ })
      const sagaMiddleware = createSagaMiddleware()
      const middleware = [loggerMiddleware, sagaMiddleware]

      this.appStore = createStore(reducer, applyMiddleware(...middleware))
      // create the persistor
      this.persistor = persistStore(this.appStore, {})
      this.persistor.purge(() => console.log('purged'))
      sagaMiddleware.run(sagas)
    }
  }

  componentDidMount = () => this.initNativeServices()

  initNativeServices = () => this.appStore.dispatch({ type: actions.INIT_GALLERY_SERVICES })

  render() {
    const store = this.props.store !== undefined ? this.props.store : this.appStore
    return (
      <Provider store={store}>
        <PersistGate persistor={this.persistor}>
          <NativeRouter>
            <View style={styles.container}>
              <Route
                exact
                path="/"
                render={props => <Home {...props} />}
              />
              <Route
                exact
                path="/detail"
                component={Detail}
              />
            </View>
          </NativeRouter>
        </PersistGate>
      </Provider>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    marginTop: 30,
  },
  button: {
    backgroundColor: '#b042f4',
    margin: 10,
  },
  disabled: {
    backgroundColor: 'grey',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },
}

export default App
