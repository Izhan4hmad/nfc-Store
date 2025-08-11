import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import { useAppServices } from '../hook/services';

const SmsMessages = () => {
    const [sentMessages, setSentMessages] = useState(0);
    const [receivedMessages, setReceivedMessages] = useState(0);
    const location = useLocation();
    const [processing, setProcessing] = useState<boolean>(true);
    const AppService = useAppServices();
    const [data, setData] = useState<any[]>([]);

    // Extract user_id from the URL
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('user_id');

    // Fetch messages
    const getMessages = async () => {
        setProcessing(true);
        try {
            const { response } = await AppService?.message.get({ query: `userID=${userId}` });

            if (response) {
                setData(response?.data);

                const inboundCount = response?.data.filter(
                    (message: any) => message?.message_type === 'inbound'
                ).length;
                const outboundCount = response?.data.filter(
                    (message: any) => message?.message_type === 'outbound'
                ).length;

                setReceivedMessages(inboundCount); // Inbound messages are "received"
                setSentMessages(outboundCount); // Outbound messages are "sent"
            }
        } catch (error) {
            console.error("Error fetching messages", error);
        } finally {
            setProcessing(false);
        }
    };

    useEffect(() => {
        getMessages();
    }, [userId]);

    return (
        <div className='h-screen flex justify-center items-center w-screen'>
            {processing ? (
                <Loader />
            ) : (
                <div className='w-[200px] h-fit flex flex-col justify-center items-center gap-[13px]'>
                    <b className='text-[#007bff] font-bold text-center text-normal'>SMS Messages</b>
                    <button className='border-2 border-[#007bff] rounded-lg w-full py-2 bg-white'>
                        Sent Messages: {sentMessages}
                    </button>
                    <button className='border-2 border-[#007bff] rounded-lg w-full py-2 bg-white'>
                        Received Messages: {receivedMessages}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SmsMessages;