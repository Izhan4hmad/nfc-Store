import { ToastContainer, toast } from 'react-toastify';

interface propsType {
    message: string;
    type: 'success' | 'error';
}
const ToastifyNotification = ({ message, type }: propsType) => {
    if (message) {
        if (type == 'error') {
            toast.error(message);
        } else {
            toast.success(message);
        }
    }
    return (
        <div>
            <ToastContainer />
        </div>
    );
};

export { ToastifyNotification };
