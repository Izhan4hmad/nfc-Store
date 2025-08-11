import { Container } from '@mantine/core';
import React from 'react';
import { FaStar } from 'react-icons/fa';

const reviews = [
    {
        userName: 'John Doe',
        review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.',
        rating: 4,
    },
    {
        userName: 'Jane Smith',
        review: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        rating: 5,
    },
    {
        userName: 'Jane Smith',
        review: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        rating: 2,
    },
    {
        userName: 'Jane Smith',
        review: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        rating: 1,
    },
    {
        userName: 'Jane Smith',
        review: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        rating: 3,
    },
    {
        userName: 'Rupert Smith',
        review: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        rating: 3,
    },
];

export default function Profile() {
    return (
        <Container>
            <div className="py-8 px-8">
                {/* App Name and Description */}
                <div className="flex items-center mb-4">
                    <img src="/path/to/sample/dummy/image.jpg" alt="App Image" className="h-12 w-12 object-cover border-2 mr-4" />
                    <div>
                        <h6 className="text-xl font-bold mb-2 text-white">App Name</h6>
                        <p className="text-sm text-white">App description</p>
                    </div>
                </div>

                {/* Video Section */}
                <div className="p-4 bg-white shadow-md  rounded-[8px]  m-auto">
                    <div className="flex flex-col gap-4 justify-center">
                        <div className='text-center'>
                            <h6 className="text-xl font-bold mb-2 text-black">Video title</h6>
                            <p className="text-sm text-gray-600">Video description</p>
                        </div>
                        <div className='flex justify-center'>
                            <video controls className="h-auto w-full object-cover mr-4">
                                <source src="" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    {/* Action List */}
                    <div className="p-4 bg-white shadow-md max-h-74 overflow-auto rounded-[8px]">
                        <h6 className="text-xl text-black font-bold mb-2">Action list</h6>
                        <ul>
                            {[...new Array(4)].map((_, index) => (
                                <React.Fragment key={index}>
                                    <li className="py-2">
                                        <h6 className="text-lg font-semibold">Action title</h6>
                                        <p className="text-sm">Action Description</p>
                                    </li>
                                    {index < 3 && <hr className="my-2" />}
                                </React.Fragment>
                            ))}
                        </ul>
                    </div>

                    {/* Trigger List */}
                    <div className="p-4 bg-white shadow-md max-h-74 overflow-auto rounded-[8px]">
                        <h6 className="text-xl text-black font-bold mb-2">Trigger list</h6>
                        <ul>
                            {[...new Array(4)].map((_, index) => (
                                <React.Fragment key={index}>
                                    <li className="py-2">
                                        <h6 className="text-lg font-semibold">Action title</h6>
                                        <p className="text-sm">Action Description</p>
                                    </li>
                                    {index < 3 && <hr className="my-2" />}
                                </React.Fragment>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex flex-col p-8">
                {/* Video Section */}
                <h5 className="text-xl text-white font-bold mb-4">Video</h5>
                <p className="text-sm text-white mb-2">A selection of how-to, training and tips on how to use the app</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[...new Array(3)].map((_, index) => (
                        <div className="flex flex-col bg-white shadow-md rounded-lg" key={index} style={{ height: '360px', width: "auto", padding: '10px 10px' }}>
                            <video controls className="h-48 object-cover rounded-t-lg">
                                <source src="" type="video/mp4" />
                            </video>
                            <div className="p-4">
                                <h6 className="text-lg font-semibold mb-2">Video title</h6>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Document Section */}
                <h5 className="text-xl text-white font-bold mt-8">Use Case Docs</h5>
                <p className="text-sm text-white mb-2">A selection of how-to, training and tips on how to use the app</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[...new Array(3)].map((_, index) => (
                        <div className="flex flex-col bg-white shadow-md rounded-lg hover:shadow-xl transition duration-300 " key={index} style={{ width: "auto", height: "300px" }}>
                            <div className="p-4">
                                <h6 className="text-lg font-semibold">Title</h6>
                                <p className="text-sm mt-2">Description of the doc</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Review Section */}
            <div className="container mx-auto py-2 px-8">
                <h2 className="text-2xl text-white font-bold mb-4">Customer Reviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reviews.map((review, index) => (
                        <div key={index} className="review-card  bg-white shadow-lg  rounded-lg p-6 hover:shadow-xl transition duration-300">
                            <div className="flex items-center mb-4">
                                <div className="text-xl font-bold mr-2">{review.userName}</div>
                                <div className="flex text-yellow-500">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <FaStar key={i} fill={i < review.rating ? '#FFD700' : 'transparent'} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700">{review.review}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );
}
