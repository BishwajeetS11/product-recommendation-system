import React, { useState } from 'react';
import { Search, ShoppingBag, Sparkles, X } from 'lucide-react';

// Mock product database
const PRODUCTS = [
  {
    id: 1,
    name: "iPhone 14 Pro",
    price: 999,
    category: "phone",
    description: "Latest Apple flagship with A16 chip, 48MP camera",
    brand: "Apple"
  },
  {
    id: 2,
    name: "Samsung Galaxy S23",
    price: 799,
    category: "phone",
    description: "Android flagship with excellent camera and display",
    brand: "Samsung"
  },
  {
    id: 3,
    name: "Google Pixel 7",
    price: 599,
    category: "phone",
    description: "Best Android camera experience with clean software",
    brand: "Google"
  },
  {
    id: 4,
    name: "OnePlus 11",
    price: 699,
    category: "phone",
    description: "Fast charging flagship with great performance",
    brand: "OnePlus"
  },
  {
    id: 5,
    name: "MacBook Pro 14",
    price: 1999,
    category: "laptop",
    description: "M2 Pro chip, perfect for developers and creators",
    brand: "Apple"
  },
  {
    id: 6,
    name: "Dell XPS 15",
    price: 1499,
    category: "laptop",
    description: "Premium Windows laptop with excellent build quality",
    brand: "Dell"
  },
  {
    id: 7,
    name: "ASUS ROG Strix",
    price: 1299,
    category: "laptop",
    description: "Gaming laptop with RTX 4060, 144Hz display",
    brand: "ASUS"
  },
  {
    id: 8,
    name: "Lenovo ThinkPad X1",
    price: 1399,
    category: "laptop",
    description: "Business laptop with legendary keyboard",
    brand: "Lenovo"
  },
  {
    id: 9,
    name: "iPad Air",
    price: 599,
    category: "tablet",
    description: "Versatile tablet with M1 chip and Apple Pencil support",
    brand: "Apple"
  },
  {
    id: 10,
    name: "Samsung Galaxy Tab S8",
    price: 699,
    category: "tablet",
    description: "Android tablet with S Pen and DeX mode",
    brand: "Samsung"
  },
  {
    id: 11,
    name: "Sony WH-1000XM5",
    price: 399,
    category: "headphones",
    description: "Industry-leading noise cancellation headphones",
    brand: "Sony"
  },
  {
    id: 12,
    name: "AirPods Pro 2",
    price: 249,
    category: "headphones",
    description: "Premium earbuds with active noise cancellation",
    brand: "Apple"
  }
];

export default function ProductRecommendationSystem() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(true);

  const getRecommendations = async () => {
    if (!query.trim()) {
      setError('Please enter your preferences');
      return;
    }

    // Client-side validation
    if (query.trim().length < 3) {
      setError('Please enter at least 3 characters for a meaningful search');
      return;
    }

    // Check if query is just random letters (no vowels pattern check)
    const hasVowels = /[aeiou]/i.test(query);
    const isOnlyLetters = /^[a-z]+$/i.test(query.trim());
    
    if (isOnlyLetters && query.trim().length < 4 && !hasVowels) {
      setError('Please enter a more specific search term');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const model = "gemini-2.5-flash";
      
      if (!apiKey) {
        setError('API key not found. Please add VITE_GEMINI_API_KEY to your .env file');
        setLoading(false);
        return;
      }

      const prompt = `You are a strict product recommendation assistant. Based on the user's preferences, recommend products from the catalog.

User preference: "${query}"

Product Catalog:
${JSON.stringify(PRODUCTS, null, 2)}

STRICT MATCHING RULES:
1. ONLY match if the query is meaningful and specific (at least 3 characters for partial words)
2. IGNORE queries with random letters or incomplete words like "la", "mobi", "ap"
3. For price queries, ONLY include products within the specified range
4. For category queries (phone, laptop, tablet, headphones), match EXACT category
5. For brand queries, match EXACT brand name
6. For feature queries (gaming, business, budget), match products with those features in description
7. If query is too vague, incomplete, or doesn't match anything, return empty array []
8. Return ONLY products that clearly match ALL criteria in the user's query

Examples:
- "la" → [] (too vague)
- "laptop" → [5,6,7,8] (valid category)
- "phone under $700" → only phones with price < 700
- "gaming laptop" → only laptops with "gaming" in description

Respond ONLY with a JSON array of product IDs. No explanation.

Your response (JSON array only):`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }
      
      // Extract text response from Gemini
      const aiResponse = data.candidates[0].content.parts[0].text;

      // Parse the AI response to get product IDs
      let cleanResponse = aiResponse.replace(/```json|```/g, '').trim();
      
      // Handle cases where AI returns text instead of JSON
      if (!cleanResponse.startsWith('[')) {
        // Try to extract array from text
        const arrayMatch = cleanResponse.match(/\[[\d,\s]*\]/);
        if (arrayMatch) {
          cleanResponse = arrayMatch[0];
        } else {
          // AI couldn't find matches
          setRecommendations([]);
          setShowAll(false);
          setError('No products match your search criteria. Try being more specific or use different keywords.');
          setLoading(false);
          return;
        }
      }
      
      const recommendedIds = JSON.parse(cleanResponse);

      // Validate that recommendedIds is an array
      if (!Array.isArray(recommendedIds)) {
        throw new Error('Invalid response format from AI');
      }

      // Filter products based on AI recommendations
      const recommendedProducts = PRODUCTS.filter(p => 
        recommendedIds.includes(p.id)
      );

      setRecommendations(recommendedProducts);
      setShowAll(false);

      if (recommendedProducts.length === 0) {
        setError('No products match your preferences. Try different keywords like "phone", "laptop", "gaming", "budget", or specific brands.');
      }

    } catch (err) {
      console.error('Error:', err);
      setError(`Failed to get recommendations: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getRecommendations();
    }
  };

  const resetSearch = () => {
    setQuery('');
    setRecommendations([]);
    setError('');
    setShowAll(true);
  };

  const displayProducts = showAll ? PRODUCTS : recommendations;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShoppingBag className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">Smart Shop</h1>
          </div>
          <p className="text-gray-600">AI-Powered Product Recommendations</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              What are you looking for?
            </h2>
          </div>
          
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='e.g., "phone under $700", "gaming laptop", "Apple products"'
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <button
              onClick={getRecommendations}
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Searching...' : 'Find Products'}
            </button>
            {!showAll && (
              <button
                onClick={resetSearch}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search Suggestions */}
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-2">Try searching for:</p>
            <div className="flex flex-wrap gap-2">
              {['phone under $700', 'gaming laptop', 'Apple products', 'budget tablet', 'noise cancelling'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Results Info */}
          {!showAll && recommendations.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
              Found {recommendations.length} product{recommendations.length !== 1 ? 's' : ''} matching your preferences!
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {showAll ? 'All Products' : 'Recommended For You'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border-2 border-transparent hover:border-indigo-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-2">
                    {product.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-indigo-600">
                  ${product.price}
                </span>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {displayProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No products to display</p>
          </div>
        )}
      </div>
    </div>
  );
}