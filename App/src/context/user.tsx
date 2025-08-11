import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import PropTypes from 'prop-types';
import localforage from 'localforage';
import { useAppServices } from '../hook/services';
import Loader from '../components/Loader';

interface UserContextType {
    user: Record<string, any>;
    Update: (updates: Record<string, any>) => void;
    clear: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

UserContext.displayName = 'UserContext';

interface UserProviderProps {
    children: ReactNode;
}

function UserProvider({ children }: UserProviderProps) {
    const Service = useAppServices();
    const [user, setUser] = useState<Record<string, any>>({
        id: 4,
        email: 'test@gmail.com',
        role: 'super_admin',
    }); // Current logged-in user
    const [loader, setLoader] = useState(true);
    const Update = (updates: Record<string, any>) => setUser((prevUser) => ({ ...prevUser, ...updates }));
    const clear = () => {
        setUser({});
    };

    const value = useMemo(
        () => ({
            user,
            Update,
            clear,
        }),
        [user, Update, clear]
    );

    const getUser = async (localUser: any) => {
        const token = await localforage.getItem('token');
        const { response } = await Service.user.get({ query: `id=${localUser.id}`, token });
        if (response) setUser({ ...response.data, token });
    };

    const updateUser = async () => {
        const localUser = await localforage.getItem('user');
        const token = await localforage.getItem('token');
        if (!localUser) return setLoader(false);
        setUser({ ...localUser, token });
        await getUser(localUser);
        return setLoader(false);
    };
    let pageLoad = true;
    const onLoad = () => {
        if (pageLoad) {
            updateUser();
            pageLoad = false;
        }
    };

    useEffect(onLoad, []);

    useEffect(() => {
        onLoad();
    }, []);

    return loader ? <Loader /> : <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function useUserInfo() {
    const [tempuser, setTempUser] = useState<Record<string, any>>({}); // Current logged-in user
    const context = useContext(UserContext) || tempuser;
    if (!context) {
        throw new Error('useUserInfo must be used within a UserProvider');
    }
    return context;
}

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { UserProvider, useUserInfo };
