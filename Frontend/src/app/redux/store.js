import {configureStore} from '@reduxjs/toolkit';
import chatReducer from '../../features/chats/chat.slice';
import authReducer from '../../features/auth/auth.slice';

export const store = configureStore({
    reducer: {
        chat: chatReducer,
        auth: authReducer,
    },
});