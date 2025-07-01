import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface FilterOptions {
  categories: string[];
  priceRange: { min: number; max: number };
  sortBy: string;
  topSellers: boolean;
}

interface ProductFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const categories = [
  { slug: 'all', name: 'Toutes les catégories' },
  { slug: 'canva', name: 'Modèles Canva' },
  { slug: 'ebook', name: 'E-books' },
  { slug: 'formation', name: 'Formations Vidéo' },
  { slug: 'coaching', name: 'Coaching' },
  { slug: 'webdesign', name: 'Web Design' },
  { slug: 'tools', name: 'Outils' }
];

const sortOptions = [
  { value: 'relevance', label: 'Pertinence' },
  { value: 'price-low', label: 'Prix croissant' },
  { value: 'price-high', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'newest', label: 'Plus récents' }
];

export default function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = (updates: Partial<FilterOptions>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: { min: 0, max: 1000000 },
      sortBy: 'relevance',
      topSellers: false
    });
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow border border-gray-200"
        >
          <Filter className="w-4 h-4" />
          <span>Filtres</span>
        </button>
      </div>

      {/* Filter Panel */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block bg-white rounded-lg shadow-md p-6 mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            Effacer tout
          </button>
        </div>

        <div className="space-y-6">
          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trier par
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégories
            </label>
            <div className="space-y-2">
              {categories.map(category => (
                <label key={category.slug} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.slug) || category.slug === 'all'}
                    onChange={(e) => {
                      if (category.slug === 'all') {
                        updateFilters({ categories: e.target.checked ? [] : filters.categories });
                      } else {
                        const newCategories = e.target.checked
                          ? [...filters.categories, category.slug]
                          : filters.categories.filter(c => c !== category.slug);
                        updateFilters({ categories: newCategories });
                      }
                    }}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fourchette de prix (MGA)
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange.min}
                onChange={(e) => updateFilters({
                  priceRange: { ...filters.priceRange, min: Number(e.target.value) }
                })}
                className="w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange.max}
                onChange={(e) => updateFilters({
                  priceRange: { ...filters.priceRange, max: Number(e.target.value) }
                })}
                className="w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Top Sellers */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.topSellers}
                onChange={(e) => updateFilters({ topSellers: e.target.checked })}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Top vendeurs uniquement</span>
            </label>
          </div>
        </div>

        {/* Mobile Close Button */}
        <div className="md:hidden mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Appliquer les filtres
          </button>
        </div>
      </div>
    </>
  );
}