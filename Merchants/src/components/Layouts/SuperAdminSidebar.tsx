import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMinus from '../Icon/IconMinus';
import IconMenuChat from '../Icon/Menu/IconMenuChat';
import IconMenuMailbox from '../Icon/Menu/IconMenuMailbox';
import IconMenuTodo from '../Icon/Menu/IconMenuTodo';
import IconMenuNotes from '../Icon/Menu/IconMenuNotes';
import IconMenuScrumboard from '../Icon/Menu/IconMenuScrumboard';
import IconMenuContacts from '../Icon/Menu/IconMenuContacts';
import IconMenuInvoice from '../Icon/Menu/IconMenuInvoice';
import IconMenuCalendar from '../Icon/Menu/IconMenuCalendar';
import IconMenuComponents from '../Icon/Menu/IconMenuComponents';
import IconMenuElements from '../Icon/Menu/IconMenuElements';
import IconMenuCharts from '../Icon/Menu/IconMenuCharts';
import IconMenuWidgets from '../Icon/Menu/IconMenuWidgets';
import IconMenuFontIcons from '../Icon/Menu/IconMenuFontIcons';
import IconMenuDragAndDrop from '../Icon/Menu/IconMenuDragAndDrop';
import IconMenuTables from '../Icon/Menu/IconMenuTables';
import IconMenuDatatables from '../Icon/Menu/IconMenuDatatables';
import IconMenuForms from '../Icon/Menu/IconMenuForms';
import IconMenuUsers from '../Icon/Menu/IconMenuUsers';
import IconMenuPages from '../Icon/Menu/IconMenuPages';
import IconMenuAuthentication from '../Icon/Menu/IconMenuAuthentication';
import IconMenuDocumentation from '../Icon/Menu/IconMenuDocumentation';
import IconHealth from '../Icon/Menu/IconHealth';
import IconIntegration from '../Icon/Menu/IconIntegration';
import IconFeedback from '../Icon/Menu/IconFeedback';
import { CiSettings } from 'react-icons/ci';
import { MdDashboard, MdOutlineSettings } from 'react-icons/md';
import { GoPackage } from 'react-icons/go';
import { FaUsers } from 'react-icons/fa';
interface propsType {
    routes: any[];
}
const SuperAdminSidebar = ({ routes }: propsType) => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const path = location.pathname;

    // Split the path into segments and remove empty segments
    const pathSegments = path.split('/').filter(Boolean);

    // Use .pop() to get the last segment
    const lastParam = `/${pathSegments.pop()}`;
    const middleware = `/admin`;
    const Menus = [
        {
            title: 'Dashboard',
            icon: (
                <MdDashboard
                    className={`shrink-0 ${
                        lastParam === 'dashboard'
                            ? '!text-white' // !text-white when active
                            : '!text-white-dark' // text-dark-light when not active
                    }`}
                />
            ),
            route: 'dashboard',
            key: 'dashboard',
        },
        {
            title: 'Users',
            icon: (
                <FaUsers
                    className={`shrink-0 ${
                        lastParam === 'users'
                            ? '!text-white' // !text-white when active
                            : '!text-white-dark' // text-dark-light when not active
                    }`}
                />
            ),
            route: 'users',
            key: 'users',
        },
        {
            title: 'Plan',
            icon: (
                <GoPackage
                    className={`shrink-0 ${
                        lastParam === 'plan'
                            ? '!text-white' // !text-white when active
                            : '!text-white-dark' // text-dark-light when not active
                    }`}
                />
            ),
            route: 'plan',
            key: 'plan',
        },
        {
            title: 'Setting',
            icon: (
                <MdOutlineSettings
                    className={`shrink-0 ${
                        lastParam === 'setting'
                            ? '!text-white' // !text-white when active
                            : '!text-white-dark' // text-dark-light when not active
                    }`}
                />
            ),
            route: 'setting',
            key: 'setting',
        },
    ];
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return (
        <div className={'dark'}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to={`${middleware}/dashboard`} className="main-logo flex items-center shrink-0">
                            {/* <img className="w-[170px] ml-[5px] flex-none" src="https://app.mycrmsim.com/assets/media/auth/mycrmsim.webp" alt="logo" /> */}
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative mt-5">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            {routes.map((menu: any) =>
                                menu.items && menu.items.length ? (
                                    <li className="menu nav-item">
                                        <button type="button" className={`${currentMenu === menu.title ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu(menu.title)}>
                                            <div className="flex items-center">
                                                <IconMenuInvoice className="group-hover:!text-primary shrink-0" />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{menu.title}</span>
                                            </div>

                                            <div className={currentMenu !== menu.title ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                <IconCaretDown />
                                            </div>
                                        </button>

                                        <AnimateHeight duration={300} height={currentMenu === menu.title ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                {menu.items.map((item: any) => (
                                                    <li>
                                                        <NavLink to={`.${item.path}`}>{item.title}</NavLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </AnimateHeight>
                                    </li>
                                ) : (
                                    <li className="menu nav-item" key={menu.path} onClick={() => toggleMenu(menu.path)}>
                                        <NavLink to={`.${menu.path}`}>
                                            <button
                                                type="button"
                                                className={`${
                                                    lastParam === menu.path
                                                        ? 'text-white' // text-white when active
                                                        : 'text-white-dark' // text-dark-light when not active
                                                } nav-link group w-full hover:text-white`} // text-white on hover
                                            >
                                                <div className="flex items-center">
                                                    {menu.icon}
                                                    <span className={`ltr:pl-3 rtl:pr-3`}>{menu.title}</span>
                                                </div>
                                            </button>
                                        </NavLink>
                                    </li>
                                )
                            )}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default SuperAdminSidebar;
