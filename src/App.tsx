import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './components/Layout';
import Home from './views/home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
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
