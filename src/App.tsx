import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './components/Layout';
import Home from './views/home';
import Calculator from './views/calculator';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/calculator/:name',
    element: <Calculator />,
    caseSensitive: true,
  },
]);

const App: React.FC = () => {
  return (
    <AppLayout>
      <RouterProvider router={router} />
    </AppLayout>
  );
};

export default App;
