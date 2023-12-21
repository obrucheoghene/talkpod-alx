import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import routes from "./utils/AppRoutes";

function App() {
const {user} = useContext(AuthContext)
const isAuthenticated = !!user

  return (
    <BrowserRouter>
    <Routes>
      {routes(isAuthenticated).map((route) => <Route key={route.path} path={route.path} element={route.element}/>)}
    </Routes>
    </BrowserRouter>
  )
}

export default App
