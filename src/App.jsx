import { useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';


// layouts
import RootLayout from "./layouts/RootLayout";

// pages
import Login from "./pages/Login";
import UserPage from "./pages/UserPage";
import CreateOrUpdateBlog from "./pages/CreateOrUpdateBlog";
import HomepageBlogList from "./pages/HomepageBlogList";
import Blog from "./pages/Blog";

function App() {

  const [isAuth, setIsAuth] = useState(
    localStorage.getItem('isAuth') || false
  );

  let loginStatusPath, loginStatusElement;

  if (isAuth) {
    loginStatusPath = "/";
    loginStatusElement =
    <Link to='/userpage'>
      <FontAwesomeIcon icon={faCircleUser} size="lg" />
    </Link>;

  } else {
    loginStatusPath = "/login";
    loginStatusElement = <Link to='/login'>Login</Link>;
  }


  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RootLayout
              element={loginStatusElement}
              isAuth={isAuth}
            />
          }
        >

          <Route path="/" element={<HomepageBlogList />} />


          <Route
            path='/login'
            element={
              <Login
                setIsAuth={setIsAuth}
              />
            }
          />

          <Route
            path="/userpage"
            element={<UserPage isAuth={isAuth} setIsAuth={setIsAuth} />}
          />

          <Route
            path="/createblog"
            element={<CreateOrUpdateBlog isAuth={isAuth} />}
          />

          <Route path="/blog/:id" element={<Blog isAuth={isAuth} />} />



        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
