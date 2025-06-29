import Image from "next/image";

export default function Home() {
  return (
     <div className="min-h-screen bg-gray-100 font-inter antialiased">
      {/* Navbar */}
      <nav className="bg-indigo-700 p-4 shadow-md rounded-b-lg">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo and App Name */}
          <div className="flex items-center">
            {/* Using a placeholder image for the logo, ideally replace with your Pruto logo */}
            <img
              src="https://placehold.co/40x40/4f46e5/ffffff?text=P"
              alt="Pruto Logo"
              className="w-10 h-10 mr-3 rounded-full"
            />
            <h1 className="text-white text-2xl font-bold">Pruto</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <a href="#" className="text-white hover:text-indigo-200 transition-colors duration-200">Home</a>
            <a href="#" className="text-white hover:text-indigo-200 transition-colors duration-200">Shop</a>
            <a href="#" className="text-white hover:text-indigo-200 transition-colors duration-200">Categories</a>
            <a href="#" className="text-white hover:text-indigo-200 transition-colors duration-200">About</a>
            <a href="#" className="text-white hover:text-indigo-200 transition-colors duration-200">Contact</a>
          </div>

          {/* User Actions (e.g., Cart, Login) */}
          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-indigo-200 transition-colors duration-200 p-2 rounded-full hover:bg-indigo-600">
              {/* Shopping Cart Icon (example using Lucide React, assuming availability) */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </button>
            <button className="bg-white text-indigo-700 px-4 py-2 rounded-md font-semibold hover:bg-indigo-100 transition-colors duration-200">
              Login
            </button>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden">
            <button className="text-white p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 text-center shadow-lg rounded-b-lg mx-4 mt-4">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Discover Your Next Favorite Item!</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">Shop the latest trends and exclusive deals at Pruto.</p>
          <button className="bg-white text-indigo-700 px-8 py-3 rounded-full text-lg font-semibold shadow-xl hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105">
            Shop Now
          </button>
        </div>
      </header>

      {/* Product Grid Section */}
      <section className="container mx-auto px-4 py-12">
        <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Example Product Card 1 */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center text-center">
            <img
              src="https://placehold.co/200x180/eef2ff/4f46e5?text=Product+1"
              alt="Product Image"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Stylish Smartwatch</h4>
            <p className="text-gray-600 mb-3 line-clamp-2">Track your fitness and stay connected with this elegant smartwatch.</p>
            <p className="text-xl font-bold text-indigo-600 mb-4">$199.99</p>
            <button className="bg-indigo-500 text-white px-5 py-2 rounded-full hover:bg-indigo-600 transition-colors duration-200">
              Add to Cart
            </button>
          </div>

          {/* Example Product Card 2 */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center text-center">
            <img
              src="https://placehold.co/200x180/eef2ff/4f46e5?text=Product+2"
              alt="Product Image"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Wireless Earbuds</h4>
            <p className="text-gray-600 mb-3 line-clamp-2">Immersive sound and comfortable fit for your daily adventures.</p>
            <p className="text-xl font-bold text-indigo-600 mb-4">$89.99</p>
            <button className="bg-indigo-500 text-white px-5 py-2 rounded-full hover:bg-indigo-600 transition-colors duration-200">
              Add to Cart
            </button>
          </div>

          {/* Example Product Card 3 */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center text-center">
            <img
              src="https://placehold.co/200x180/eef2ff/4f46e5?text=Product+3"
              alt="Product Image"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">High-Performance Laptop</h4>
            <p className="text-gray-600 mb-3 line-clamp-2">Boost your productivity with this powerful and sleek laptop.</p>
            <p className="text-xl font-bold text-indigo-600 mb-4">$1299.00</p>
            <button className="bg-indigo-500 text-white px-5 py-2 rounded-full hover:bg-indigo-600 transition-colors duration-200">
              Add to Cart
            </button>
          </div>

          {/* Example Product Card 4 */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center text-center">
            <img
              src="https://placehold.co/200x180/eef2ff/4f46e5?text=Product+4"
              alt="Product Image"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Designer Backpack</h4>
            <p className="text-gray-600 mb-3 line-clamp-2">Carry your essentials in style with this durable and trendy backpack.</p>
            <p className="text-xl font-bold text-indigo-600 mb-4">$75.50</p>
            <button className="bg-indigo-500 text-white px-5 py-2 rounded-full hover:bg-indigo-600 transition-colors duration-200">
              Add to Cart
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12 rounded-t-lg">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Pruto. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
