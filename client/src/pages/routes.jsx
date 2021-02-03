import React from "react";
import { Redirect, Route, Switch } from 'react-router-dom'

import CreatePage from './CreatePage'
import AuthPage from './AuthPage'
import DetailPage from './DetailPage'
import LinksPage from './LinksPage'

const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path='/links' exact component={LinksPage} />
        <Route path='/create' exact component={CreatePage} />
        <Route path='/detail/:id' component={DetailPage} />

        <Redirect to='/create' />
      </Switch>
    )
  }

  return (
    <Switch>
      <Route path='/' exact component={AuthPage} />
      <Redirect to='/' />
    </Switch>
  )
}

export default useRoutes;