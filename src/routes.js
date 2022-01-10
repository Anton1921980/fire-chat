import Chat from "./components/Chat";
import Login from "./components/Login";
import Home from "./components/Home";
import Messenger from "./components/Messenger";
import All from "./components/All"
import { CHAT_ROUTE, LOGIN_ROUTE, HOME_ROUTE, MESSENGER_ROUTE } from "./utils/consts";
import ContainerMain from "./components/ContainerMain";


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
        // Component: ContainerMain
    }
]