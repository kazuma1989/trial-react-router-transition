import React, { useContext, useMemo } from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Link,
  UNSAFE_NavigationContext as NavigationContext,
  Route,
  Routes,
} from 'react-router-dom'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <MyRouter>
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
      </MyRouter>
    </BrowserRouter>
  </React.StrictMode>
)

// // これはうまくいかない
// const pushState = window.history.pushState.bind(window.history)

// window.history.pushState = (...args) => {
//   // @ts-expect-error startViewTransition を実験的に使いたい
//   document.startViewTransition(() => {
//     pushState(...args)
//   })
// }

function MyRouter({ children }: { children: React.ReactNode }) {
  const original = useContext(NavigationContext)

  const hookedNavigation = useMemo(() => {
    // @ts-expect-error startViewTransition を実験的に使いたい
    if (typeof document.startViewTransition !== 'function') {
      return original
    }

    const navigator = new Proxy(original.navigator, {
      get(target, propertyKey: keyof typeof original.navigator, receiver) {
        if (propertyKey !== 'push') {
          return Reflect.get(target, propertyKey, receiver)
        }

        const originalPush = Reflect.get(target, propertyKey, receiver)

        const newPush: typeof originalPush = (...args) => {
          // @ts-expect-error startViewTransition を実験的に使いたい
          document.startViewTransition(() => {
            originalPush(...args)
          })
        }

        return newPush
      },
    })

    return {
      ...original,
      navigator,
    }
  }, [original])

  return (
    <NavigationContext.Provider value={hookedNavigation}>
      {children}
    </NavigationContext.Provider>
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
