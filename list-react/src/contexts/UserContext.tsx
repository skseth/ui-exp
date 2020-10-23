import React from 'react';

interface UserState {
    isLoggedIn: boolean
    username: string
    isAdmin: boolean
}

export const defaultUserContext = {isLoggedIn: false, username: "Samir", isAdmin: false}

export const UserContext = React.createContext<UserState>(defaultUserContext);

