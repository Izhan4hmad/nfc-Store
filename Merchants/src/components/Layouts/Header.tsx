import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { IRootState } from '../../store';
import { toggleSidebar } from '../../store/themeConfigSlice';
import Dropdown from '../Dropdown';
import IconMenu from '../Icon/IconMenu';
import IconUser from '../Icon/IconUser';
import IconLogout from '../Icon/IconLogout';
import { useUserInfo } from '../../context/user';
import localforage from 'localforage';
const Header = () => {
    const navigate = useNavigate();
    const { workspace_id } = useParams();
    const { user, clear, superAdminUser, switchToAdmin } = useUserInfo();
    const location = useLocation();
    let middleware = `/app`;
    if (user?.user_type == 'super_admin') {
        middleware = `/admin`;
    }
    const handleSignOut = () => {
        localforage.clear();
        clear();
        navigate('/auth/sign-in');
    };
    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [location]);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    return (
        <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
            <div className="shadow-sm">
                <div className="relative bg-white flex w-full items-center px-5 py-2.5 dark:bg-black">
                    <div className="flex items-center gap-2">
                        <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
                            {/* <Link to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-8 ltr:-ml-1 rtl:-mr-1 inline" src="/assets/images/logo.svg" alt="logo" />
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5  font-semibold  align-middle hidden md:inline dark:text-white-light transition-all duration-300">VRISTO</span>
                        </Link> */}
                            <button
                                type="button"
                                className="collapse-icon flex-none dark:text-[#d0d2d6] hover:text-primary dark:hover:text-primary flex lg:hidden ltr:ml-2 rtl:mr-2 p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
                                onClick={() => {
                                    dispatch(toggleSidebar());
                                }}
                            >
                                <IconMenu className="w-5 h-5" />
                            </button>
                        </div>
                        {user?.user_type == 'user' && superAdminUser?.email && (
                            <div className="w-[150px]">
                                <button type="button" className="btn btn-primary btn-sm" onClick={switchToAdmin}>
                                    Back To Admin
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex w-full justify-end">
                        {!workspace_id && (
                            <div className="dropdown shrink-0 flex">
                                <Dropdown offset={[0, 8]} placement={`bottom-end`} btnClassName="relative group block" button={<IconUser className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />}>
                                    <ul className="text-dark dark:text-white-dark !py-0 w-[230px] font-semibold dark:text-white-light/90">
                                        <li>
                                            <div className="flex items-center px-4 py-4">
                                                {/* <img className="rounded-md w-10 h-10 object-cover" src="/assets/images/user-profile.jpeg" alt="userProfile" /> */}
                                                <div className="truncate">
                                                    <h4 className="text-base">
                                                        {user.name}
                                                        {/* <span className="text-xs bg-success-light rounded text-success px-1 ltr:ml-2 rtl:ml-2">Pro</span> */}
                                                    </h4>
                                                    <button type="button" className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white">
                                                        {user.email}
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <Link to={`${middleware}/profile`} className="dark:hover:text-white">
                                                <IconUser className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                                Profile
                                            </Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10" onClick={handleSignOut}>
                                            <Link to="#" className="text-danger !py-3">
                                                <IconLogout className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 rotate-90 shrink-0" />
                                                Sign Out
                                            </Link>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
