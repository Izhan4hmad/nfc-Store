import { PropsWithChildren } from 'react';
import MainLayout from './MainLayout';
// import App from '../../App';

const BlankLayout = ({ children }: PropsWithChildren) => {
    return (
        <MainLayout>
            <div className="text-black dark:text-white-dark min-h-screen">{children} </div>
        </MainLayout>
        // </App>
    );
};

export default BlankLayout;
