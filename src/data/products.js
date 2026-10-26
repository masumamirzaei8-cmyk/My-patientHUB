export const products = [
  // Healthy Diet products from different providers
  { id: 'p1', name: 'Healthy Diet', description: 'Nutritious meal plan delivered to your door.', price: 5, category: 'Food', provider: 'Food Panda', providerLogo: '🐼', image: '/images/products/product-1.svg', rating: 4.5, inStock: true, discount: 0 },
  { id: 'p2', name: 'Healthy Diet', description: 'Balanced nutrition package with fresh ingredients.', price: 10, category: 'Food', provider: 'Grab Food', providerLogo: '🟢', image: '/images/products/product-2.svg', rating: 4.3, inStock: true, discount: 10 },
  { id: 'p3', name: 'Healthy Diet', description: 'Premium organic diet plan with supplements.', price: 15, category: 'Food', provider: 'Deliveroo', providerLogo: '🟩', image: '/images/products/product-3.svg', rating: 4.7, inStock: true, discount: 5 },
  { id: 'p4', name: 'Healthy Diet', description: 'Minimalist clean eating program.', price: 20, category: 'Food', provider: 'Minimalist', providerLogo: '⚪', image: '/images/products/product-4.svg', rating: 4.4, inStock: true, discount: 0 },
  
  // Additional products
  { id: 'p5', name: 'Healthy Meal', description: 'Freshly prepared healthy meal with balanced macros.', price: 12, category: 'Food', provider: 'Food Panda', providerLogo: '🐼', image: '/images/products/product-5.svg', rating: 4.6, inStock: true, discount: 15 },
  { id: 'p6', name: 'Nutrition Package', description: 'Complete weekly nutrition package with vitamins.', price: 25, category: 'Nutrition', provider: 'Grab Food', providerLogo: '🟢', image: '/images/products/product-6.svg', rating: 4.4, inStock: true, discount: 0 },
  { id: 'p7', name: 'Wellness Package', description: 'Holistic wellness kit with supplements and guides.', price: 35, category: 'Wellness', provider: 'Deliveroo', providerLogo: '🟩', image: '/images/products/product-7.svg', rating: 4.8, inStock: true, discount: 20 },
  { id: 'p8', name: 'Medical Supplies', description: 'Essential medical supplies kit for home use.', price: 18, category: 'Medical Supplies', provider: 'Minimalist', providerLogo: '⚪', image: '/images/products/product-8.svg', rating: 4.2, inStock: true, discount: 0 },
  { id: 'p9', name: 'Health Monitoring Accessories', description: 'Digital health monitoring devices and accessories.', price: 45, category: 'Devices', provider: 'Food Panda', providerLogo: '🐼', image: '/images/products/product-9.svg', rating: 4.5, inStock: true, discount: 10 },
  { id: 'p10', name: 'Organic Food Package', description: 'Weekly organic fruits, vegetables, and grains.', price: 30, category: 'Food', provider: 'Grab Food', providerLogo: '🟢', image: '/images/products/product-10.svg', rating: 4.7, inStock: true, discount: 5 },
  { id: 'p11', name: 'Fitness Tracker Band', description: 'Advanced health monitoring wristband.', price: 55, category: 'Devices', provider: 'Deliveroo', providerLogo: '🟩', image: '/images/products/product-11.svg', rating: 4.6, inStock: true, discount: 0 },
  { id: 'p12', name: 'Mental Health Journal', description: 'Guided journal for mindfulness and wellness.', price: 15, category: 'Wellness', provider: 'Minimalist', providerLogo: '⚪', image: '/images/products/product-12.svg', rating: 4.8, inStock: true, discount: 0 },
];

export const productCategories = [...new Set(products.map(p => p.category))];
