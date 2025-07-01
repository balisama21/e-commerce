import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts, Product } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

export default function SellerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct, getProductsBySeller } = useProducts();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'add-product'>('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    oldPrice: '',
    category: '',
    categorySlug: '',
    image: '',
    tags: '',
    isTopSeller: false
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder au dashboard</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const userProducts = getProductsBySeller(user?.id || '');
  const totalRevenue = userProducts.reduce((sum, product) => sum + (product.price * (product.reviewCount || 1)), 0);
  const totalLikes = userProducts.reduce((sum, product) => sum + product.likes, 0);

  const categories = [
    { slug: 'canva', name: 'Modèles Canva' },
    { slug: 'ebook', name: 'E-books' },
    { slug: 'formation', name: 'Formations Vidéo' },
    { slug: 'coaching', name: 'Coaching' },
    { slug: 'webdesign', name: 'Web Design' },
    { slug: 'tools', name: 'Outils' }
  ];

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const productData = {
      title: formData.title,
      description: formData.description,
      price: parseInt(formData.price),
      oldPrice: formData.oldPrice ? parseInt(formData.oldPrice) : undefined,
      category: categories.find(c => c.slug === formData.categorySlug)?.name || '',
      categorySlug: formData.categorySlug,
      image: formData.image || 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=600',
      images: [formData.image || 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=600'],
      seller: user.name,
      sellerId: user.id,
      rating: 4.5,
      reviewCount: 0,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      isDigital: true,
      isTopSeller: formData.isTopSeller,
      discount: formData.oldPrice ? Math.round(((parseInt(formData.oldPrice) - parseInt(formData.price)) / parseInt(formData.oldPrice)) * 100) : undefined,
      likes: 0,
      comments: []
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
    } else {
      addProduct(productData);
    }

    setFormData({
      title: '',
      description: '',
      price: '',
      oldPrice: '',
      category: '',
      categorySlug: '',
      image: '',
      tags: '',
      isTopSeller: false
    });

    setActiveTab('products');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      oldPrice: product.oldPrice?.toString() || '',
      category: product.category,
      categorySlug: product.categorySlug,
      image: product.image,
      tags: product.tags.join(', '),
      isTopSeller: product.isTopSeller
    });
    setActiveTab('add-product');
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Vendeur</h1>
          <p className="text-gray-600">Bienvenue, {user?.name}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mes Produits ({userProducts.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('add-product');
                setEditingProduct(null);
                setFormData({
                  title: '',
                  description: '',
                  price: '',
                  oldPrice: '',
                  category: '',
                  categorySlug: '',
                  image: '',
                  tags: '',
                  isTopSeller: false
                });
              }}
              className={`py-4 border-b-2 font-medium text-sm ${
                activeTab === 'add-product'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ajouter un Produit
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <ShoppingBag className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Produits</p>
                    <p className="text-2xl font-semibold text-gray-900">{userProducts.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenus estimés</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {totalRevenue.toLocaleString()} MGA
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total J'aime</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalLikes}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Prix moyen</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {userProducts.length > 0 
                        ? Math.round(userProducts.reduce((sum, p) => sum + p.price, 0) / userProducts.length).toLocaleString()
                        : 0
                      } MGA
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Produits Récents</h3>
              {userProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userProducts.slice(0, 3).map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun produit</h4>
                  <p className="text-gray-600 mb-4">Commencez par ajouter votre premier produit</p>
                  <button
                    onClick={() => setActiveTab('add-product')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Ajouter un produit
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Mes Produits</h3>
              <button
                onClick={() => setActiveTab('add-product')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Produit</span>
              </button>
            </div>

            {userProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium text-gray-900 mb-2">Aucun produit</h4>
                <p className="text-gray-600 mb-6">Vous n'avez pas encore ajouté de produits à vendre</p>
                <button
                  onClick={() => setActiveTab('add-product')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Ajouter votre premier produit
                </button>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Product Tab */}
        {activeTab === 'add-product' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
            </h3>

            <form onSubmit={handleSubmitProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre du produit
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: 100 modèles Canva pour Instagram"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={formData.categorySlug}
                    onChange={(e) => setFormData(prev => ({ ...prev, categorySlug: e.target.value }))}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(category => (
                      <option key={category.slug} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Décrivez votre produit en détail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix (MGA)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="25000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ancien prix (optionnel)
                  </label>
                  <input
                    type="number"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, oldPrice: e.target.value }))}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="35000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de l'image
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://exemple.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="canva, design, templates, marketing"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isTopSeller"
                  checked={formData.isTopSeller}
                  onChange={(e) => setFormData(prev => ({ ...prev, isTopSeller: e.target.checked }))}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="isTopSeller" className="ml-2 text-sm text-gray-700">
                  Marquer comme produit vedette
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingProduct ? 'Mettre à jour' : 'Ajouter le produit'}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setFormData({
                        title: '',
                        description: '',
                        price: '',
                        oldPrice: '',
                        category: '',
                        categorySlug: '',
                        image: '',
                        tags: '',
                        isTopSeller: false
                      });
                    }}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}