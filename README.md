#WorldBank Dashboard 
## Angular Frontend

This is the **Angular 17 frontend** for the Django API backend.  
It provides the user interface for authentication and data visualization, communicating with the backend via REST API.

---

## 🚀 Features
- User authentication (register, login, logout).
- Fetch and display data from Django API.
- Responsive design with Angular.
- CSRF token management for secure requests.
- Deployed separately from the backend (can connect via API base URL).

---

## 🛠 Tech Stack
- **Frontend Framework:** Angular 17  
- **Styling:** CSS / SCSS  
- **HTTP Client:** Angular `HttpClientModule`  
- **Backend (API):** Django REST Framework  

---

## 📂 Project Structure
```
src/
│── app/
│ ├── auth/
│ │ ├── login/ # Login component
│ │ ├── register/ # Register component
│ ├── welcome/ # Welcome/Dashboard
│ ├── services/ # API & Auth services
│ ├── app-routing.module.ts
│ ├── app.component.ts
│ ├── app.module.ts
│── assets/
│── environments/
│ ├── environment.ts # Development config
│ ├── environment.prod.ts # Production config
```
---

## ⚙️ Installation & Setup

### 1. Clone the repository
```
git clone https://github.com/your-username/angular-frontend.git
cd angular-frontend
```

2. Install dependencies
```
npm install
```
3. Run the development server
```
ng serve
```
`Frontend runs at: http://localhost:4200`

## 🔗 API Integration
Set the backend API base URL in src/environments/environment.ts:

typescript:
```
export const environment = {
  production: false,
  apiBase: "http://127.0.0.1:8000/api"
};
```
For production, update environment.prod.ts with your deployed Django API URL.

## 🔑 Features in UI
- Register
- User fills in username & password.

#### Data sent to:
- `POST /api/auth/register/`

- LoginUser logs in via:
`POST /api/auth/login/`

- Stores session & CSRF token for future requests.

##### Dashboard Fetches protected data:

`GET/api/indicators/country=in&codes=ny.gdp.mktp.cd,sp.pop.totl&start=2000&end=2023`

##### LogoutClears session and calls `POST /api/auth/logout/`.
---

### 📦 Deployment
Build the project:
```
ng build --configuration production
```

- The output is stored in the dist/ folder.

- Can be deployed on Netlify, Vercel, or Render (static hosting)
