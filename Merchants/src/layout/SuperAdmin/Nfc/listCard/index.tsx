'use client';

import { useState, useEffect } from 'react';
import { Download, Plus, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAppServices } from '../../../../hook/services';
import NfcCardTable from './table';
import { useParams } from 'react-router-dom';

interface Card {
    _id: string;
    code: string;
    passcode: string;
    url: string;
    domain: string;
    islock: boolean;
    createdAt: string;
}

function NfcBusiness() {
    const { userId } = useParams();
    const [open, setOpen] = useState(false);
    const [numberOfIds, setNumberOfIds] = useState('');
    const [passcode, setPasscode] = useState('');
    const [domain, setDomain] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [cards, setCards] = useState<Card[]>([]);
    const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);

    const AppService = useAppServices();

    const domainOptions = [
        { value: 'tap-this.link', label: 'tap-this.link' },
        { value: 'click-my.link', label: 'click-my.link' },
        { value: 'tap-my.link', label: 'tap-my.link' },
    ];

    const fetchCards = async () => {
        try {
            const { response } = await AppService.nfcbusinessCard.getByUserId({
                query: `userId=${userId}`,
            });
            if (response?.success) {
                setCards(response.data || []);
            } else {
                setError('Failed to fetch NFC cards.');
            }
        } catch (err) {
            setError('An error occurred while fetching cards.');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const handleOpen = () => {
        setOpen(true);
        setError('');
        setSuccess('');
    };

    const handleClose = () => {
        setOpen(false);
        setNumberOfIds('');
        setPasscode('');
        setDomain('');
        setError('');
        setSuccess('');
        setIsDomainDropdownOpen(false);
    };

    const handleSave = async () => {
        setProcessing(true);
        setError('');
        setSuccess('');

        const numIds = Number.parseInt(numberOfIds, 10);
        if (isNaN(numIds) || numIds <= 0) {
            setError('Please enter a valid number of IDs.');
            setProcessing(false);
            return;
        }

        if (!passcode.trim()) {
            setError('Please enter a valid passcode.');
            setProcessing(false);
            return;
        }

        if (!domain.trim()) {
            setError('Please enter a valid domain.');
            setProcessing(false);
            return;
        }

        try {
            const basePayload = {
                passcode: passcode.trim(),
                userId: userId,
                url: 'https://example.com',
                domain: domain.trim(),
                islock: false,
            };

            const promises = [];
            for (let i = 0; i < numIds; i++) {
                promises.push(
                    AppService.nfcbusinessCard.create({
                        payload: basePayload,
                    })
                );
            }

            const responses = await Promise.all(promises);

            const allSuccessful = responses.every((res: any) => res.response?.success);
            if (allSuccessful) {
                setSuccess(`Successfully created ${numIds} NFC card(s)!`);
                setTimeout(() => {
                    handleClose();
                    fetchCards();
                }, 1500);
            } else {
                setError('Some cards could not be created. Please try again.');
            }
        } catch (err) {
            setError('An error occurred while creating cards. Please try again.');
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const downloadCSV = () => {
        if (cards.length === 0) {
            setError('No data available to download.');
            return;
        }

        const headers = ['Code', 'Passcode', 'URL', 'Domain', 'Locked', 'Created At'];

        const rows = cards.map((card) => [
            card.code,
            card.passcode,
            card.domain?.includes('http') ? card.domain + '/' + card.code : 'https://' + card.domain + '/' + card.code,
            card.domain,
            card.islock ? 'Yes' : 'No',
            new Date(card.createdAt).toLocaleDateString(),
        ]);

        const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `nfc_cards_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">NFC Tags</h1>
                            <p className="mt-1 text-sm text-gray-500">Manage and create your NFC Tags</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={downloadCSV}
                                disabled={processing || cards.length === 0}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                <Download className="w-4 h-4" />
                                Download CSV
                            </button>
                            <button
                                onClick={handleOpen}
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                <Plus className="w-4 h-4" />
                                Get Tags
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium text-gray-900">{cards.length}</span> total cards
                                </div>
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium text-gray-900">{cards.filter((card) => !card.islock).length}</span> unlocked
                                </div>
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium text-gray-900">{cards.filter((card) => card.islock).length}</span> locked
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <NfcCardTable cards={cards} />
            </div>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Create NFC Cards</h2>
                            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            {/* Success Alert */}
                            {success && (
                                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    <p className="text-sm text-green-800">{success}</p>
                                </div>
                            )}

                            {/* Error Alert */}
                            {error && (
                                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            )}

                            {/* Number of IDs Input */}
                            <div>
                                <label htmlFor="numberOfIds" className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Cards
                                </label>
                                <input
                                    id="numberOfIds"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={numberOfIds}
                                    onChange={(e) => setNumberOfIds(e.target.value)}
                                    disabled={processing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                                    placeholder="Enter number of cards to create"
                                />
                            </div>

                            {/* Passcode Input */}
                            <div>
                                <label htmlFor="passcode" className="block text-sm font-medium text-gray-700 mb-2">
                                    Passcode
                                </label>
                                <input
                                    id="passcode"
                                    type="text"
                                    value={passcode}
                                    onChange={(e) => setPasscode(e.target.value)}
                                    disabled={processing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                                    placeholder="Enter passcode for the cards"
                                />
                            </div>

                            {/* Domain Select */}
                            <div>
                                <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
                                    Domain
                                </label>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsDomainDropdownOpen(!isDomainDropdownOpen)}
                                        disabled={processing}
                                        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 flex items-center justify-between"
                                    >
                                        <span className={domain ? 'text-gray-900' : 'text-gray-500'}>{domain || 'Select a domain'}</span>
                                        <svg
                                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDomainDropdownOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {isDomainDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                            {domainOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setDomain(option.value);
                                                        setIsDomainDropdownOpen(false);
                                                    }}
                                                    className={`w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors duration-150 ${
                                                        domain === option.value ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                                                    }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                            <button
                                onClick={handleClose}
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={processing || !numberOfIds || !passcode.trim() || !domain.trim()}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Create Cards
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NfcBusiness;
