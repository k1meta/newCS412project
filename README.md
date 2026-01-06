# CS2 Market Research

A web application for researching CS2 (Counter-Strike 2) skin prices across multiple marketplaces.

## Features

- 🔍 Search skins across CSFloat, Skinport, and Bitskins
- 💰 Filter by price range
- 🎯 Filter by float value
- 🏷️ Filter by condition (FN, MW, FT, WW, BS)
- ⭐ Filter by type (StatTrak, Souvenir, Normal)
- 📊 Sort by price or float (ascending/descending)
- ❤️ Watchlist functionality with persistent storage
- 🔄 Refresh to get latest listings
- 🗑️ Auto-remove sold/expired items from watchlist

## Tech Stack

- **Frontend**: React + Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL

## Project Structure

```
CS2MarketResearchV2/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── context/        # React context (Watchlist)
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utilities and constants
│   └── ...
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   └── services/       # Marketplace API services
│   └── ...
└── database/
    └── schema.sql          # PostgreSQL schema
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- API keys for CSFloat, Skinport, and Bitskins

### 1. Database Setup

1. Install PostgreSQL
2. Create database:
   ```sql
   CREATE DATABASE cs2market;
   ```
3. Run schema:
   ```bash
   psql -d cs2market -f database/schema.sql
   ```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file with your credentials:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cs2market
DB_USER=postgres
DB_PASSWORD=your_password

CSFLOAT_API_KEY=your_key
SKINPORT_API_KEY=your_key
BITSKINS_API_KEY=your_key
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## API Endpoints

### Items
- `GET /api/items` - Search items across all marketplaces
- `GET /api/items/refresh` - Refresh items from APIs
- `GET /api/items/:marketplace` - Get items from specific marketplace

### Watchlist
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add item to watchlist
- `DELETE /api/watchlist/:marketplace/:listingId` - Remove item
- `POST /api/watchlist/refresh` - Remove stale items

## Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| search | Item name search | `AK-47 Redline` |
| min_price | Minimum price (cents) | `1000` |
| max_price | Maximum price (cents) | `50000` |
| min_float | Minimum float value | `0.00` |
| max_float | Maximum float value | `0.07` |
| conditions | Comma-separated conditions | `fn,mw` |
| type | Item type | `stattrak` |
| marketplace | Specific marketplace | `csfloat` |
| sort | Sort option | `price_asc` |

## License

This is a school project.
