"use client"

import React, { useState, useRef, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useParams } from "react-router-dom"

import {
  QrCode,
  Download,
  Copy,
  Edit,
  Save,
  X,
  Link,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  ExternalLink,
  Package,
  DollarSign,
  Hash,
  Palette,
  Maximize,
  Shapes,
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import html2canvas from "html2canvas"
import { useAppServices } from "../../../../../hook/services"

interface Card {
  _id: string
  code: string
  passcode: string
  url: string
  domain: string
  islock: boolean
  createdAt: string
  associatedId?: string // Now stores variant ID instead of product ID
}

interface Variant {
  _id?: string
  title: string
  dimension: string
  color: string
  shape: string
  quantity: number
  unitPrice: number
  resellingPrice: number
}

interface Product {
  _id: string
  productName: string
  productDescription?: string
  imageUrls: string[]
  variants: Variant[]
}

interface NotificationProps {
  message: string
  type: "success" | "error" | "warning" | "info"
  onClose: () => void
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: AlertCircle,
  }

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  }

  const Icon = icons[type]

  useEffect(() => {
    const timer = setTimeout(onClose, 6000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2">
      <div className={`flex items-center gap-3 p-4 rounded-lg border ${colors[type]} shadow-lg max-w-md`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">{message}</p>
        <button onClick={onClose} className="ml-auto p-1 hover:bg-black/10 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

const downloadQRCode = async () => {
  const qrCodeContainer = document.getElementById("qr-code-container")
  if (qrCodeContainer) {
    const canvas = await html2canvas(qrCodeContainer, {
      scale: 2,
      useCORS: true,
    })
    const pngUrl = canvas.toDataURL("image/png")
    const downloadLink = document.createElement("a")
    downloadLink.href = pngUrl
    downloadLink.download = "nfc-card-qrcode.png"
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }
}

const copyToClipboard = async (text: string, showNotification: (message: string, type: string) => void) => {
  try {
    await navigator.clipboard.writeText(text)
    showNotification("URL copied to clipboard!", "success")
  } catch (err) {
    console.error("Could not copy text: ", err)
    showNotification("Failed to copy URL.", "error")
  }
}

const CardView = React.memo(function CardView() {
  const location = useLocation()
  const { userId, cardId } = useParams()
  const card = location.state?.card as Card
  console.log("CardView rendered with card:", card)
  const AppService = useAppServices()
  const [modalOpen, setModalOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedVariant, setSelectedVariant] = useState("")
  const [associatedVariant, setAssociatedVariant] = useState<{
    variant: Variant
    productName: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [urlLoading, setUrlLoading] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null)
  const [url, setUrl] = useState(card?.url || "")
  const [isUrlEditable, setIsUrlEditable] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const hasFetchedProducts = useRef(false)

  const qrCodeUrl =
    card?.domain && card?.code
      ? card.domain.includes("http")
        ? `${card.domain}/${card.code}`
        : `https://${card.domain}/${card.code}`
      : ""

  const showNotification = (message: string, type: string) => {
    setNotification({ message, type })
  }

  // Get all variants from all products for selection
  const allVariants = products.flatMap((product) =>
    product.variants.map((variant) => ({
      ...variant,
      productName: product.productName,
      productId: product._id,
    })),
  )

  const filteredVariants = allVariants.filter(
    (variant) =>
      variant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      variant.productName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  useEffect(() => {
    const fetchData = async () => {
      if (hasFetchedProducts.current) return

      setLoading(true)
      try {
        const { response } = await AppService.productsPage.GetProductByMerchantId({
          query: `merchantId=${userId}`,
        })
        if (response && response.data) {
          const productList = Array.isArray(response.data) ? response.data : [response.data]
          setProducts(productList)
              console.log("Checking productList:", productList)

          // Find associated variant if card has associatedId
          if (card?.associatedId) {
            for (const product of productList) {
              const variant = product.variants.find((v: Variant) => v._id === card.associatedId)
              console.log("Checking variant:", variant)
              if (variant) {
                setAssociatedVariant({
                  variant,
                  productName: product.productName,
                })
                break
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        showNotification("Failed to load products", "error")
      } finally {
        setLoading(false)
        hasFetchedProducts.current = true
      }
    }

    fetchData()
  }, [card])

  const handleSave = async () => {
    if (selectedVariant && card?.code) {
      setLoading(true)
      try {
        const payload = {
          code: card.code,
          associatedId: selectedVariant, // Now saving variant ID
        }

        const { response } = await AppService.nfcbusinessCard.update({
          payload,
        })

        if (response?.success) {
          // Find the selected variant and its product
          for (const product of products) {
            const variant = product.variants.find((v: Variant) => v._id === selectedVariant)
            if (variant) {
              setAssociatedVariant({
                variant,
                productName: product.productName,
              })
              break
            }
          }
          showNotification("Variant associated successfully!", "success")
          setModalOpen(false)
          setSelectedVariant("")
          setSearchQuery("")
        } else {
          showNotification("Failed to associate variant: " + (response?.message || "Unknown error"), "error")
        }
      } catch (error) {
        console.error("Error associating variant:", error)
        showNotification("Error associating variant", "error")
      } finally {
        setLoading(false)
      }
    } else {
      showNotification("Please select a variant to associate.", "warning")
    }
  }

  const handleSaveUrl = async () => {
    if (url && card?.code && url !== card.url) {
      setUrlLoading(true)
      try {
        const { response } = await AppService.nfcbusinessCard.update({
          payload: {
            code: card.code,
            url: url,
          },
        })

        if (response?.success) {
          showNotification("URL updated successfully!", "success")
          setIsUrlEditable(false)
        } else {
          showNotification("Failed to update URL: " + (response?.message || "Unknown error"), "error")
        }
      } catch (error) {
        console.error("Error updating URL:", error)
        showNotification("Error updating URL", "error")
      } finally {
        setUrlLoading(false)
      }
    } else {
      showNotification("No changes to save or URL is invalid.", "warning")
      setIsUrlEditable(false)
    }
  }

  const formatUrl = (url: string) => {
    if (!url) return ""
    return url.length > 30 ? `${url.substring(0, 30)}...` : url
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Card Data Available</h2>
          <p className="text-gray-600 mb-6">There is no NFC card data to display. Please select a valid card.</p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">NFC Card Details</h1>
                <p className="text-sm text-gray-500">Card Code: {card.code}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  associatedVariant ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {associatedVariant ? "Associated" : "Not Associated"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - QR Code and Card Details */}
          <div className="space-y-6">
            {/* QR Code Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <QrCode className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">QR Code</h2>
              </div>

              <div id="qr-code-container" className="flex flex-col items-center">
                <div className="p-4 bg-white rounded-lg shadow-sm border-2 border-blue-200 mb-4">
                  <QRCodeSVG
                    value={qrCodeUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                    bgColor="#FFFFFF"
                    fgColor="#1F2937"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadQRCode}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => copyToClipboard(qrCodeUrl, showNotification)}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Copy className="w-4 h-4" />
                    Copy URL
                  </button>
                </div>
              </div>
            </div>

            {/* Card Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Card Information</h2>

              <div className="space-y-4">
                {/* URL Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card URL</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {isUrlEditable ? (
                      <>
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-gray-900"
                          placeholder="Enter URL"
                        />
                        <button
                          onClick={handleSaveUrl}
                          disabled={urlLoading || url === card.url}
                          className="p-1.5 text-green-600 hover:bg-green-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          {urlLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => {
                            setUrl(card.url || "")
                            setIsUrlEditable(false)
                          }}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm font-mono text-gray-900">{formatUrl(url || "")}</span>
                        <button
                          onClick={() => setIsUrlEditable(true)}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(url || "", showNotification)}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors duration-200"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors duration-200"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* Card Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Code</label>
                  <p className="text-sm font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{card.code}</p>
                </div>

                {/* Domain */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{card.domain}</p>
                </div>
              </div>
            </div>

            {/* Mobile Associate Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Package className="w-5 h-5" />
                {associatedVariant ? "Change Associated Variant" : "Associate Variant"}
              </button>
            </div>
          </div>

          {/* Right Column - Associated Variant */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Associated Variant</h2>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="hidden lg:inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Package className="w-4 h-4" />
                {associatedVariant ? "Change" : "Associate"}
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : associatedVariant ? (
              <div className="space-y-6">
                {/* Product Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{associatedVariant.productName}</h3>
                  <p className="text-sm text-blue-600 font-medium">Product</p>
                </div>

                {/* Product Images */}
                {/* {products.find((p) => p.variants.some((v) => v._id === associatedVariant.variant._id))?.imageUrls
                  ?.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Product Images</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {products
                        .find((p) => p.variants.some((v) => v._id === associatedVariant.variant._id))
                        ?.imageUrls?.slice(0, 6)
                        .map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={imageUrl || "/placeholder.svg?height=120&width=120"}
                              alt={`${associatedVariant.productName} ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                              onClick={() => window.open(imageUrl, "_blank")}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-200" />
                          </div>
                        ))}
                    </div>
                    {products.find((p) => p.variants.some((v) => v._id === associatedVariant.variant._id))?.imageUrls
                      ?.length > 6 && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        +
                        {products.find((p) => p.variants.some((v) => v._id === associatedVariant.variant._id))
                          ?.imageUrls?.length - 6}{" "}
                        more images
                      </p>
                    )}
                  </div>
                )} */}

                {/* Variant Details */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">{associatedVariant.variant.title}</h4>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Color - Always shown */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Palette className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Color</p>
                          <p className="text-sm font-medium text-gray-900">{associatedVariant.variant.color}</p>
                        </div>
                        <div
                          className="w-6 h-6 rounded border border-gray-300 ml-auto"
                          style={{ backgroundColor: associatedVariant.variant.color }}
                        />
                      </div>
                    </div>

                    {/* Quantity - Always shown */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Hash className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Quantity</p>
                        <p className="text-sm font-medium text-gray-900">{associatedVariant.variant.quantity} pcs</p>
                      </div>
                    </div>

                    {/* Optional Attributes */}
                    {(associatedVariant.variant.dimension || associatedVariant.variant.shape) && (
                      <div className="grid grid-cols-2 gap-4">
                        {/* Dimension - Only if set */}
                        {associatedVariant.variant.dimension && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Maximize className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Dimension</p>
                              <p className="text-sm font-medium text-gray-900 capitalize">
                                {associatedVariant.variant.dimension}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Shape - Only if set */}
                        {associatedVariant.variant.shape && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Shapes className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Shape</p>
                              <p className="text-sm font-medium text-gray-900 capitalize">
                                {associatedVariant.variant.shape}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <p className="text-xs text-green-600 uppercase tracking-wide font-medium">Unit Price</p>
                      </div>
                      <p className="text-xl font-bold text-green-700">
                        ${associatedVariant.variant.unitPrice.toFixed(2)}
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <p className="text-xs text-blue-600 uppercase tracking-wide font-medium">Selling Price</p>
                      </div>
                      <p className="text-xl font-bold text-blue-700">
                        ${associatedVariant.variant.resellingPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Profit Margin */}
                  <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-purple-700">Profit Margin</p>
                      <p className="text-lg font-bold text-purple-700">
                        {(
                          ((associatedVariant.variant.resellingPrice - associatedVariant.variant.unitPrice) /
                            associatedVariant.variant.resellingPrice) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Variant Associated</h3>
                <p className="text-gray-600 mb-6 max-w-sm">
                  This NFC card is not associated with any product variant yet. Click the button to link a variant.
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  <Link className="w-4 h-4" />
                  Associate a Variant
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Associate Product Variant</h2>
              <button
                onClick={() => {
                  setModalOpen(false)
                  setSelectedVariant("")
                  setSearchQuery("")
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              <p className="text-sm text-gray-600">
                Select a product variant to associate with this NFC card. Users scanning this card will be directed to
                the specific variant.
              </p>

              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search variants or products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Variant List */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredVariants.length > 0 ? (
                  filteredVariants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => setSelectedVariant(variant._id || "")}
                      className={`w-full p-4 text-left rounded-lg border transition-colors duration-200 ${
                        selectedVariant === variant._id
                          ? "border-blue-500 bg-blue-50 text-blue-900"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {/* Product Image Preview */}
                          {products.find((p) => p._id === variant.productId)?.imageUrls?.[0] && (
                            <img
                              src={
                                products.find((p) => p._id === variant.productId)?.imageUrls?.[0] ||
                                "/placeholder.svg?height=40&width=40"
                              }
                              alt={variant.productName}
                              className="w-10 h-10 object-cover rounded border border-gray-200 flex-shrink-0"
                            />
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm mb-1 truncate">{variant.title}</div>
                            <div className="text-xs text-gray-500 mb-2 truncate">{variant.productName}</div>

                            <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap">
                              {variant.dimension && (
                                <div className="flex items-center gap-1">
                                  <Maximize className="w-3 h-3" />
                                  <span className="capitalize">{variant.dimension}</span>
                                </div>
                              )}
                              {variant.shape && (
                                <div className="flex items-center gap-1">
                                  <Shapes className="w-3 h-3" />
                                  <span className="capitalize">{variant.shape}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <div
                                  className="w-3 h-3 rounded border border-gray-300"
                                  style={{ backgroundColor: variant.color }}
                                />
                                <span>{variant.color}</span>
                              </div>
                              {!variant.dimension && !variant.shape && (
                                <span className="text-gray-400 italic">Basic variant</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-medium text-gray-900">${variant.resellingPrice.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">{variant.quantity} pcs</div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No variants found</p>
                  </div>
                )}
              </div>

              {/* Current Association Info */}
              {associatedVariant && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Currently associated with:</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    {associatedVariant.variant.title} ({associatedVariant.productName})
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setModalOpen(false)
                  setSelectedVariant("")
                  setSearchQuery("")
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedVariant || loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Association
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type as "success" | "error" | "warning" | "info"}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  )
})

export default CardView
