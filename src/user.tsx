import React from 'react';

export type userInfo = {
    username : string | null,
    email : string | null
}

export type ContextProps = {
    user : userInfo | null,
    setUser : (user : userInfo | null) => void
}

export const userContext = React.createContext<ContextProps>({
    user : null,
    setUser: () => {}
});