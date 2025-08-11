const Footer = () => {
    // return <div className="dark:text-white-dark text-center ltr:sm:text-left rtl:sm:text-right p-6 pt-0 mt-auto">© {new Date().getFullYear()}. Vristo All rights reserved.</div>;
    return (
        <div className="flex items-center justify-center bg-[#000000] text-white text-lg font-bold">
            <div className="dark:text-white-dark text-center py-8">© {new Date().getFullYear()} GoCSM. All Rights Reserved.</div>
        </div>
    );
};

export default Footer;
