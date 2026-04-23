# Type.TMTR

A modern, professional typing platform built with React and TypeScript. Engineered for performance and aesthetics, it provides comprehensive analytics, a distraction-free interface, and detailed historical tracking to help users improve their typing speed and accuracy.

## Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

## Core Features

- **Minimalist Interface**: A distraction-free typing environment focused entirely on the content.
- **Multiple Modes**: Support for both time-based (15s, 30s, 60s, 120s) and word-count-based (10, 25, 50, 100) tests.
- **Real-time Engine**: Character-by-character tracking with immediate error validation and dynamic WPM calculation.
- **Strict Mode**: Optional "Stop on Error" behavior to enforce absolute precision.
- **Post-test Analytics**: Detailed breakdown of Net WPM, Raw WPM, Accuracy, Consistency, and keystroke distribution.
- **Performance Visualization**: Interactive trend graphs utilizing Recharts to map typing velocity over the course of a test.
- **Persistent Profiles**: Secure user authentication via Firebase to track lifetime statistics and history.
- **Data Dashboard**: A professional data-table layout detailing historical performance, ultimate bests, and long-term WPM progression.
- **Premium Theming**: Native integration of the Catppuccin color ecosystem, offering Light (Latte) and Dark (Frappe, Macchiato, Mocha) variants.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun
- A Firebase project

### Installation

1. Clone the repository
```bash
git clone https://github.com/tamatar-23/type_tmtr.git
cd type_tmtr
```

2. Install dependencies
```bash
npm install
```

3. Configure Environment Variables
Create a `.env` file in the root directory and populate it with your Firebase configuration credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server
```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

## Architecture Details

- **Typing Engine**: The core typing state machine is handled via custom React hooks, ensuring high-performance re-renders isolated entirely to the typing layer.
- **Data Persistence**: Firestore is utilized for storing user test results. Queries are structured sequentially, allowing for client-side aggregation of lifetime statistics without heavy backend computational loads.
- **Styling**: Component-based styling is enforced via Tailwind CSS with a central `index.css` defining dynamic CSS variables, enabling instant, seamless theme transitions.

## Acknowledgments

Built utilizing React, TypeScript, and Tailwind CSS. Hosted database and authentication services provided by Google Firebase.