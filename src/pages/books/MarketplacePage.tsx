import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Book {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  category: string;
  price: number;
  cover_image_url: string | null;
  file_url: string;
  downloads: number;
  rating: number;
  year: number | null;
  created_at: string;
}

export default function MarketplacePage() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Fiction', 'Programming', 'Self Help', 'Finance', 'History', 'Legal', 'Business', 'Education'];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('legal_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1
                className="text-2xl font-bold text-teal-600 cursor-pointer"
                style={{ fontFamily: '"Pacifico", serif' }}
                onClick={() => navigate('/')}
              >
                LegalHub
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {profile?.user_type === 'admin' && (
                    <button
                      onClick={() => navigate('/books/post')}
                      className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      <i className="ri-add-line mr-2"></i>
                      Post Book
                    </button>
                  )}
                  <span className="text-gray-700">{profile?.full_name || user.email}</span>
                  <button
                    onClick={async () => {
                      await signOut();
                      navigate('/auth/login');
                    }}
                    className="text-gray-700 hover:text-teal-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="text-gray-700 hover:text-teal-600 font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/auth/register')}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Book Catalog</h2>
          <p className="text-gray-600">View all available books. Purchases are made through the mobile app.</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-search-line text-gray-400"></i>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search books by title, author, or description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="text-center py-12">
            <i className="ri-loader-4-line text-4xl animate-spin text-teal-600"></i>
            <p className="mt-4 text-gray-600">Loading books...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <i className="ri-book-open-line text-6xl text-gray-400 mb-4"></i>
            <p className="text-xl text-gray-600">No books found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="aspect-[3/4] bg-gray-200 relative">
                  {book.cover_image_url ? (
                    <img
                      src={book.cover_image_url}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/300x400?text=No+Cover';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-blue-100">
                      <i className="ri-book-open-line text-6xl text-teal-600"></i>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  {book.author && (
                    <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                  )}
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {book.description || 'No description available'}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {book.category}
                    </span>
                    <span className="font-bold text-teal-600">GHS {book.price.toFixed(2)}</span>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-blue-800">
                      <i className="ri-smartphone-line mr-1"></i>
                      Purchase in mobile app
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

