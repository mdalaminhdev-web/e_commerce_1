CREATE DATABASE IF NOT EXISTS organic_store_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE organic_store_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) NULL,
    password_hash VARCHAR(255) NULL,
    role ENUM('customer', 'admin', 'moderator') DEFAULT 'customer',
    address TEXT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_phone (phone)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    image_url VARCHAR(255) NULL,
    parent_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description VARCHAR(500) NULL,
    description LONGTEXT NULL,
    thumbnail VARCHAR(255) NOT NULL,
    gallery_images JSON NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_product_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_variants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    unit_name VARCHAR(50) NOT NULL,
    sku VARCHAR(60) UNIQUE NOT NULL,
    regular_price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2) NULL,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_variant_product (product_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(30) UNIQUE NOT NULL,
    user_id INT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_zone ENUM('inside_dhaka', 'outside_dhaka') NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_charge DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_payable DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('COD', 'BKASH', 'SSLCOMMERZ') DEFAULT 'COD',
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    order_status ENUM('pending', 'confirmed', 'processing', 'handed_over', 'delivered', 'cancelled', 'returned') DEFAULT 'pending',
    order_note TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_order_customer_phone (customer_phone),
    INDEX idx_order_status_code (order_status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_variant_id INT NOT NULL,
    product_title VARCHAR(255) NOT NULL,
    unit_name VARCHAR(50) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    total_line_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS courier_consignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNIQUE NOT NULL,
    courier_partner ENUM('steadfast', 'pathao', 'redx') NOT NULL,
    consignment_id VARCHAR(100) NOT NULL,
    tracking_code VARCHAR(100) NOT NULL,
    status ENUM('pending', 'in_transit', 'delivered', 'returned', 'cancelled') DEFAULT 'pending',
    raw_response JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS banners_promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    target_link VARCHAR(255) NULL,
    placement ENUM('home_hero', 'middle_promo', 'popup') DEFAULT 'home_hero',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Seed Data: Admin (Password: admin12345)
INSERT INTO users (name, phone, email, password_hash, role, is_verified) 
VALUES ('Super Admin', '01700000000', 'admin@ghorerbazarclone.com', '$2a$10$w9G.t1W3iX2eK4fVsmcW3.8xG9dZ43vL476c3lGkC9WfX7uY0Lz2i', 'admin', TRUE)
ON DUPLICATE KEY UPDATE id=id;

-- Seed Categories
INSERT INTO categories (id, name, slug, image_url) VALUES
(1, 'খাটি মধু (Natural Honey)', 'natural-honey', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80'),
(2, 'ঘানি ভাঙা সরিষার তেল (Mustard Oil)', 'mustard-oil', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80'),
(3, 'খাটি গাওয়া ঘি (Pure Ghee)', 'pure-ghee', 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80'),
(4, 'গুড়া মসলা (Organic Spices)', 'organic-spices', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80')
ON DUPLICATE KEY UPDATE id=id;

-- Seed Products
INSERT INTO products (id, category_id, title, slug, short_description, description, thumbnail, is_featured, is_active) VALUES
(1, 1, 'সুন্দরবনের প্রাকৃতিক খলিসা ফুলের মধু', 'sundarban-kholisa-honey', '১০০% প্রাকৃতিক ও বিশুদ্ধ সুন্দরবনের খলিসা মধু।', 'সুন্দরবনের গভীরে মৌয়ালদের দ্বারা সংগৃহীত সম্পূর্ণ খাঁটি প্রাকৃতিক মধু। কোনো প্রকার চিনি বা কেমিক্যাল মুক্ত।', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(2, 2, 'কাঠের ঘানিতে ভাঙা খাঁটি সরিষার তেল', 'cold-pressed-mustard-oil', 'প্রথম চাপের ঝাঁঝালো ও বিশুদ্ধ সরিষার তেল।', 'দেশি মাঘী সরিষা থেকে কাঠের ঘানিতে কম তাপে ভাঙা সরিষার তেল। প্রাকৃতিক স্বাদ ও ঝাঁঝ শতভাগ বিদ্যমান।', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(3, 3, 'পাবনার প্রিমিয়াম গাওয়া ঘি', 'pabna-premium-pure-ghee', 'ঐতিহ্যবাহী স্বাদের দানাদার সুবাসিত ঘি।', 'দেশি গরুর খাঁটি দুধের মাখন থেকে প্রচলিত পদ্ধতিতে তৈরি দানাদার খাঁটি গাওয়া ঘি।', 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80', TRUE, TRUE),
(4, 4, 'প্রিমিয়াম হলুদ গুড়া', 'premium-turmeric-powder', 'বাছাইকৃত কাঁচা হলুদ শুকিয়ে তৈরি খাঁটি গুড়া।', 'কোনো ভেজাল রঙ ছাড়া তৈরি শতভাগ নিরাপদ ও খাঁটি হলুদের গুড়া। রান্নায় আনে চমৎকার রঙ ও স্বাদ।', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', FALSE, TRUE)
ON DUPLICATE KEY UPDATE id=id;

-- Seed Variants
INSERT INTO product_variants (product_id, unit_name, sku, regular_price, sale_price, stock_quantity) VALUES
(1, '500 gm', 'HNY-KH-500', 750.00, 690.00, 50),
(1, '1 kg', 'HNY-KH-1000', 1450.00, 1300.00, 30),
(2, '1 Liter', 'OIL-MS-1L', 380.00, 350.00, 80),
(2, '5 Liter', 'OIL-MS-5L', 1850.00, 1700.00, 20),
(3, '500 gm', 'GHEE-PB-500', 950.00, 890.00, 40),
(3, '1 kg', 'GHEE-PB-1000', 1850.00, 1750.00, 25),
(4, '250 gm', 'SPC-TR-250', 120.00, 110.00, 100),
(4, '500 gm', 'SPC-TR-500', 230.00, 210.00, 60)
ON DUPLICATE KEY UPDATE id=id;
