import '../css/App.css';
import Main from './Main';
import Reader from './Reader';
import { Outlet, Route, createBrowserRouter, createRoutesFromElements, Navigate, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<>{<Outlet />}</>}>
    <Route index element={<Main />} />
    <Route path='/chapter/:id' element={<Reader />} />
    <Route path='/month/:id' element={<Reader />} />
    <Route path='/week/:id' element={<Reader />} />
    <Route path='/book/:id' element={<Reader />} />
    <Route path="*" element={<Navigate to="/" replace="true" />} />
  </Route>
))

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
