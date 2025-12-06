import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

interface Document {
  id: string;
  title: string;
  category: string;
  year: number;
  downloads: number;
  created_at: string;
  price: number;
  rating: number;
}

export default function LegalLibrary() {
  const { profile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  const [bulkUploadData, setBulkUploadData] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'Constitutional Law',
    year: new Date().getFullYear(),
    price: 0,
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const categories = ['All', 'Constitutional Law', 'Criminal Law', 'Family Law', 'Corporate Law', 'Property Law', 'Labour Law', 'Commercial Law', 'Civil Law'];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('legal_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    // Validate form data
    if (!formData.title.trim()) {
      alert('Please enter a document title');
      return;
    }

    if (!formData.year || formData.year < 1900 || formData.year > 2100) {
      alert('Please enter a valid year (1900-2100)');
      return;
    }

    if (formData.price < 0 || isNaN(formData.price)) {
      alert('Please enter a valid price');
      return;
    }

    setUploadLoading(true);

    try {
      let fileUrl = '';
      let coverImageUrl = '';

      // Try to upload file to Supabase Storage
      try {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `documents/${fileName}`;

        // Check if bucket exists, if not, use a fallback
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(b => b.name === 'legal-documents');

        if (bucketExists) {
          const { error: uploadError } = await supabase.storage
            .from('legal-documents')
            .upload(filePath, selectedFile);

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('legal-documents')
            .getPublicUrl(filePath);

          fileUrl = publicUrl;
          coverImageUrl = publicUrl;
        } else {
          // If bucket doesn't exist, create a data URL or use a placeholder
          console.warn('Storage bucket "legal-documents" not found. Please create it in Supabase Storage or provide file URLs manually.');
          alert('Storage bucket not found. Please create the "legal-documents" bucket in Supabase Storage, or use the bulk upload feature with file URLs.');
          setUploadLoading(false);
          return;
        }
      } catch (storageError: any) {
        console.error('Storage error:', storageError);
        if (storageError.message?.includes('Bucket not found')) {
          alert('Storage bucket "legal-documents" not found. Please create it in Supabase Dashboard → Storage, or use bulk upload with file URLs.');
          setUploadLoading(false);
          return;
        }
        throw storageError;
      }

      // Insert document record
      const { data, error } = await supabase
        .from('legal_documents')
        .insert([
          {
            title: formData.title.trim(),
            category: formData.category,
            year: formData.year || new Date().getFullYear(),
            price: formData.price || 0,
            description: formData.description.trim() || null,
            downloads: 0,
            rating: 0,
            cover_image_url: coverImageUrl || null,
            file_url: fileUrl || null
          }
        ])
        .select();

      if (error) throw error;

      // Refresh documents list
      await fetchDocuments();

      // Reset form and close modal
      setFormData({
        title: '',
        category: 'Constitutional Law',
        year: new Date().getFullYear(),
        price: 0,
        description: ''
      });
      setSelectedFile(null);
      setShowUploadModal(false);
      alert('Document uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading document:', error);
      const errorMessage = error.message || 'Failed to upload document. Please try again.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const { error } = await supabase
        .from('legal_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh documents list
      await fetchDocuments();
      alert('Document deleted successfully!');
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkUploadData.trim()) {
      alert('Please paste the book data JSON');
      return;
    }

    setBulkUploadLoading(true);

    try {
      // Parse JSON data
      let booksData: any[];
      try {
        booksData = JSON.parse(bulkUploadData);
      } catch (e) {
        alert('Invalid JSON format. Please check your data.');
        setBulkUploadLoading(false);
        return;
      }

      if (!Array.isArray(booksData)) {
        alert('Data must be an array of books');
        setBulkUploadLoading(false);
        return;
      }

      // Process each book
      const booksToInsert = booksData.map((book: any) => {
        const price = typeof book.price === 'number' ? book.price : (parseFloat(String(book.price)) || 0);
        const year = typeof book.year === 'number' ? book.year : (parseInt(String(book.year)) || new Date().getFullYear());
        
        return {
          title: book.title || book.name || 'Untitled',
          author: book.author || null,
          description: book.description || null,
          category: book.category || 'Constitutional Law',
          price: isNaN(price) ? 0 : price,
          year: isNaN(year) ? new Date().getFullYear() : year,
          cover_image_url: book.cover_image_url || book.coverImage || null,
          file_url: book.file_url || book.pdfLink || null,
          downloads: 0,
          rating: 0
        };
      });

      // Insert books in batches of 10
      const batchSize = 10;
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < booksToInsert.length; i += batchSize) {
        const batch = booksToInsert.slice(i, i + batchSize);
        const { error } = await supabase
          .from('legal_documents')
          .insert(batch);

        if (error) {
          console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
          errorCount += batch.length;
        } else {
          successCount += batch.length;
        }
      }

      // Refresh documents list
      await fetchDocuments();

      // Reset form and close modal
      setBulkUploadData('');
      setShowBulkUploadModal(false);

      alert(`Bulk upload complete! ${successCount} books uploaded successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}.`);
    } catch (error) {
      console.error('Error in bulk upload:', error);
      alert('Failed to upload books. Please check the console for details.');
    } finally {
      setBulkUploadLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Legal Library Management</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowBulkUploadModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            <i className="ri-upload-cloud-2-line mr-2"></i>Bulk Upload
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <i className="ri-upload-line mr-2"></i>Upload Document
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Document</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Category</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Year</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Price</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Downloads</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    <i className="ri-loader-4-line text-2xl animate-spin"></i>
                    <p className="mt-2">Loading documents...</p>
                  </td>
                </tr>
              ) : filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No documents found
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <i className="ri-file-text-line text-blue-600"></i>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{doc.title}</h3>
                          <p className="text-sm text-gray-500">Uploaded {new Date(doc.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900">{doc.category}</td>
                    <td className="py-4 px-6 text-gray-900">{doc.year}</td>
                    <td className="py-4 px-6 text-gray-900">GHS {doc.price.toFixed(2)}</td>
                    <td className="py-4 px-6 text-gray-900">{doc.downloads}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <i className="ri-eye-line"></i>
                        </button>
                        <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
                          <i className="ri-edit-line"></i>
                        </button>
                        <button 
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowUploadModal(false);
            }
          }}
        >
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-gray-900">Upload Document</h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    required
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <i className="ri-upload-cloud-line text-4xl text-gray-400 mb-2"></i>
                    <p className="text-sm text-gray-600">
                      {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter document title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                >
                  <option>Constitutional Law</option>
                  <option>Criminal Law</option>
                  <option>Family Law</option>
                  <option>Corporate Law</option>
                  <option>Property Law</option>
                  <option>Labour Law</option>
                  <option>Commercial Law</option>
                  <option>Civil Law</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <input
                  type="number"
                  required
                  value={formData.year || ''}
                  onChange={(e) => {
                    const yearValue = e.target.value === '' ? new Date().getFullYear() : parseInt(e.target.value) || new Date().getFullYear();
                    setFormData({ ...formData, year: yearValue });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2024"
                  min="1900"
                  max="2100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (GHS)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price || ''}
                  onChange={(e) => {
                    const priceValue = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                    setFormData({ ...formData, price: priceValue });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter document description"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap disabled:opacity-50"
                >
                  {uploadLoading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowBulkUploadModal(false);
              setBulkUploadData('');
            }
          }}
        >
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-gray-900">Bulk Upload Books</h2>
              <button 
                onClick={() => {
                  setShowBulkUploadModal(false);
                  setBulkUploadData('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <i className="ri-information-line mr-2"></i>
                  <strong>Instructions:</strong>
                </p>
                <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
                  <li>Paste your book data as a JSON array</li>
                  <li>Each book should have: title, author (optional), description (optional), category, price, year (optional), cover_image_url (optional), file_url (optional)</li>
                  <li>Example format: <code className="bg-blue-100 px-1 rounded">[{"{"}"title": "Book Name", "category": "Constitutional Law", "price": 10{"}"}]</code></li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Book Data (JSON Array)
                </label>
                <textarea
                  value={bulkUploadData}
                  onChange={(e) => setBulkUploadData(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  rows={15}
                  placeholder='[{"title": "Book 1", "category": "Constitutional Law", "price": 10, "author": "Author Name", "description": "Description", "year": 2024, "file_url": "https://example.com/book.pdf", "cover_image_url": "https://example.com/cover.jpg"}]'
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBulkUploadModal(false);
                    setBulkUploadData('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBulkUpload}
                  disabled={bulkUploadLoading || !bulkUploadData.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap disabled:opacity-50"
                >
                  {bulkUploadLoading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="ri-upload-cloud-2-line mr-2"></i>
                      Upload Books
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}