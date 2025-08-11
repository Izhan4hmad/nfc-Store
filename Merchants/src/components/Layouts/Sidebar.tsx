import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import { MdDashboard, MdIntegrationInstructions, MdMessage, MdOutlineSettings } from 'react-icons/md';
import IconIntegration from '../Icon/Menu/IconIntegration';
import { HiDevicePhoneMobile } from 'react-icons/hi2';
import { CiSettings } from 'react-icons/ci';
import { FaMoneyBillAlt, FaSimCard } from 'react-icons/fa';
import { GoPackage } from 'react-icons/go';
import { useUserInfo } from '../../context/user';
const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const { user } = useUserInfo();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const path = location.pathname;

    // Split the path into segments and remove empty segments
    const pathSegments = path.split('/').filter(Boolean);

    // Use .pop() to get the last segment
    const lastParam = pathSegments.pop();
    const middleware = `/app`;
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
            title: 'Messages',
            icon: (
                <MdMessage
                    className={`shrink-0 ${
                        lastParam === 'message'
                            ? '!text-white' // !text-white when active
                            : '!text-white-dark' // text-dark-light when not active
                    }`}
                />
            ),
            route: 'message',
            key: 'message',
        },
        {
            title: 'Subaccount SIM',
            icon: (
                <FaSimCard
                    className={`shrink-0 ${
                        lastParam === 'subaccount_sim'
                            ? '!text-white' // !text-white when active
                            : '!text-white-dark' // text-dark-light when not active
                    }`}
                />
            ),
            route: 'subaccount_sim',
            key: 'subaccount_sim',
        },
        {
            title: 'Devices',
            icon: (
                <HiDevicePhoneMobile
                    className={`shrink-0 ${
                        lastParam === 'devices'
                            ? '!text-white' // !text-white when active
                            : '!text-white-dark' // text-dark-light when not active
                    }`}
                />
            ),
            route: 'devices',
            key: 'devices',
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
            title: 'Integration',
            icon: (
                <MdIntegrationInstructions
                    className={`shrink-0 ${
                        lastParam === 'integration'
                            ? '!text-white' // !text-white when active
                            : '!text-white-dark' // text-dark-light when not active
                    }`}
                />
            ),
            route: 'integration',
            key: 'integration',
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
            <nav className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 `}>
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to={`${middleware}/dashboard`} className="main-logo flex items-center shrink-0">
                            <img className="w-[170px] ml-[5px] flex-none" src="https://app.mycrmsim.com/assets/media/auth/mycrmsim.webp" alt="logo" />
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
                            {Menus.map((menu: any) => (
                                <li className="menu nav-item" key={menu.key} onClick={() => toggleMenu(menu.key)}>
                                    <NavLink to={`${middleware}/${menu.route}`}>
                                        <button
                                            type="button"
                                            className={`${
                                                lastParam === menu.key
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
                            ))}
                            <li className="menu nav-item">
                                <button
                                    type="button"
                                    className={` nav-link group w-full  `} // text-white on hover
                                    onClick={() =>
                                        window.open(`https://mycrmsim.com/affiliate?email=${user?.email}&first_name=${user?.name?.split(' ')[0]}&last_name=${user?.name?.split(' ')[1]}`, '_blank')
                                    }
                                >
                                    <div className="flex items-center text-white-dark hover:text-white">
                                        <FaMoneyBillAlt className={`shrink-0`} />
                                        <span className={`ltr:pl-3 rtl:pr-3`}>Earn Money With myCRMSIM</span>
                                    </div>
                                </button>
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
