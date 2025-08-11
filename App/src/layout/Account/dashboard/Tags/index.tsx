
import type React from "react"
import { useEffect, useState } from "react"
import {
  Search,
  Lock,
  Unlock,
  ExternalLink,
  Copy,
  LayoutGrid,
  List
} from "lucide-react"

// Define interface for NFC Card data based on schema
interface NFCCard {
  _id: string
  code: string
  associatedId?: string
  userId?: string
  actionId?: string
  associatedVariantIndex?: number
  passcode: string
  url: string
  domain: string
  islock: boolean
  agencyId?: string
  company_id?: string
  type?: string
  bundleId?: string
}

const Tags: React.FC = () => {
  const [nfcCards, setNfcCards] = useState<NFCCard[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filterBundle, setFilterBundle] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    const fetchNFCCards = async () => {
      try {
        // Static sample NFC card data
        const staticCards: NFCCard[] = [
          {
            _id: "1",
            code: "CARD001",
            passcode: "1234",
            url: "https://example.com/card1",
            domain: "example.com",
            islock: false,
            agencyId: "AGENCY01",
            company_id: "COMP001",
            bundleId: "BUNDLE-A",
          },
          {
            _id: "2",
            code: "CARD002",
            passcode: "5678",
            url: "https://example.com/card2",
            domain: "example.com",
            islock: true,
            agencyId: "AGENCY02",
            company_id: "COMP001",
            bundleId: "BUNDLE-A",
          },
          {
            _id: "3",
            code: "CARD003",
            passcode: "0000",
            url: "https://example.org/card3",
            domain: "example.org",
            islock: false,
            agencyId: "AGENCY03",
            company_id: "COMP002",
            bundleId: "BUNDLE-B",
          },
          {
            _id: "4",
            code: "CARD004",
            passcode: "9999",
            url: "https://example.net/card4",
            domain: "example.net",
            islock: true,
            agencyId: undefined,
            company_id: "COMP002",
            bundleId: undefined,
          },
          {
            _id: "5",
            code: "CARD005",
            passcode: "4321",
            url: "https://sample.com/card5",
            domain: "sample.com",
            islock: false,
            agencyId: "AGENCY04",
            company_id: "COMP003",
            bundleId: "BUNDLE-C",
          },
        ]

        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setNfcCards(staticCards)
      } catch (error) {
        console.error("Error setting static NFC cards:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNFCCards()
  }, [])

  // Filter cards based on search and filters
  const filteredCards = nfcCards.filter((card) => {
    const matchesSearch =
      card.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (card.agencyId?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

    const matchesBundle = filterBundle === "all" || card.bundleId === filterBundle
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "locked" && card.islock) ||
      (filterStatus === "unlocked" && !card.islock)

    return matchesSearch && matchesBundle && matchesStatus
  })

  // Group filtered cards by bundleId
  const groupedCards = filteredCards.reduce(
    (acc, card) => {
      const bundleId = card.bundleId || "No Bundle"
      if (!acc[bundleId]) {
        acc[bundleId] = []
      }
      acc[bundleId].push(card)
      return acc
    },
    {} as Record<string, NFCCard[]>,
  )

  // Get unique bundle IDs for filter
  const uniqueBundles = [...new Set(nfcCards.map((card) => card.bundleId).filter(Boolean))]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-48 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  const CardView = ({ card }: { card: NFCCard }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200">
      <div className="p-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{card.code}</h3>
          <div className="flex items-center gap-2">
            {card.islock ? (
              <Lock  className="w-4 h-4 text-red-500" />
            ) : (
              <Unlock  className="w-4 h-4 text-green-500" />
            )}
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                card.islock ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
              }`}
            >
              {card.islock ? "Locked" : "Unlocked"}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Passcode:</span>
            <div className="flex items-center gap-2">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{card.passcode}</code>
              <button
                onClick={() => copyToClipboard(card.passcode)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Copy  className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Domain:</span>
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded border">{card.domain}</span>
          </div>

          {card.agencyId && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Agency:</span>
              <span className="text-sm text-gray-700">{card.agencyId}</span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(card.url, "_blank")}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <ExternalLink   className="w-3 h-3" />
              Open URL
            </button>
            <button
              onClick={() => copyToClipboard(card.url)}
              className="px-3 py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Copy  className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const ListView = ({ card }: { card: NFCCard }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {card.islock ? (
                <Lock  className="w-4 h-4 text-red-500" />
              ) : (
                <Unlock  className="w-4 h-4 text-green-500" />
              )}
              <span className="font-semibold text-gray-900">{card.code}</span>
            </div>
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded border">{card.domain}</span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                card.islock ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
              }`}
            >
              {card.islock ? "Locked" : "Unlocked"}
            </span>
            {card.agencyId && <span className="text-sm text-gray-500">Agency: {card.agencyId}</span>}
          </div>
          <div className="flex items-center gap-2">
            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{card.passcode}</code>
            <button
              onClick={() => copyToClipboard(card.passcode)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors"
            >
              <Copy  className="w-3 h-3" />
            </button>
            <button
              onClick={() => window.open(card.url, "_blank")}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <ExternalLink   className="w-3 h-3" />
              Open
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">NFC Cards</h1>
          <p className="text-gray-600">Manage and view your NFC card collection ({filteredCards.length} cards)</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <LayoutGrid  className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <List  className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search  className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search by code, domain, or agency..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <select
              value={filterBundle}
              onChange={(e) => setFilterBundle(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Bundles</option>
              {uniqueBundles.map((bundle) => (
                <option key={bundle} value={bundle!}>
                  {bundle}
                </option>
              ))}
              <option value="No Bundle">No Bundle</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="locked">Locked</option>
              <option value="unlocked">Unlocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedCards).length > 0 ? (
            Object.entries(groupedCards).map(([bundleId, cards]) => (
              <div key={bundleId} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">{bundleId}</h2>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">{cards.length} cards</span>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cards.map((card) => (
                      <CardView key={card._id} card={card} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cards.map((card) => (
                      <ListView key={card._id} card={card} />
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-8 text-center">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">No cards found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Tags
