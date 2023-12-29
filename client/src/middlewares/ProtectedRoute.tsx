import SignIn from "../pages/SignIn";


interface ProtectedRouteProps {
  isAuthenticated: boolean;
  component: React.ComponentType;
}


const ProtectedRoute = ({ isAuthenticated, component: Component }: ProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <SignIn />
  }

  return <>
    <Component />
  </>;
};

export default ProtectedRoute
