import { Outlet, BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//Layouts
import AuthLayout from '@/layouts/AuthLayout';


//Pages
import Home from '@/pages/Home';

// User pages



const Auth = () => (
    <AuthLayout>
        <Outlet />
    </AuthLayout>
)

// const User = () => (
//     <UserLayout>
//         <Outlet />
//     </UserLayout>
// )


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route element={<Auth />}>
                    <Route path="/" element={<Home />} />
                </Route>

                {/* Page Routes */}
                {/* // <Route path="/auth" element={<Create />} /> */}


                {/* User Routes */}
                {/* <Route path="/user" element={<User />}> */}
                {/* <Route path="dashboard" element={<Dashboard />} /> */}
                {/* </Route> */}
            </Routes>
        </Router>
    );
}

export default AppRoutes;