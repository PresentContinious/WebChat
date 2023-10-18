import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signUp/SignUp";

const AppRoutes = [
    {
        index: true,
        element: <Home/>
    },
    {
        path: '/:param',
        element: <Home/>
    },
    {
        path: '/sign-in',
        element: <Login/>
    },
    {
        path: '/sign-up',
        element: <SignUp/>
    },
];

export default AppRoutes;
