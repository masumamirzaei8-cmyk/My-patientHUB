import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { products, productCategories } from '../data/products';
import { Search, ShoppingCart, X, Plus, Minus, Trash2, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import SafeImage from '../components/SafeImage';

const Marketplace = () => {
  const { cart, addToCart, updateCartQuantity, removeFromCart, clearCart, placeOrder } = useApp();
  const [search, setSearch] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [showProductDetail, setShowProductDetail] = useState(null);

  // Filter for product cards (top section)
  let cardProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !category || p.category === category;
    return matchSearch && matchCategory;
  });

  // Filter for table (bottom section)
  let tableProducts = products.filter(p => {
    return p.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
           p.provider.toLowerCase().includes(tableSearch.toLowerCase()) ||
           p.category.toLowerCase().includes(tableSearch.toLowerCase());
  });

  // Sort table
  if (sortBy) {
    tableProducts = [...tableProducts].sort((a, b) => {
      let valA, valB;
      if (sortBy === 'name') { valA = a.name; valB = b.name; }
      else if (sortBy === 'price') { valA = a.price; valB = b.price; }
      else if (sortBy === 'provider') { valA = a.provider; valB = b.provider; }
      else if (sortBy === 'category') { valA = a.category; valB = b.category; }
      
      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }

  // Pagination
  const totalPages = Math.ceil(tableProducts.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedProducts = tableProducts.slice(startIndex, startIndex + entriesPerPage);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = () => {
    placeOrder();
    setShowCheckout(false);
    setShowCart(false);
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 4000);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleBuyNow = (product) => {
    setShowProductDetail(product);
  };

  return (
    <div className="space-y-6">
      {orderSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5" /> Order placed successfully! (Demo — no real transaction)
        </div>
      )}

      {/* Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Search Marketplaces and order what you need</h2>
        <p className="text-gray-500 text-sm">Find healthy food, wellness products, and medical supplies</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm">
          <option value="">All Categories</option>
          {productCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => setShowCart(true)} className="btn-primary flex items-center gap-2 relative">
          <ShoppingCart className="w-4 h-4" /> Cart
          {cartCount > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{cartCount}</span>}
        </button>
      </div>

      {/* Product Cards */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Featured Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cardProducts.slice(0, 4).map(p => (
            <div key={p.id} className="product-card">
              <div className="product-card-image relative">
                <SafeImage
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '3rem' }}>🛒</div>}
                />
                {p.discount > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    -{p.discount}%
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{p.providerLogo}</span>
                  <span className="text-xs text-gray-500">{p.provider}</span>
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">{p.name}</h4>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold" style={{ color: '#E60093' }}>{formatCurrency(p.price)}</span>
                  </div>
                  <button onClick={() => handleBuyNow(p)} className="btn-primary text-xs py-1.5 px-3">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-bold text-gray-800">Other results for "{search || 'healthy diet'}" search</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show</span>
            <select value={entriesPerPage} onChange={e => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="px-2 py-1 border border-gray-200 rounded-lg text-sm">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span className="text-sm text-gray-500">entries</span>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search in results..." value={tableSearch} onChange={e => { setTableSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
        </div>

        <div className="overflow-x-auto responsive-table">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700" onClick={() => handleSort('name')}>
                  Product {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700 hidden md:table-cell" onClick={() => handleSort('category')}>
                  Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700 hidden sm:table-cell" onClick={() => handleSort('provider')}>
                  Provider {sortBy === 'provider' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Discount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700" onClick={() => handleSort('price')}>
                  Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <SafeImage
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="w-10 h-10 rounded-lg object-cover"
                        fallback={<span style={{ fontSize: '1.5rem' }}>🛒</span>}
                      />
                      <span className="text-sm font-medium text-gray-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{p.category}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-1">
                      <span className="text-sm">{p.providerLogo}</span>
                      <span className="text-xs text-gray-600">{p.provider}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {p.discount > 0 ? (
                      <span className="text-xs font-bold text-red-500">-{p.discount}%</span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold" style={{ color: '#E60093' }}>{formatCurrency(p.price)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500">{p.id.toUpperCase()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleBuyNow(p)} className="text-xs px-3 py-1.5 btn-blue rounded-lg font-medium">
                      Buy Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found matching your search.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, tableProducts.length)} of {tableProducts.length} entries
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium ${currentPage === page ? 'btn-primary' : 'border border-gray-200 hover:bg-gray-50'}`}>
                  {page}
                </button>
              ))}
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {showProductDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Product Details</h3>
              <button onClick={() => setShowProductDetail(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="text-center mb-4">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl overflow-hidden mb-4">
                <SafeImage
                  src={showProductDetail.image}
                  alt={showProductDetail.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '3rem' }}>🛒</div>}
                />
              </div>
              <h4 className="text-lg font-bold text-gray-800">{showProductDetail.name}</h4>
              <p className="text-sm text-gray-500 mt-1">{showProductDetail.description}</p>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Provider</span>
                <span className="text-sm font-medium flex items-center gap-1">
                  <span>{showProductDetail.providerLogo}</span>
                  {showProductDetail.provider}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Category</span>
                <span className="text-sm font-medium">{showProductDetail.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Price</span>
                <span className="text-lg font-bold" style={{ color: '#E60093' }}>{formatCurrency(showProductDetail.price)}</span>
              </div>
              {showProductDetail.discount > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Discount</span>
                  <span className="text-sm font-bold text-red-500">-{showProductDetail.discount}%</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowProductDetail(null)} className="flex-1 btn-secondary py-2.5">Cancel</button>
              <button onClick={() => { addToCart({ productId: showProductDetail.id, name: showProductDetail.name, price: showProductDetail.price, image: showProductDetail.image }); setShowProductDetail(null); }} className="flex-1 btn-primary py-2.5">Add to Cart</button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Shopping Cart</h3>
              <button onClick={() => setShowCart(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map(item => (
                    <div key={item.productId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="w-12 h-12 rounded-lg object-cover"
                        fallback={<span style={{ fontSize: '1.5rem' }}>🛒</span>}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{formatCurrency(item.price)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateCartQuantity(item.productId, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.productId, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => removeFromCart(item.productId)} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-500 ml-1">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-4 text-lg">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold" style={{ color: '#E60093' }}>{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={clearCart} className="flex-1 btn-secondary py-2.5 text-sm">Clear Cart</button>
                    <button onClick={() => { setShowCart(false); setShowCheckout(true); }} className="flex-1 btn-primary py-2.5 text-sm">Checkout</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Order Summary</h3>
              <button onClick={() => setShowCheckout(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 mb-4">
              {cart.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name} × {item.quantity}</span>
                  <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span style={{ color: '#E60093' }}>{formatCurrency(cartTotal)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-4 text-center">This is a demo checkout. No real payment will be processed.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowCheckout(false)} className="flex-1 btn-secondary py-2.5">Back</button>
              <button onClick={handlePlaceOrder} className="flex-1 btn-primary py-2.5">Place Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
