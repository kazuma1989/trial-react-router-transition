import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/a"
          element={
            <Layout>
              <h1>/a</h1>
            </Layout>
          }
        />

        <Route
          path="/b"
          element={
            <Layout>
              <h1>/b</h1>
            </Layout>
          }
        />

        <Route
          path="*"
          element={
            <Layout>
              <App />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">/</Link>
          </li>
          <li>
            <Link to="/a">/a</Link>
          </li>
          <li>
            <Link to="/b">/b</Link>
          </li>
        </ul>
      </nav>

      {children}
    </div>
  )
}
