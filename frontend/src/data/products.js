export const PRODUCTS_DATA = [
  // ── Electronics / Mobiles ──
  {
    id: '1', name: 'Apple iPhone 15 Pro (128GB) - Natural Titanium', category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80', 
    rating: 4.9, reviews: 12450, badge: 'Trending',
    description: 'Forged in titanium. A17 Pro chip. Advanced pro camera system. All-new Action button.',
    comparisons: [
      { store: 'Amazon', price: 127990, originalPrice: 134900, link: 'https://www.amazon.in/Apple-iPhone-15-Pro-128/dp/B0CHX1W1XY', logo: 'A', inStock: true, delivery: 'Free Delivery by tomorrow' },
      { store: 'Flipkart', price: 128490, originalPrice: 134900, link: 'https://www.flipkart.com/search?q=apple+iphone+15+pro+128gb+natural+titanium&otracker=search', logo: 'F', inStock: true, delivery: 'Delivery in 2 days' },
      { store: 'Tata CLiQ', price: 126500, originalPrice: 134900, link: 'https://www.tatacliq.com/apple-iphone-15-pro-128gb-natural-titanium/p-mp000000019642841', logo: 'T', inStock: false, delivery: 'Currently out of stock' },
      { store: 'Croma', price: 129000, originalPrice: 134900, link: 'https://www.croma.com/apple-iphone-15-pro-128gb-natural-titanium-/p/277144', logo: 'C', inStock: true, delivery: 'Store Pickup Available' }
    ]
  },
  {
    id: '2', name: 'Sony WH-1000XM5 Wireless Headphones', category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=600&q=80', 
    rating: 4.8, reviews: 2341, badge: 'Hot Deal',
    description: 'Industry leading noise canceling headphones with Auto Noise Canceling Optimizer.',
    comparisons: [
      { store: 'Amazon', price: 21990, originalPrice: 29990, link: 'https://www.amazon.in/Sony-WH-1000XM5-Canceling-Headphones-Optimizing/dp/B09XS7JWHH', logo: 'A', inStock: true, delivery: 'Free Delivery by tomorrow' },
      { store: 'Flipkart', price: 22490, originalPrice: 29990, link: 'https://www.flipkart.com/search?q=sony+wh-1000xm5+wireless+headphones&otracker=search', logo: 'F', inStock: true, delivery: 'Free Delivery in 2 days' },
      { store: 'Croma', price: 22990, originalPrice: 29990, link: 'https://www.croma.com/sony-wh-1000xm5-bluetooth-headset-with-active-noise-cancellation/p/262590', logo: 'C', inStock: true, delivery: 'Delivery in 3-4 days' }
    ]
  },
  {
    id: '3', name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)', category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1707227155454-e0db279ebed3?auto=format&fit=crop&w=600&q=80', 
    rating: 4.8, reviews: 8432, badge: 'New Launch',
    description: 'Galaxy AI is here. Epic camera with titanium design.',
    comparisons: [
      { store: 'Amazon', price: 129999, originalPrice: 134999, link: 'https://www.amazon.in/Samsung-Galaxy-Ultra-Titanium-Storage/dp/B0CQYLGC16', logo: 'A', inStock: true, delivery: 'Delivery in 1 day' },
      { store: 'Flipkart', price: 129500, originalPrice: 134999, link: 'https://www.flipkart.com/search?q=samsung+galaxy+s24+ultra+5g+256gb&otracker=search', logo: 'F', inStock: true, delivery: 'Delivery in 2 days' }
    ]
  },
  {
    id: '4', name: 'Samsung 65" QLED 4K Smart TV', category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80', 
    rating: 4.7, reviews: 934, badge: 'Price Drop',
    description: 'Billion flawless colors with Quantum Dot technology.',
    comparisons: [
      { store: 'Amazon', price: 84990, originalPrice: 139900, link: 'https://www.amazon.in/Samsung-163-cm-inches-QA65QE1CAKLXL/dp/B0C78FXYP8', logo: 'A', inStock: true, delivery: 'Free Delivery + Installation' },
      { store: 'Flipkart', price: 85500, originalPrice: 139900, link: 'https://www.flipkart.com/search?q=samsung+65+inch+qled+4k+smart+tv&otracker=search', logo: 'F', inStock: true, delivery: 'Free Delivery' },
      { store: 'Reliance', price: 83990, originalPrice: 139900, link: 'https://www.reliancedigital.in/samsung-163-cm-65-inch-ultra-hd-4k-smart-qled-tv-65q60c/p/493664790', logo: 'R', inStock: true, delivery: 'Delivery in 3 days' }
    ]
  },

  // ── Fashion & Shoes ──
  {
    id: '5', name: 'Nike Air Max 270 Men\'s Sneakers', category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80', 
    rating: 4.6, reviews: 1876, badge: 'Best Seller',
    description: 'Legendary Air gets lifted. Nike\'s first lifestyle Air Max brings you style.',
    comparisons: [
      { store: 'Flipkart', price: 7995, originalPrice: 12995, link: 'https://www.flipkart.com/search?q=nike+air+max+270+men+sneakers&otracker=search', logo: 'F', inStock: true, delivery: 'Free Delivery in 2 days' },
      { store: 'Nike Official', price: 8200, originalPrice: 12995, link: 'https://www.nike.com/in/t/air-max-270-mens-shoes-KkLcGR/AH8050-002', logo: 'N', inStock: true, delivery: 'Free Delivery by tomorrow' },
      { store: 'Myntra', price: 8500, originalPrice: 12995, link: 'https://www.myntra.com/sports-shoes/nike/nike-men-black-air-max-270-sneakers/13606772/buy', logo: 'M', inStock: true, delivery: 'Delivery in 1-2 days' }
    ]
  },
  {
    id: '6', name: 'Levi\'s Men 511 Slim Fit Jeans', category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80', 
    rating: 4.5, reviews: 5430, badge: 'Daily Wear',
    description: 'A modern slim with room to move. Added stretch for all-day comfort.',
    comparisons: [
      { store: 'Myntra', price: 1649, originalPrice: 2999, link: 'https://www.myntra.com/jeans/levis/levis-men-blue-511-slim-fit-mildly-distressed-stretchable-jeans/11267440/buy', logo: 'M', inStock: true, delivery: 'Delivery in 2 days' },
      { store: 'Amazon', price: 1599, originalPrice: 2999, link: 'https://www.amazon.in/Levis-Mens-Slim-Jeans-18298-1110_Mid/dp/B08M9Y87QK', logo: 'A', inStock: true, delivery: 'Delivery tomorrow' },
      { store: 'Flipkart', price: 1699, originalPrice: 2999, link: 'https://www.flipkart.com/search?q=levis+511+slim+fit+jeans+men&otracker=search', logo: 'F', inStock: true, delivery: 'Delivery in 3 days' }
    ]
  },
  {
    id: '7', name: 'Puma Unisex Suede Classic', category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80', 
    rating: 4.4, reviews: 3200, badge: 'Classic',
    description: 'The most well-known and popular of all PUMA shoes.',
    comparisons: [
      { store: 'Tata CLiQ', price: 3499, originalPrice: 5999, link: 'https://www.tatacliq.com/puma-unisex-suede-classic-xxi-black-casual-sneakers/p-mp000000009403814', logo: 'T', inStock: true, delivery: 'Delivery in 3-5 days' },
      { store: 'Amazon', price: 3600, originalPrice: 5999, link: 'https://www.amazon.in/Puma-Unisex-Adult-Suede-Classic-Sneaker/dp/B08CD2H4KT', logo: 'A', inStock: true, delivery: 'Delivery in 2 days' }
    ]
  },
  {
    id: '12', name: 'Adidas Ultraboost Light Running Shoes', category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=600&q=80',
    rating: 4.8, reviews: 4120, badge: 'New Arrival',
    description: 'Experience epic energy with the new Ultraboost Light, our lightest ever.',
    comparisons: [
      { store: 'Amazon', price: 12599, originalPrice: 18999, link: 'https://www.amazon.in/s?k=Adidas+Ultraboost+Light+Running+Shoes', logo: 'A', inStock: true, delivery: 'Delivery in 1 day' },
      { store: 'Myntra', price: 12999, originalPrice: 18999, link: 'https://www.myntra.com/adidas/adidas-men-ultraboost-light-running-shoes/buy', logo: 'M', inStock: true, delivery: 'Delivery in 2 days' },
      { store: 'Flipkart', price: 13299, originalPrice: 18999, link: 'https://www.flipkart.com/search?q=adidas+ultraboost+light+running+shoes', logo: 'F', inStock: true, delivery: 'Delivery in 3 days' }
    ]
  },
  {
    id: '13', name: 'Allen Solly Men\'s Regular Fit Polo Shirt', category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80',
    rating: 4.3, reviews: 8520, badge: 'Popular',
    description: 'Comfortable and stylish polo t-shirt for everyday casual wear.',
    comparisons: [
      { store: 'Amazon', price: 749, originalPrice: 1299, link: 'https://www.amazon.in/s?k=Allen+Solly+Men+Polo+Shirt', logo: 'A', inStock: true, delivery: 'Delivery in 1 day' },
      { store: 'Flipkart', price: 799, originalPrice: 1299, link: 'https://www.flipkart.com/search?q=allen+solly+men+polo+shirt', logo: 'F', inStock: true, delivery: 'Delivery in 2 days' },
      { store: 'Myntra', price: 850, originalPrice: 1299, link: 'https://www.myntra.com/allen-solly/polo-shirts/buy', logo: 'M', inStock: true, delivery: 'Delivery in 3 days' }
    ]
  },
  {
    id: '14', name: 'Tommy Hilfiger Men\'s Slim Fit Cotton Shirt', category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
    rating: 4.7, reviews: 2150, badge: 'Premium',
    description: 'Premium quality slim fit cotton shirt, perfect for formal and semi-formal occasions.',
    comparisons: [
      { store: 'Myntra', price: 2549, originalPrice: 3999, link: 'https://www.myntra.com/tommy-hilfiger/shirts/buy', logo: 'M', inStock: true, delivery: 'Delivery in 2 days' },
      { store: 'Amazon', price: 2699, originalPrice: 3999, link: 'https://www.amazon.in/s?k=Tommy+Hilfiger+Men+Slim+Fit+Cotton+Shirt', logo: 'A', inStock: true, delivery: 'Delivery in 1 day' },
      { store: 'Tata CLiQ', price: 2799, originalPrice: 3999, link: 'https://www.tatacliq.com/tommy-hilfiger-shirts/c-msh11l4/', logo: 'T', inStock: true, delivery: 'Delivery in 3 days' }
    ]
  },
  {
    id: '15', name: 'Van Heusen Men\'s Solid Formal Shirt', category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    rating: 4.5, reviews: 5410, badge: 'Top Rated',
    description: 'Classic solid formal shirt crafted from premium cotton blend.',
    comparisons: [
      { store: 'Amazon', price: 1199, originalPrice: 1999, link: 'https://www.amazon.in/s?k=Van+Heusen+Men+Solid+Formal+Shirt', logo: 'A', inStock: true, delivery: 'Delivery in 1 day' },
      { store: 'Flipkart', price: 1250, originalPrice: 1999, link: 'https://www.flipkart.com/search?q=van+heusen+men+formal+shirt', logo: 'F', inStock: true, delivery: 'Delivery in 2 days' },
      { store: 'Myntra', price: 1299, originalPrice: 1999, link: 'https://www.myntra.com/van-heusen/formal-shirts/buy', logo: 'M', inStock: true, delivery: 'Delivery in 2 days' }
    ]
  },
  {
    id: '16', name: 'Skechers Men\'s Go Walk Max Sneakers', category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=600&q=80',
    rating: 4.6, reviews: 3105, badge: 'Comfort',
    description: 'Get the maximum comfort and cushioning for athletic walking.',
    comparisons: [
      { store: 'Amazon', price: 3849, originalPrice: 5499, link: 'https://www.amazon.in/s?k=Skechers+Men+Go+Walk+Max+Sneakers', logo: 'A', inStock: true, delivery: 'Delivery in 1 day' },
      { store: 'Flipkart', price: 3999, originalPrice: 5499, link: 'https://www.flipkart.com/search?q=skechers+men+go+walk+max', logo: 'F', inStock: true, delivery: 'Delivery in 2 days' },
      { store: 'Myntra', price: 4199, originalPrice: 5499, link: 'https://www.myntra.com/skechers/sneakers/buy', logo: 'M', inStock: true, delivery: 'Delivery in 2 days' }
    ]
  },

  // ── Home & Appliances ──
  {
    id: '8', name: 'Woodsworth Solid Wood Dining Table Set', category: 'Home',
    image: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=600&q=80', 
    rating: 4.5, reviews: 342, badge: 'Furniture',
    description: 'Premium quality solid wood dining table with 4 chairs.',
    comparisons: [
      { store: 'Pepperfry', price: 24999, originalPrice: 45000, link: 'https://www.pepperfry.com/product/akiko-solid-wood-4-seater-dining-set-in-provincial-teak-finish-by-woodsworth-1658428.html', logo: 'P', inStock: true, delivery: 'Delivery in 5-7 days' },
      { store: 'Amazon', price: 26000, originalPrice: 45000, link: 'https://www.amazon.in/Home-Centre-Costas-Solid-Dining/dp/B09MDBTGH1', logo: 'A', inStock: true, delivery: 'Delivery in 4 days' },
      { store: 'Flipkart', price: 25500, originalPrice: 45000, link: 'https://www.flipkart.com/search?q=solid+wood+4+seater+dining+table+set&otracker=search', logo: 'F', inStock: true, delivery: 'Delivery in 5 days' }
    ]
  },
  {
    id: '9', name: 'LG 8 Kg 5 Star Front Load Washing Machine', category: 'Home',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80', 
    rating: 4.7, reviews: 4500, badge: 'Appliance',
    description: 'Fully-Automatic Front Load Washing Machine with Inverter Direct Drive.',
    comparisons: [
      { store: 'Amazon', price: 32990, originalPrice: 42990, link: 'https://www.amazon.in/LG-Hygiene-Fully-Automatic-FHM1408BDW-Technology/dp/B0B513XV7T', logo: 'A', inStock: true, delivery: 'Delivery + Installation in 2 days' },
      { store: 'Flipkart', price: 33500, originalPrice: 42990, link: 'https://www.flipkart.com/search?q=lg+8kg+5+star+front+load+washing+machine&otracker=search', logo: 'F', inStock: true, delivery: 'Delivery in 3 days' },
      { store: 'Tata CLiQ', price: 32500, originalPrice: 42990, link: 'https://www.tatacliq.com/lg-8-kg-5-star-fully-automatic-front-load-washing-machine-fhm1408bdw-white/p-mp000000010996884', logo: 'T', inStock: false, delivery: 'Out of Stock' }
    ]
  },
  {
    id: '10', name: 'Dyson V15 Detect Cordless Vacuum Cleaner', category: 'Home',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80', 
    rating: 4.9, reviews: 567, badge: 'Editor\'s Pick',
    description: 'The most powerful, intelligent cordless vacuum. Reveals invisible dust.',
    comparisons: [
      { store: 'Amazon', price: 44990, originalPrice: 62900, link: 'https://www.amazon.in/Dyson-V15-Detect-Cord-Free-Vacuum/dp/B0B4SHM16F', logo: 'A', inStock: true, delivery: 'Delivery in 1 day' },
      { store: 'Flipkart', price: 45500, originalPrice: 62900, link: 'https://www.flipkart.com/search?q=dyson+v15+detect+cordless+vacuum+cleaner&otracker=search', logo: 'F', inStock: true, delivery: 'Delivery in 2 days' }
    ]
  },
  
  // ── Beauty / Nykaa ──
  {
    id: '11', name: 'M.A.C Ruby Woo Retro Matte Lipstick', category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80', 
    rating: 4.8, reviews: 15430, badge: 'Bestseller',
    description: 'The iconic matte lipstick that made M·A·C famous.',
    comparisons: [
      { store: 'Nykaa', price: 1950, originalPrice: 2300, link: 'https://www.nykaa.com/m-a-c-retro-matte-lipstick-ruby-woo/p/89498', logo: 'N', inStock: true, delivery: 'Delivery in 1 day' },
      { store: 'Myntra', price: 2000, originalPrice: 2300, link: 'https://www.myntra.com/lipstick/mac/mac-ruby-woo-retro-matte-lipstick-3g/1410141/buy', logo: 'M', inStock: true, delivery: 'Delivery in 2 days' }
    ]
  }
];

export const getStoreList = (product) => {
  return product.comparisons.map(c => c.store);
};

export const getLowestPrice = (product) => {
  const prices = product.comparisons.filter(c => c.inStock).map(c => c.price);
  return prices.length > 0 ? Math.min(...prices) : product.comparisons[0].price;
};

export const getHighestPrice = (product) => {
  const prices = product.comparisons.map(c => c.originalPrice);
  return Math.max(...prices);
};

export const getDiscount = (product) => {
  const minPrice = getLowestPrice(product);
  const maxPrice = getHighestPrice(product);
  return Math.round(((maxPrice - minPrice) / maxPrice) * 100);
};
