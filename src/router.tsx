import { Link, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { QueryClient } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    context: {
      queryClient: new QueryClient(),
    },
    defaultPreloadStaleTime: 0,
    defaultPreload: 'intent',
    defaultNotFoundComponent: () => {
      return (
        <div>
          <p>Not Found Page</p>
          <Link to="/">Go Home</Link>
        </div>
      )
    },
  })
  return router
}
