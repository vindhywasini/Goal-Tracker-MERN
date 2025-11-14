# Todo Backend (TypeScript + Node.js + Express)

## Setup
1. Copy `.env.example` to `.env` and fill values (MongoDB Atlas URI, JWT_SECRET).
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Run in dev:
   ```bash
   npm run dev
   ```
4. Build:
   ```bash
   npm run build
   npm start
   ```

The backend exposes auth and todo routes and logs errors to a `logs` collection in MongoDB.
