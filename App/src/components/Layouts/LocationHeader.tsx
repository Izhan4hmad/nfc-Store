import { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUserInfo } from '../../context/user';

const LocationHeader = () => {
    const location = useLocation();
    const { workspace_id } = useParams();
    const { user, clear } = useUserInfo();
    const navigate = useNavigate();
    const middleware = `/custom-menu-link/${workspace_id}`;
    const lastParamValue = location.pathname.split('/').pop();
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
    const Menus = [
        { title: 'Dashboard', route: 'dashboard', key: 'dashboard' },
        { title: 'Messages',  route: 'message', key: 'message' },
        { title: 'Devices',  route: 'devices', key: 'devices' },
    ];
    return (
        <header className={`z-40`}>
            <div className="shadow-sm">
                <div className="relative bg-white flex w-full items-center px-5 py-2.5 dark:bg-black">
                    {/* <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
                        <Link to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-8 ltr:-ml-1 rtl:-mr-1 inline" src="/assets/images/logo.svg" alt="logo" />
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5  font-semibold  align-middle hidden md:inline dark:text-white-light transition-all duration-300">VRISTO</span>
                        </Link>
                    </div> */}
                    <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center justify-end space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                        <ul className="flex items-center space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                            {/* {Menus.map((menu) => (
                                <li key={menu.key}>
                                    <Link to={`${middleware}/${menu.route}`} className={`p-2 flex items-center gap-1 ${lastParamValue == menu.key ? 'text-info' : ''}`}>
                                        {menu.icon}
                                        <span>{menu.title}</span>
                                    </Link>
                                </li>
                            ))} */}
                            {Menus.map((menu) => (
                                <li key={menu.key}>
                                    {menu.key === 'earnMoneyWithMyCrmSim' ? (
                                        <a href="https://mycrmsim.com/affiliate?email=hamza@levelupmarketplace.com&first_name=Hamza&last_name=" target="_blank" rel="noopener noreferrer">
                                            {/* {menu.icon} */}
                                            <span>{menu.title}</span>
                                        </a>
                                    ) : (
                                        <Link to={`${middleware}/${menu.route}`} className={`p-2 flex items-center gap-1 ${lastParamValue === menu.key ? 'text-info' : ''}`}>
                                            <span>{menu.title}</span>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default LocationHeader;
