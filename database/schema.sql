-- CS2 Market Research Database Schema
-- Run this after creating the database: CREATE DATABASE cs2market;

-- Watchlist table - stores user's saved items
CREATE TABLE IF NOT EXISTS watchlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_token TEXT NOT NULL,
    marketplace VARCHAR(20) NOT NULL,
    listing_id VARCHAR(100) NOT NULL,
    market_hash_name VARCHAR(255) NOT NULL,
    item_name VARCHAR(128),
    price_cents INT,
    float_value DECIMAL(18,17),
    exterior VARCHAR(20),
    is_stattrak BOOLEAN DEFAULT FALSE,
    is_souvenir BOOLEAN DEFAULT FALSE,
    icon_url TEXT,
    listing_url TEXT,
    rarity VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_token, marketplace, listing_id)
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_watchlist_user_token ON watchlist(user_token);

-- Index for marketplace filtering
CREATE INDEX IF NOT EXISTS idx_watchlist_marketplace ON watchlist(marketplace);

-- Index for listing lookups during refresh
CREATE INDEX IF NOT EXISTS idx_watchlist_listing ON watchlist(marketplace, listing_id);
