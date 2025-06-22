# Job Application Tracker Frontend

This is a React + TypeScript frontend for the Job Application Tracker project. It uses [Vite](https://vitejs.dev/) for fast development and build, [Material-UI (MUI)](https://mui.com/) for UI components, and communicates with a backend API for managing job applications.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A running backend API (see proxy settings in `vite.config.ts`)

---

## Getting Started

### 1. Clone the Repository
```git clone https://github.com/Rubicen cd JobApplicationTracker.FrontEnd```

### 2. Install Dependencies
```npm install```
### 3. Configure API Proxy (Optional)

The frontend is configured to proxy API requests to your backend.  
Check `vite.config.ts` and update the `target` in the `proxy` section if your backend runs on a different URL or port.

### 4. Start the Development Server
````npm run dev````
- The app will be available at [http://localhost:53354](http://localhost:53354) (or the port specified in `vite.config.ts`).

## Project Structure
src/ components/    # React components (tables, toolbars, header, etc.) 
models/             # TypeScript models and DTOs 
services/           # API service functions 
index.css           # Global styles 
main.tsx            # App entry point 
App.tsx             # Root component