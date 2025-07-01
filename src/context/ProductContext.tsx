import React, { createContext, useContext, useState } from 'react';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  categorySlug: string;
  image: string;
  images: string[];
  seller: string;
  sellerId: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  isDigital: boolean;
  downloadUrl?: string;
  previewUrl?: string;
  isTopSeller: boolean;
  discount?: number;
  createdAt: string;
  likes: number;
  comments: Array<{
    id: string;
    author: string;
    text: string;
    createdAt: string;
  }>;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsBySeller: (sellerId: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const initialProducts: Product[] = [
  {
    id: '1',
    title: '100 modèles Canva pour les réseaux sociaux',
    description: 'Un pack complet de 100 modèles Canva professionnels et personnalisables pour dynamiser votre présence sur les réseaux sociaux. Idéal pour Instagram, Facebook, et plus encore.',
    price: 25000,
    oldPrice: 35000,
    category: 'Modèles Canva',
    categorySlug: 'canva',
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    seller: 'Jean Dupont',
    sellerId: '1',
    rating: 4.8,
    reviewCount: 124,
    tags: ['canva', 'réseaux sociaux', 'templates', 'marketing'],
    isDigital: true,
    isTopSeller: true,
    discount: 29,
    createdAt: '2024-01-15',
    likes: 1250,
    comments: [
      {
        id: '1',
        author: 'Marie Rasoamalala',
        text: 'Excellent pack ! Les modèles sont très professionnels.',
        createdAt: '2024-01-20'
      }
    ]
  },
  {
    id: '2',
    title: 'E-book : Les fondamentaux du Marketing Digital',
    description: 'Découvrez les bases essentielles du marketing digital avec cet e-book complet. Apprenez le SEO, le SEM, le marketing de contenu et plus encore.',
    price: 15000,
    category: 'E-books',
    categorySlug: 'ebook',
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    seller: 'DigitalExpert',
    sellerId: '2',
    rating: 4.6,
    reviewCount: 89,
    tags: ['ebook', 'marketing', 'digital', 'seo'],
    isDigital: true,
    isTopSeller: false,
    createdAt: '2024-01-10',
    likes: 800,
    comments: []
  },
  {
    id: '3',
    title: 'Formation complète Adobe Premiere Pro',
    description: 'Maîtrisez Adobe Premiere Pro du débutant à un niveau intermédiaire avec cette formation vidéo détaillée.',
    price: 50000,
    oldPrice: 70000,
    category: 'Formations Vidéo',
    categorySlug: 'formation',
    image: 'https://images.pexels.com/photos/3584994/pexels-photo-3584994.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/3584994/pexels-photo-3584994.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    seller: 'VideoMaestro',
    sellerId: '3',
    rating: 4.9,
    reviewCount: 156,
    tags: ['formation', 'video', 'premiere-pro', 'montage'],
    isDigital: true,
    isTopSeller: true,
    discount: 28,
    createdAt: '2024-01-05',
    likes: 2100,
    comments: []
  }
];

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getProductsBySeller = (sellerId: string) => {
    return products.filter(product => product.sellerId === sellerId);
  };

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      getProductsBySeller
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}