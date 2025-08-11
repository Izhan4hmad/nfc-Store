'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, Filter, Eye, ExternalLink, ChevronDown, Loader2, Inbox } from 'lucide-react';
import { useParams } from 'react-router-dom';

// Interface for a single card object
interface Card {
    _id: string;
    code: string;
    passcode: string;
    url: string;
    domain: string;
    islock: boolean;
    createdAt: string;
}

// Props for the component, including the cards array and an optional loading state
interface NfcCardTableProps {
    cards: Card[];
    loading?: boolean;
}

function NfcCardTable({ cards, loading = false }: NfcCardTableProps) {
    const navigate = useNavigate();
    const { userId } = useParams();

    const domainDropdownRef = useRef<HTMLDivElement>(null);

    // State for pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // State for domain filter
    const [selectedDomain, setSelectedDomain] = useState('all');
    const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);

    // State for search query
    const [searchQuery, setSearchQuery] = useState('');

    // Effect to close the domain dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (domainDropdownRef.current && !domainDropdownRef.current.contains(event.target as Node)) {
                setIsDomainDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [domainDropdownRef]);

    // Get unique domains from cards for the filter dropdown
    const uniqueDomains = [...new Set(cards.map((card) => card.domain))].sort();

    // Filter cards based on selected domain and search query
    const filteredCards = cards.filter((card) => {
        const matchesDomain = selectedDomain === 'all' || card.domain === selectedDomain;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            card.code.toLowerCase().includes(searchLower) ||
            card.passcode.toLowerCase().includes(searchLower) ||
            card.url.toLowerCase().includes(searchLower) ||
            card.domain.toLowerCase().includes(searchLower);
        return matchesDomain && matchesSearch;
    });

    // Calculate paginated data
    const paginatedCards = filteredCards.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const totalPages = Math.ceil(filteredCards.length / rowsPerPage);

    const handleView = (card: Card) => {
        navigate(`/admin/${userId}/nfc-tags/view/${card.code}`, {
            state: { card },
        });
    };

    const handleRedirect = (cardDomain: string, cardId: string) => {
        const url = `${cardDomain.includes('http') ? '' : 'https://'}${cardDomain}/${cardId}`;
        window.open(url, '_blank');
    };

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200/80 overflow-hidden">
            {/* Header with filters and search */}
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* Domain Filter Dropdown */}
                    <div className="relative" ref={domainDropdownRef}>
                        <button
                            onClick={() => setIsDomainDropdownOpen(!isDomainDropdownOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors duration-200 w-full sm:w-[220px] justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">{selectedDomain === 'all' ? 'All Domains' : truncateText(selectedDomain, 20)}</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDomainDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isDomainDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                                <button
                                    onClick={() => {
                                        setSelectedDomain('all');
                                        setIsDomainDropdownOpen(false);
                                        setPage(0);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm"
                                >
                                    All Domains
                                </button>
                                {uniqueDomains.map((domain) => (
                                    <button
                                        key={domain}
                                        onClick={() => {
                                            setSelectedDomain(domain);
                                            setIsDomainDropdownOpen(false);
                                            setPage(0);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm"
                                    >
                                        {domain}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search Input */}
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by code, passcode, URL..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(0);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors duration-200"
                        />
                    </div>
                    <div className="text-sm text-gray-600 font-medium hidden lg:block">
                        {filteredCards.length} result{filteredCards.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100/80 text-gray-600 font-semibold">
                        <tr>
                            <th className="px-6 py-3 text-left">Code / Passcode</th>
                            <th className="px-6 py-3 text-left">Redirect URL</th>
                            <th className="px-6 py-3 text-left">Domain</th>
                            <th className="px-6 py-3 text-center">Status</th>
                            <th className="px-6 py-3 text-left">Created</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-2 text-gray-500">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                        <p className="font-medium">Loading Cards...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : paginatedCards.length > 0 ? (
                            paginatedCards.map((card) => (
                                <tr key={card._id} className="hover:bg-blue-50/50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-bold text-gray-900">{card.code}</div>
                                        <div className="text-xs text-gray-500">{card.passcode}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 max-w-[250px]">
                                        <div className="truncate cursor-help" title={card.url}>
                                            {card.url}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 max-w-[180px]">
                                        <div className="truncate cursor-help" title={card.domain}>
                                            {card.domain}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                card.islock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}
                                        >
                                            {card.islock ? 'Locked' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{new Date(card.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => handleView(card)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200" title="View Details">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleRedirect(card.domain, card.code)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors duration-200"
                                                title="Open Redirect Link"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-2 text-gray-500">
                                        <Inbox className="w-12 h-12 text-gray-300" />
                                        <p className="font-semibold text-base">No NFC Cards Found</p>
                                        <p className="text-sm">Try adjusting your search or domain filter.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {filteredCards.length > rowsPerPage && (
                <div className="px-4 py-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{Math.min(page * rowsPerPage + 1, filteredCards.length)}</span> to{' '}
                            <span className="font-medium">{Math.min((page + 1) * rowsPerPage, filteredCards.length)}</span> of <span className="font-medium">{filteredCards.length}</span> results
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 0}
                                className="p-2 rounded-lg border border-gray-300 enabled:hover:bg-gray-100 disabled:opacity-50 transition-colors duration-200"
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm text-gray-500">
                                Page {page + 1} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page >= totalPages - 1}
                                className="p-2 rounded-lg border border-gray-300 enabled:hover:bg-gray-100 disabled:opacity-50 transition-colors duration-200"
                                aria-label="Next page"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <select
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setPage(0);
                                }}
                                className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value={5}>5 / page</option>
                                <option value={10}>10 / page</option>
                                <option value={25}>25 / page</option>
                                <option value={50}>50 / page</option>
                                <option value={100}>100 / page</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NfcCardTable;
