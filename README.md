# Type.TMTR

A modern, feature-rich typing game built with React and TypeScript, inspired by MonkeyType. Test and improve your typing speed and accuracy with detailed analytics and beautiful themes.

## Features

- **MonkeyType-style Typing Game**: Clean, distraction-free typing interface
- **Real-time Performance Tracking**: Live WPM and accuracy calculations
- **Detailed Analytics**: Comprehensive graphs and statistics for your typing sessions
- **Multiple Themes**: Customize your typing experience with various color schemes
- **User Profiles**: Create an account to track your progress over time
- **Cloud Data Storage**: All your typing data is securely stored and synced across devices
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Firebase
- **Database**: Firestore
- **Authentication**: Firebase Auth
- **Hosting**: Vercel
- **Charts**: Chart.js / Recharts (for performance graphs)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

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

3. Set up Firebase
    - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
    - Enable Firestore Database
    - Enable Authentication (Email/Password)
    - Copy your Firebase config

4. Create environment variables
```bash
# Create .env file in root directory
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

5. Start the development server
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Usage

1. **Start Typing**: Click on the text area and start typing the displayed text
2. **Real-time Feedback**: See your WPM and accuracy update in real-time
3. **Complete Test**: Finish typing to see detailed results
4. **View Analytics**: Check your performance graphs and statistics
5. **Customize Experience**: Switch between different themes
6. **Track Progress**: Sign up to save your results and track improvement over time

## Feature Details

### Typing Engine
- Accurate WPM calculation (Words Per Minute)
- Real-time accuracy tracking
- Error highlighting and correction
- Multiple test lengths and difficulties

### Analytics Dashboard
- Performance graphs showing WPM over time
- Accuracy trends and improvements
- Detailed session statistics
- Historical data comparison

### User System
- Secure authentication with Firebase Auth
- Personal typing profiles
- Cross-device data synchronization
- Progress tracking and goal setting

### Theming System
- Multiple pre-built themes
- Dark and light mode options
- Customizable color schemes
- Smooth theme transitions

## Acknowledgments

- Inspired by [MonkeyType](https://monkeytype.com)
- Built with [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)
- Powered by [Firebase](https://firebase.google.com/)