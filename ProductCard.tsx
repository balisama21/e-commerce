import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { Product } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(product);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      onDelete?.(product.id);
    }
  };

  const canManage = isAuthenticated && user?.id === product.sellerId;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 space-y-2">
            {product.isTopSeller && (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                Top Vente
              </span>
            )}
            {product.discount && (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
            <button className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors">
              <Heart className="w-4 h-4 text-gray-600 hover:text-red-600" />
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Category */}
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2">
            {product.category}
          </span>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-500 ml-2">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-green-600">
                {product.price.toLocaleString()} MGA
              </span>
              {product.oldPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {product.oldPrice.toLocaleString()} MGA
                </span>
              )}
            </div>
          </div>

          {/* Seller */}
          <p className="text-sm text-gray-600 mb-4">Par {product.seller}</p>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="px-4 pb-4 space-y-2">
        {canManage ? (
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Modifier</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Ajouter au panier</span>
          </button>
        )}
      </div>
    </div>
  );
}