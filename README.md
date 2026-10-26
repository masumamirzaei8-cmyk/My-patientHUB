# MyPatientHUB — Healthcare Dashboard

A responsive healthcare web app built with **React 18 + Vite + Tailwind CSS 4**.
Everything runs in the browser (demo data + `localStorage`), no backend needed.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Other commands:

```bash
npm run build      # production build -> dist/
npm run preview    # serve the production build
```

On Windows you can also double-click `START_MY_PATIENTHUB.bat`.

## Demo login

Create an account on the **Sign Up** tab, then sign in.

- Email must be a Gmail address (`name@gmail.com`)
- Password is exactly 4 characters (demo rule)

## Pages

| Route | What it shows |
| --- | --- |
| `/dashboard` | Stat cards, donut charts (clinics / pharmacies / market usage), health index trend |
| `/appointments` | Book, view and cancel appointments with search and status filter |
| `/find-doctor` | Doctor directory with photos, specialty filter, profile modal |
| `/find-clinic` | Clinic directory + interactive Afghanistan map |
| `/chat` | Demo conversations with auto-reply |
| `/marketplace` | Product cards, results table, cart and checkout (demo) |
| `/find-pharmacy` | Pharmacy directory with delivery filter |
| `/dependents` | Add / edit / remove family members |
| `/account`, `/settings`, `/support` | Profile + photo upload, theme, help center |

## Project structure

```
index.html            entry page  -> loads /src/main.jsx
src/main.jsx          React entry (ThemeProvider + Toaster)
src/App.jsx           routes (public login, protected dashboard layout)
src/context/          Auth, App (appointments, cart, chat...), Theme
src/pages/            one file per page
src/components/       Sidebar, Navbar, charts, map, SafeImage...
src/data/             doctors, clinics, pharmacies, products
public/images/        local doctor portraits and product pictures (SVG)
```

## Notes

- All images are local files in `public/images/` — nothing depends on an external image host.
- To use real photos, replace the files in `public/images/doctors/` and `public/images/products/`
  (or change the `image` paths in `src/data/*.js`). `SafeImage` shows an emoji if a file is missing.
- All user data (accounts, appointments, cart, theme) lives in the browser's `localStorage`.

---

## راهنمای سریع (فارسی)

1. Node.js را نصب کنید (نسخه ۱۸ یا بالاتر).
2. داخل پوشه‌ی پروژه این دستورها را بزنید:
   ```
   npm install
   npm run dev
   ```
3. آدرس `http://localhost:3000` را در مرورگر باز کنید.
4. در صفحه‌ی ورود، اول **Sign Up** کنید (ایمیل باید Gmail باشد و رمز ۴ حرف) و بعد وارد شوید.
