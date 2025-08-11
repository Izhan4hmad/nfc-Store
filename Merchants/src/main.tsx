import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

// Tailwind css
import './tailwind.css';

// i18n (needs to be bundled)
import './i18n';

// Router
// import { RouterProvider } from 'react-router-dom';
// import router from './router/index';

// Redux
import { UserProvider } from './context/user';
import { Provider } from 'react-redux';
import store from './store/index';
import App from './App';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <UserProvider>
            <Suspense>
                <Provider store={store}>
                    <App />
                </Provider>
            </Suspense>
        </UserProvider>
    </React.StrictMode>
);
