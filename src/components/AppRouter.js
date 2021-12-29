import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { Switch } from 'react-router-dom'
import { Context } from '../index'
import {useAuthState} from "react-firebase-hooks/auth";
import { privateRoutes, publicRoutes } from '../routes'
import { CHAT_ROUTE, LOGIN_ROUTE } from '../utils/consts'

function AppRouter() {
    const {auth} = useContext(Context)
    const [user] = useAuthState(auth)
    console.log("user: ", user);
    // const user = false
    return user ?
        (<Switch>
            {privateRoutes.map(({ path, Component }) =>
                <Route
                    key={path}
                    path={path}
                    component={Component} exact={true} />
            )}
            <Redirect to={CHAT_ROUTE} />
        </Switch>)
        :
        (<Switch>
            {publicRoutes.map(({ path, Component }) =>
                <Route
                    key={path}
                    path={path}
                    component={Component} exact={true} />
            )}
            <Redirect to={LOGIN_ROUTE} />
        </Switch>)
}

export default AppRouter
