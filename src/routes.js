import Chat from "./components/Chat";
import Login from "./components/Login";
import Home from "./components/Home";
import Messenger from "./components/Messenger";
import All from "./components/All"
import { CHAT_ROUTE, LOGIN_ROUTE, HOME_ROUTE, MESSENGER_ROUTE } from "./utils/consts";
import ContainerMain from "./components/ContainerMain";
import PersonalChat from "./pages/PersonalChat";
import GroupChat from "./pages/GroupChat";


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
        // Component: Chat
        Component: GroupChat
    },
    {
        path: MESSENGER_ROUTE,
        // Component: Messenger
        // Component: ContainerMain
        Component: PersonalChat
    }
]