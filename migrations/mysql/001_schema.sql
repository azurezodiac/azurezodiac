-- Redeemysoul MySQL schema (cPanel MySQL / MariaDB)

CREATE TABLE IF NOT EXISTS consultation_requests (
  id VARCHAR(64) PRIMARY KEY,
  tracking_number VARCHAR(64) NOT NULL,
  concern_id VARCHAR(64) NOT NULL,
  concern_title VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  mother_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  note TEXT NOT NULL,
  status VARCHAR(64) NOT NULL,
  status_note TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  cleared_at DATETIME NULL,
  UNIQUE KEY consultation_requests_tracking_unique (tracking_number),
  KEY consultation_requests_phone_status_idx (phone, status),
  KEY consultation_requests_created_at_idx (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_posts (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(191) NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  body MEDIUMTEXT NOT NULL,
  published TINYINT(1) NOT NULL DEFAULT 1,
  published_at VARCHAR(32) NOT NULL,
  updated_at DATETIME NOT NULL,
  UNIQUE KEY cms_posts_slug_unique (slug),
  KEY cms_posts_published_at_idx (published, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_features (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  updated_at DATETIME NOT NULL,
  KEY cms_features_order_idx (published, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_promotions (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  cta_label VARCHAR(255) NOT NULL,
  cta_href VARCHAR(255) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_pricing (
  id VARCHAR(64) PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  amount VARCHAR(128) NOT NULL,
  method VARCHAR(255) NOT NULL,
  note TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  updated_at DATETIME NOT NULL,
  KEY cms_pricing_order_idx (published, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_settings (
  setting_key VARCHAR(64) PRIMARY KEY,
  setting_value MEDIUMTEXT NOT NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
