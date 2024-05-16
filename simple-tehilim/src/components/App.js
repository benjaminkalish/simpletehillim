import '../css/App.css';
import Main from './Main';
import Reader from './Reader';
import { Outlet, Route, createBrowserRouter, createRoutesFromElements, Navigate, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<>{<Outlet />}</>}>
    <Route index element={<Main />} />
    <Route path='/perek/:id' element={<Reader type={'perek'}/>} loader={({params}) => loader(`/perek/${params.id}`)}/>
    <Route path='/month/:id' element={<Reader type={'month'}/>} loader={({params}) => loader(`/month/${params.id}`)}/>
    <Route path='/week/:id' element={<Reader type={'week'}/>} loader={({params}) => loader(`/week/${params.id}`)}/>
    <Route path='/sefer/:id' element={<Reader type={'sefer'}/>} loader={({params}) => loader(`/sefer/${params.id}`)}/>
    <Route path="*" element={<Navigate to="/" replace="true" />} />
  </Route>
))

function App() {
  return (
    <RouterProvider router={router} />
  );
}

async function loader(pathName) { 
  try {
      const response = await fetch(/* window.location.origin + '/api'*/'http://localhost:8080/api' + pathName)
      if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      return data
  } catch (e) {
      if (e.name === 'AbortError') {
          console.log(`fetch cancelled: ${e.message}`);
      }
      else {
          console.error(e.message)
      }
  }
}

export default App;
