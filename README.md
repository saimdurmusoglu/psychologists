# psychologists.services — Psychologist Services App

A React + TypeScript application for discovering and booking psychologist services.

## 🔗 Live Demo

[Deploy link here — replace after deployment]

## 📐 Figma Design

[Figma link here — replace with actual link]

## 🚀 Technologies

| Technology            | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| React 18 + TypeScript | UI library                                      |
| Vite                  | Build tool                                      |
| React Router v6       | Client-side routing                             |
| Firebase Auth         | User authentication (register / login / logout) |
| Firebase Realtime DB  | Psychologists data collection                   |
| react-hook-form + yup | Form handling & validation                      |
| react-hot-toast       | Notifications                                   |
| CSS Modules           | Component-scoped styling                        |
| localStorage          | Favorites persistence per user                  |

## 📄 Pages

- **Home** — Hero section with CTA button linking to Psychologists page
- **Psychologists** — Paginated list (3 per load) with sorting by name / price / rating
- **Favorites** _(private)_ — Shows cards the logged-in user has added to favorites

## ✨ Features

- Registration & Login with Firebase Auth
- Form validation with react-hook-form & yup
- Modal windows closable via ✕ button, backdrop click, or Escape key
- Heart button adds/removes favorites (localStorage, persists on refresh)
- Expandable psychologist cards with reviews
- Make an appointment modal form with custom time picker
- Sort by: A→Z, Z→A, price ↑↓, rating ↑↓, Popular, Show All
- Load more (3 per click, new DB request each time)
- Protected Favorites route (redirect to home if not logged in)
- Color theme switcher (Green / Blue / Orange)
- Fully responsive: 320px – 1440px

## 🛠️ Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd psychologists
npm install
```

### 2. Configure Firebase

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Populate Firebase Realtime Database

In the Firebase console:

1. Go to **Realtime Database** → **⋮** → **Import JSON**
2. Upload the provided `firebase-import.json`
3. The data will be accessible at `/psychologists`

> **Realtime DB Rules:**
>
> ```json
> {
>   "rules": {
>     "psychologists": {
>       ".read": true,
>       ".write": false,
>       ".indexOn": ["name", "price_per_hour", "rating"]
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
│   ├── Layout/             # Header + Outlet
│   ├── Header/             # Navigation + auth buttons
│   ├── AuthModal/          # Login / Register modal
│   ├── AppointmentModal/   # Booking modal with time picker
│   ├── PsychologistCard/   # Card with expandable details
│   ├── SortDropdown/       # Filter/sort dropdown
│   └── ThemePicker/        # Color theme switcher
├── context/
│   ├── AuthContext.tsx     # Firebase auth state
│   ├── FavoritesContext.tsx # localStorage favorites
│   └── ThemeContext.tsx    # Color theme state
├── hooks/
│   └── usePsychologists.ts # Firebase DB pagination hook
├── pages/
│   ├── Home/
│   ├── Psychologists/
│   ├── Favorites/
│   └── NotFound/
├── styles/
│   ├── variables.css       # CSS custom properties + themes
│   ├── reset.css           # CSS reset
│   └── global.css          # Global styles, buttons, modals
├── firebase.ts             # Firebase init
├── App.tsx                 # Routes
└── main.tsx                # Entry point
```

## 🎨 Color Themes

The app supports three color themes switchable at runtime via the palette icon:

- **Green** (default): `#54BE96`
- **Blue**: `#3470FF`
- **Orange**: `#FC832C`

Themes are applied via `data-theme` attribute on the `<html>` element and persisted in `localStorage`.
