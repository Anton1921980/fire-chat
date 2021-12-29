import Chat from "./components/Chat";
import Login from "./components/Login";
import Home from "./components/Home";

import { CHAT_ROUTE, LOGIN_ROUTE, HOME_ROUTE } from "./utils/consts";

export const publicRoutes = [
    {
        path: HOME_ROUTE,
        Component: Home
    },
    {
        path: LOGIN_ROUTE,
        Component: Login
    }
]

export const privateRoutes = [
    {
        path: CHAT_ROUTE,
        Component: Chat
    }
]