# PsychCare — Psychologist Services App

A React application for discovering and booking psychologist services.

## 🔗 Live Demo

[Deploy link here — replace after deployment]

## 📐 Figma Design

[Figma link here — replace with actual link]

## 🚀 Technologies

| Technology | Purpose |
|---|---|
| React 18 | UI library |
| Vite | Build tool |
| React Router v6 | Client-side routing |
| Firebase Auth | User authentication (register / login / logout) |
| Firebase Realtime DB | Psychologists data collection |
| react-hook-form + yup | Form handling & validation |
| react-hot-toast | Notifications |
| localStorage | Favorites persistence per user |

## 📄 Pages

- **Home** — Hero section with CTA button linking to Psychologists page
- **Psychologists** — Paginated list (3 per load) with sorting by name / price / rating
- **Favorites** *(private)* — Shows cards the logged-in user has favorited

## ✨ Features

- Registration & Login with Firebase Auth
- Form validation with react-hook-form & yup
- Modal windows closable via ✕ button, backdrop click, or Escape key
- Heart button adds/removes favorites (localStorage, persists on refresh)
- Expandable psychologist cards with reviews
- Make an appointment modal form
- Sort by: A→Z, Z→A, price ↑↓, rating ↑↓
- Load more (3 per click, new DB request each time)
- Protected Favorites route (redirect to home if not logged in)
- Fully responsive: 320px – 1440px

## 🛠️ Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd psychologists-app
npm install
```

### 2. Configure Firebase

Edit `src/firebase.js` and replace the placeholder values with your Firebase project config:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",   // ← required for Realtime DB
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

### 3. Populate Firebase Realtime Database

In the Firebase console:
1. Go to **Realtime Database** → **Import JSON**
2. Upload `public/psychologists.json`
3. The data will be accessible at `/psychologists`

> **Realtime DB Rules (for development):**
> ```json
> {
>   "rules": {
>     "psychologists": {
>       ".read": true,
>       ".write": false
>     }
>   }
> }
> ```

### 4. Run locally

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

## 📂 Project Structure

```
src/
├── components/
│   ├── Layout.jsx          # Header + Outlet
│   ├── AuthModal.jsx       # Login / Register modal
│   ├── PsychologistCard.jsx
│   ├── AppointmentModal.jsx
│   └── SortDropdown.jsx
├── context/
│   ├── AuthContext.jsx     # Firebase auth state
│   └── FavoritesContext.jsx # localStorage favorites
├── hooks/
│   └── usePsychologists.js # Firebase DB pagination hook
├── pages/
│   ├── Home.jsx
│   ├── Psychologists.jsx
│   ├── Favorites.jsx
│   └── NotFound.jsx
├── firebase.js             # Firebase init
├── App.jsx                 # Routes
├── main.jsx                # Entry point
└── index.css               # Global styles
```

## 🎨 Color Themes

The design supports three color palette variations (matching Figma):
- **Green** (default): `#54BE96`
- **Blue**: `#4285F4`
- **Orange**: `#F4A340`

To change theme, update the `--color-primary` variable in `src/index.css`.
