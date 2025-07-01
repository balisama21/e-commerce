import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { useProducts, Product } from '../context/ProductContext';
import { Sparkles, TrendingUp, Users, Star } from 'lucide-react';

export default function HomePage() {
  const { products } = useProducts();
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 1000000 },
    sortBy: 'relevance',
    topSellers: false
  });

  useEffect(() => {
    let result = [...products];
    const searchQuery = searchParams.get('search');

    // Apply search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter(product => filters.categories.includes(product.categorySlug));
    }

    // Apply price filter
    result = result.filter(product =>
      product.price >= filters.priceRange.min && product.price <= filters.priceRange.max
    );

    // Apply top sellers filter
    if (filters.topSellers) {
      result = result.filter(product => product.isTopSeller);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        // relevance - keep original order
        break;
    }

    setFilteredProducts(result);
  }, [products, searchParams, filters]);

  const topSellerProducts = products.filter(p => p.isTopSeller).slice(0, 3);
  const searchQuery = searchParams.get('search');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {!searchQuery && (
        <section className="bg-gradient-to-br from-green-600 via-green-700 to-red-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Produits Numériques
              <span className="block text-yellow-300">Made in Madagascar</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Découvrez et vendez des produits numériques créés par des talents malgaches
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-2 text-lg">
                <Users className="w-6 h-6" />
                <span>1000+ Créateurs</span>
              </div>
              <div className="flex items-center space-x-2 text-lg">
                <Star className="w-6 h-6" />
                <span>5000+ Produits</span>
              </div>
              <div className="flex items-center space-x-2 text-lg">
                <TrendingUp className="w-6 h-6" />
                <span>Croissance +200%</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search Results Header */}
      {searchQuery && (
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Résultats pour "{searchQuery}"
            </h1>
            <p className="text-gray-600">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </p>
          </div>
        </section>
      )}

      {/* Top Sellers Section */}
      {!searchQuery && topSellerProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                <h2 className="text-3xl font-bold text-gray-900">Produits Vedettes</h2>
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-xl text-gray-600">Les produits les plus populaires de notre plateforme</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topSellerProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!searchQuery && (
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Tous nos Produits</h2>
              <p className="text-xl text-gray-600">Explorez notre catalogue complet</p>
            </div>
          )}

          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <ProductFilters filters={filters} onFiltersChange={setFilters} />
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Aucun produit trouvé
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Essayez d'ajuster vos filtres ou votre recherche
                  </p>
                  <button
                    onClick={() => setFilters({
                      categories: [],
                      priceRange: { min: 0, max: 1000000 },
                      sortBy: 'relevance',
                      topSellers: false
                    })}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}