import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  LinkProps,
  Route,
  Routes,
  useHref,
  useLinkClickHandler,
} from 'react-router-dom'
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

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ onClick, replace = false, state, target, to, ...rest }, ref) => {
    const href = useHref(to)
    const handleClick = useLinkClickHandler(to, {
      replace,
      state,
      target,
    })

    return (
      <a
        {...rest}
        href={href}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) {
            handleClick(event)
          }
        }}
        ref={ref}
        target={target}
      />
    )
  }
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
