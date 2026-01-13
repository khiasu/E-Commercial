"use client";

import { useState, useEffect, useMemo } from "react";
import { PRODUCTS, CATEGORIES, HERO_SLIDES } from "../constants";

export default function Home() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeHero, setActiveHero] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Home");

  // Hero Carousel Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHero((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans scroll-smooth">
      {/* Promotional Banner */}
      <div className="bg-blue-600 text-white py-2 text-center text-sm font-medium">
        🔥 Flat 30% Off on Electronics | Limited Time Offer
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div 
                className="text-2xl font-bold text-blue-600 cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                TECHSTORE
              </div>
              <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-600">
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); setActiveTab("Home"); }}
                  className={`${activeTab === "Home" ? "text-blue-600" : "hover:text-blue-600"} transition`}
                >
                  Home
                </a>
                <a 
                  href="#products" 
                  onClick={(e) => { scrollToSection(e, "products"); setActiveTab("Products"); }}
                  className={`${activeTab === "Products" ? "text-blue-600" : "hover:text-blue-600"} transition`}
                >
                  Products
                </a>
                <a 
                  href="#orders" 
                  onClick={(e) => { scrollToSection(e, "orders"); setActiveTab("Orders"); }}
                  className={`${activeTab === "Orders" ? "text-blue-600" : "hover:text-blue-600"} transition`}
                >
                  My Orders
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-gray-100 border border-gray-200 rounded-full py-2 px-4 pl-10 text-sm focus:ring-2 focus:ring-blue-500 w-64 outline-none transition-all focus:bg-white"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value) {
                      const element = document.getElementById("products");
                      if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
              
              <button className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                Sign In
              </button>

              <button 
                className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors"
                onClick={() => setIsCartOpen(true)}
              >
                🛒
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative h-[500px] overflow-hidden">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${
              index === activeHero ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="absolute inset-0">
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
              <h1 className="text-5xl font-extrabold mb-4 max-w-2xl leading-tight text-white">
                {slide.title}
              </h1>
              <p className="text-xl mb-8 max-w-xl text-gray-200">
                {slide.description}
              </p>
              <button 
                onClick={(e) => scrollToSection(e, "products")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold transition transform hover:scale-105"
              >
                {slide.cta}
              </button>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition ${
                index === activeHero ? "bg-white" : "bg-white/40 hover:bg-white/60"
              }`}
              onClick={() => setActiveHero(index)}
            />
          ))}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat}
                onClick={() => {
                  setSearchQuery(cat);
                  const element = document.getElementById("products");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className={`bg-white border rounded-xl p-6 text-center cursor-pointer hover:shadow-lg transition group ${
                  searchQuery === cat ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
                }`}
              >
                <div className="text-3xl mb-3 transition group-hover:scale-110">
                  {cat === "Audio" && "🎧"}
                  {cat === "Gaming" && "🎮"}
                  {cat === "Laptops" && "💻"}
                  {cat === "Accessories" && "⌚"}
                </div>
                <div className="font-semibold text-gray-800">{cat}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Product Listing Section */}
        <section id="products" className="scroll-mt-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Featured Products"}
            </h2>
            <button 
              onClick={() => setSearchQuery("")}
              className="text-blue-600 font-medium hover:underline"
            >
              {searchQuery ? "Clear Search" : "View All"}
            </button>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition duration-500 hover:scale-110"
                    />
                    <button 
                      className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition ${
                        wishlist.includes(product.id) ? "bg-red-50 text-red-500" : "bg-white text-gray-400 hover:text-red-500"
                      }`}
                      onClick={() => toggleWishlist(product.id)}
                    >
                      {wishlist.includes(product.id) ? "❤️" : "🤍"}
                    </button>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">{product.category}</div>
                    <h3 className="font-bold text-lg mb-1 leading-tight">{product.name}</h3>
                    <div className="flex items-center mb-3">
                      <span className="text-yellow-400 mr-1">⭐</span>
                      <span className="text-sm text-gray-500">{product.rating}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-bold text-gray-900">${product.price}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800">No products found</h3>
              <p className="text-gray-500 mt-2">Try searching for something else or browse categories.</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Reset Search
              </button>
            </div>
          )}
        </section>

        {/* My Orders Placeholder Section */}
        <section id="orders" className="mt-20 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-8">My Orders</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-800">You haven't placed any orders yet.</h3>
            <p className="text-gray-500 mt-2">Browse our latest products and start shopping!</p>
            <button 
              onClick={(e) => scrollToSection(e, "products")}
              className="mt-6 border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Browse Products
            </button>
          </div>
        </section>
      </main>

      {/* Newsletter Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to our newsletter</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Get the latest updates on new products and upcoming sales directly in your inbox.</p>
          <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              required
            />
            <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-6">TECHSTORE</div>
              <p className="text-gray-500 leading-relaxed">
                Elevating your digital lifestyle with high-quality electronics and professional-grade peripherals.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-gray-500">
                <li><a href="#" className="hover:text-blue-600 transition">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Return Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-gray-500">
                <li><a href="#" className="hover:text-blue-600 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Contact</h4>
              <ul className="space-y-4 text-gray-500">
                <li>support@techstore.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Tech Lane, Silicon Valley, CA</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>© 2026 TechStore. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-gray-600">Twitter</a>
              <a href="#" className="hover:text-gray-600">Facebook</a>
              <a href="#" className="hover:text-gray-600">Instagram</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Slide-out Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-in">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold">Your Cart ({cartItemsCount})</h2>
                <button className="text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setIsCartOpen(false)}>✕</button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="text-5xl mb-4">🛒</div>
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                    <button 
                      className="mt-4 text-blue-600 font-semibold"
                      onClick={() => setIsCartOpen(false)}
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-6">
                    {cart.map((item) => (
                      <li key={item.id} className="flex">
                        <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                          <img src={item.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-4 flex-1 flex flex-col">
                          <div className="flex justify-between text-base font-semibold">
                            <h3>{item.name}</h3>
                            <p>${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                          <div className="flex-1 flex items-end justify-between text-sm">
                            <div className="flex items-center border rounded-md">
                              <button 
                                className="px-2 py-1 hover:bg-gray-100 transition"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                −
                              </button>
                              <span className="px-3 py-1 font-medium">{item.quantity}</span>
                              <button 
                                className="px-2 py-1 hover:bg-gray-100 transition"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                +
                              </button>
                            </div>
                            <button 
                              className="font-medium text-red-600 hover:text-red-500 transition"
                              onClick={() => removeFromCart(item.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex justify-between text-lg font-bold mb-6">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition">
                    Checkout Now
                  </button>
                  <p className="mt-4 text-center text-sm text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
