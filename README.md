# Shukuma Exercise App

A clean, modern, fully responsive web-based exercise app that converts physical Shukuma exercise cards into a digital experience.

## Features

- **Browse Workout Cards**: View all 52+ exercise cards with smooth flip animations
- **Card Flip Animation**: Click any card to flip from front image to instruction view
- **Random Workout Generator**: Generate randomized daily workouts with adjustable exercise count
- **Smart Filtering**: Filter exercises by difficulty (Easy, Medium, Hard), type (Cardio, Strength, Flexibility), and duration (Short, Medium, Long)
- **Fully Responsive**: Mobile-first design that works smoothly on both desktop and mobile devices
- **Auto-Generated Instructions**: Simple, neutral instructions automatically generated for each exercise
- **Special Cards**: Includes water break and disclaimer cards in random workouts

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing

## Client-only / Storage

- This project is now a client-only web app: it uses Firebase Auth for authentication and stores all user data (workouts, progress, settings) in browser localStorage. There is no server-side database included in this repository. If you want a server and database, add a server implementation and reenable server-side code.

## Project Structure

```
src/
├── components/
│   ├── Card.jsx              # Flippable card component with animations
│   ├── FilterBar.jsx         # Exercise filtering controls
│   └── Navbar.jsx            # Responsive navigation
├── pages/
│   ├── Home.jsx              # Landing page
│   ├── AllExercises.jsx      # Browse all exercises with filters
│   └── RandomWorkout.jsx     # Random workout generator
├── data/
│   └── metadata.js           # Exercise metadata mappings
├── utils/
│   ├── loadCards.js          # Dynamic card loading utility
│   └── instructionGenerator.js # Auto-generate exercise instructions
├── App.jsx                   # Main app component with routing
├── main.jsx                  # Entry point
└── index.css                 # Global styles
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Ensure Card Images are in Place**
   - Exercise cards should be located at:
     `C:\Users\Sandile\Desktop\Shukuma App\Shukuma Cards_Full Deck`
   - The app will automatically load all images from the subdirectories

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Environment variables & secrets ⚠️

This project uses Firebase for client-side authentication. To keep credentials out of source control:

- Create a local `.env.local` file in the project root (this is ignored by default) and add your Firebase values using the `VITE_` prefix. For example:

```dotenv
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=1:xxxx:web:xxxxx
VITE_FIREBASE_MEASUREMENT_ID=G-XXXX
```

- The project already includes an `.env.example` with placeholders you can copy from. The `.env.local` file is ignored by `.gitignore`, so it should not be committed.

- If you accidentally committed `.env` or any build artifacts containing secrets (for example, `dist`), rotate the keys in the Firebase Console and remove the files from git history. Example steps:

```powershell
# Remove the committed .env from the repo (untrack and remove from cached history)
git rm --cached .env
git commit -m "Remove .env with secrets"

# Remove build artifacts or dist from the repo if they were committed
git rm -r --cached dist
git commit -m "Remove dist build artifacts that contain secrets"

# Use `git push` or force push by force-with-lease if necessary.
```

- Important: rotate the API key and other tokens in Firebase Console if any of these values were pushed to a public repo or included in publicly accessible files.

## Prevent secrets from appearing in production bundles

- Vite variables prefixed with `VITE_` will be included in the client bundle; that is expected for Firebase client-side configurations (they're not the same as server-only secrets). However, avoid committing these variables to repo or publishing build artifacts that contain them. Keep them locally in `.env.local` or set them as environment variables in your hosting platform (Netlify, Vercel, etc.).

## Card Organization

The app automatically scans and loads cards from these directories:
- `Cardio Exercise Cards/` (13 cards)
- `Core Exercise Cards/` (13 cards)
- `Lower Body Exercise cards/` (13 cards)
- `Upper Body Exercise Cards/` (13 cards)
- Special cards: Disclaimer Card, Water Break Cards

## Exercise Metadata

Each exercise is tagged with:
- **Difficulty**: Easy, Medium, or Hard
- **Type**: Cardio, Strength, or Flexibility
- **Duration**: Short, Medium, or Long

## How to Use

1. **Home Page**: Overview of the app with quick links to exercises and random workouts
2. **Browse Exercises**: View all exercises with filtering options
3. **Random Workout**: Generate a randomized workout routine with your desired number of exercises
4. **Card Interactions**: Click/tap any card to flip and see detailed instructions

## Mobile Support

- Bottom navigation bar on mobile devices
- Single-column card layout on small screens
- Grid layout on desktop (2-4 columns depending on screen size)
- Touch-friendly card flip interactions

## Future Enhancements

- Save favorite workouts
- Track workout history
- Timer integration for timed exercises
- Progressive Web App (PWA) support for offline access
- Export workout routines

## Developer Notes

- The codebase was converted to a client-only app: `storageUtils` replaces the old `mongoUtils` and uses `localStorage` as persistence. The previous compatibility wrappers (`mongoUtils.js` and `firestoreUtils.js`) have been removed; prefer `storageUtils` imports.
- Server files and database features removed; if you want to re-introduce a backend, create a new `server/` implementation and follow the old patterns for `db-connect-now` and `db-probe` if needed.

## License

Private project for personal use.
