import Chat from "./components/Chat";
import Login from "./components/Login";
import Home from "./components/Home";
import Messenger from "./components/Messenger";
import { CHAT_ROUTE, LOGIN_ROUTE, HOME_ROUTE, MESSENGER_ROUTE, REGISTERED_CHAT_ROUTE, INCOGNITO_CHAT_ROUTE } from "./utils/consts";

import PersonalChat from "./pages/PersonalChat";
import GroupChat from "./pages/GroupChat";
import RegisteredChat from "./pages/RegisteredChat";
import IncognitoChat from "./pages/IncognitoChat";


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
    },
    {
        path: REGISTERED_CHAT_ROUTE,
        // Component: Chat
        Component: RegisteredChat
    },
    {
        path: INCOGNITO_CHAT_ROUTE,
        // Component: Chat
        Component: IncognitoChat
    },
]