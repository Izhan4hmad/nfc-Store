import { useUserInfo } from '../context/user';
import localforage from 'localforage';
// import { useNavigate } from 'react-router-dom';

function useAuth(): string | null {
    const { user } = useUserInfo();
    // Check if 'user' is defined before attempting to destructure
    return user && user.token ? user.token : null;
}

function useLogout(): () => void {
    const { clear } = useUserInfo();
    // const navigate = useNavigate();

    return () => {
        localforage.clear();
        clear();
        // navigate('/auth/sign-in');
    };
}

export { useAuth, useLogout };
