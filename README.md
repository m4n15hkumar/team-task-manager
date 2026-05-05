# Team Task Manager (Asana Clone)

A full-stack web application for managing team projects and tasks, inspired by Asana. Built with the MERN stack (MongoDB, Express, React, Node.js).

## Submission Links
- **Live Application URL**: [Insert Railway URL Here]
- **GitHub Repository**: [Insert GitHub Repo URL Here]
- **Demo Video**: [Insert Video Link Here]

## Features
- **Authentication**: JWT-based secure login and registration.
- **Role-Based Access**: Project admins and members with distinct permissions.
- **Asana-Inspired My Tasks**: Independent personal tasks, inline quick-creation, and comprehensive views.
- **Multiple Views**: Kanban Board, List View, Calendar View, and Analytics Dashboard.
- **Dynamic Widgets**: Task progress tracking, priority breakdown bars, and recent activity feeds.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide React (Icons)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

---

## Local Development Setup

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory with the following variable:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## Railway Deployment Guide

This project is configured as a monorepo where the Express backend serves the built React frontend in production. This allows you to deploy the entire full-stack app as a **single web service** on Railway.

### Step 1: Push to GitHub
Commit all your code and push it to a public or private GitHub repository.

### Step 2: Set up MongoDB
1. Create an account on [Railway.app](https://railway.app/).
2. Click **New Project** -> **Provision PostgreSQL/MySQL/MongoDB** -> Choose **MongoDB**.
3. Once provisioned, click the MongoDB service, navigate to the **Connect** tab, and copy your `Mongo Connection URL`.

### Step 3: Deploy the Web Service
1. In your Railway project, click **New** -> **GitHub Repo** and select your repository.
2. Click on your newly created Web Service and navigate to the **Settings** tab.
3. Scroll to **Root Directory** and type `/backend`.
4. Navigate to the **Variables** tab and add:
   - `MONGO_URI` = *(Paste your copied MongoDB URL)*
   - `JWT_SECRET` = *(Enter a secure random string)*
   - `NODE_ENV` = `production`
5. Go back to the **Settings** tab and find **Build Command**. Enter this custom command to build the frontend first:
   ```bash
   npm install && cd ../frontend && npm install && npm run build && cd ../backend
   ```
6. Set the **Start Command** to:
   ```bash
   npm start
   ```

### Step 4: Generate Live URL
1. In the **Settings** tab of your web service, scroll down to the **Networking** section.
2. Click **Generate Domain**. Railway will instantly provide you with a live `.up.railway.app` URL.
3. Paste this URL into the "Submission Links" section at the top of this README.
