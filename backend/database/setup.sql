-- AIContentControl Database Setup Script
-- Run this script in PostgreSQL to create the required database and tables

-- Create database (run this first, separately)
-- CREATE DATABASE aicontentcontrol;

-- Connect to the database and run the following:

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    business_email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Strategies table (for storing user-generated strategies)
CREATE TABLE IF NOT EXISTS strategies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    user_interest VARCHAR(255) NOT NULL,
    target_interest VARCHAR(255) NOT NULL,
    strategy_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(business_email));

-- Index for user strategies lookup
CREATE INDEX IF NOT EXISTS idx_strategies_user_id ON strategies (user_id);

-- Refresh tokens table (for JWT refresh token rotation)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens (user_id);
