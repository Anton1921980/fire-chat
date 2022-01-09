import Chat from "./components/Chat";
import Login from "./components/Login";
import Home from "./components/Home";
import Messenger from "./components/Messenger";
import { CHAT_ROUTE, LOGIN_ROUTE, HOME_ROUTE, MESSENGER_ROUTE } from "./utils/consts";


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
    },
    {
        path: MESSENGER_ROUTE,
        Component: Messenger
    }
]