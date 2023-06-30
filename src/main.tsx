import { BrowserHistory, createBrowserHistory } from 'history'
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouterProps,
  Link,
  Route,
  Router,
  Routes,
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

/**
 * @see https://github.com/remix-run/react-router/blob/382c792ad8feb9a4d77a8046143982ba8bd0714f/packages/react-router-dom/index.tsx#L143-L173
 */
function BrowserRouter({ basename, children, window }: BrowserRouterProps) {
  const historyRef = useRef<BrowserHistory>()
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({ window })
  }

  const history = historyRef.current
  const [state, setStateOriginal] = useState({
    action: history.action,
    location: history.location,
  })

  const setState: typeof setStateOriginal = useMemo(() => {
    if (
      !('startViewTransition' in document) ||
      typeof document.startViewTransition !== 'function'
    ) {
      return setStateOriginal
    }

    const startViewTransition = document.startViewTransition.bind(document)

    return (...args) => {
      startViewTransition(() => {
        setStateOriginal(...args)
      })
    }
  }, [])

  useLayoutEffect(() => history.listen(setState), [history, setState])

  return (
    <Router
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  )
}

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
