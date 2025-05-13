# 🔍 IP Lookup Tool

This is a simple and effective IP Lookup tool that allows users to check the geolocation and metadata of any public IP address. It is built with a modern full-stack framework and includes both frontend and backend components.

## 🚀 Features

- Get details about any IP address including location, ISP, and timezone
- Built-in authentication (Anonymous sign-in)
- Real-time querying powered by a hosted backend
- Fast and responsive UI built with modern JavaScript tooling

## 🧩 Tech Stack

- **Frontend**: Built using [Vite](https://vitejs.dev/) for fast builds and hot reloading
- **Authentication**: Anonymous login enabled (can be customized)
- **Deployment**: Connected to a live Convex deployment (`dashing-weasel-50`

## ⚙️ Getting Started

1. Clone this repo  
2. Install dependencies  
   ```bash
   npm install
   ```
3. Start the development server  
   ```bash
   npm run dev
   ```
4. Visit the app at `http://localhost:5173`

## 🔐 Authentication

The app currently supports anonymous login for quick access. You can easily switch to other providers like Google, GitHub, or custom auth in the backend configuration.

## 📡 API & Routing

Custom HTTP routes are defined in `convex/router.ts`. This file contains all logic for public API endpoints that interface with the IP lookup service.

## 📦 Deployment

This app is linked to a live Convex deployment: https://dashing-weasel-50.convex.app/



