// router.jsx
import { createBrowserRouter } from 'react-router-dom';
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import AuthGuard from './Authencated';
// import GuestGuard from './GuestGuard';

// If you don't need a base path, omit basename entirely.
// Otherwise, use a STRING like "/app".
const router = createBrowserRouter(
  [
    {
      // Protected area
      element: <AuthGuard />,
      children: [MainRoutes],   // MainRoutes must be a RouteObject
    },
    {
      // Public/guest area (login, register, etc.)
      children: [LoginRoutes],  // LoginRoutes must be a RouteObject
    }
  ],
  // { basename: '/app' } // <-- only if you really need a base URL
);

export default router;
