import { Link, Outlet } from "react-router-dom";

function RootLayout({element, isAuth}) {
  
  const loggedStatusDataAttrValue = (isAuth) ? "logged_in" : "logged_out";
  
  return (
    <>
      <header>
        <nav className="main-navbar">
          <ul>
            <li><Link to='/'>gBlog</Link></li>
            <li data-loggedstatus={loggedStatusDataAttrValue}>
              {element}
            </li>
          </ul>
        </nav>
      </header>

      <section className="app-content-container">
        <Outlet />
      </section>
    </>
  );
}

export default RootLayout;