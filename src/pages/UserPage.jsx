import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dialog from "../components/Dialog";
import { auth, db } from "../firebase-config";



function UserPage({ isAuth, setIsAuth }) {

  const navigate = useNavigate();
  const blogsCollectionRef = collection(db, "blogs");
  let useEffectIgnore = false;

  const [blogList, setBlogList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogBoxOpen, setIsDialogBoxOpen] = useState(false);
  const [blogIdToDelete, setBlogIdToDelete] = useState(null);


  if (isAuth === false) {
    navigate('/', { replace: true });
  }

  async function getBlogs() {

    onAuthStateChanged(auth, user => {

      if (auth.currentUser) {
        const q = query(
          blogsCollectionRef,
          where("author.id", "==", auth.currentUser.uid),
          orderBy('createdAt', 'desc'));

        onSnapshot(q, (querySnapshot) => {
          const extractedQuerySnapshot =
            querySnapshot.docs
              .map(doc => ({ ...doc.data(), id: doc.id }));

          setBlogList(extractedQuerySnapshot);
          setIsLoading(false);
        });
      }

    });
  }

  function signUserOut() {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        setIsAuth(false);
        navigate('/', { replace: true });
      });
  }

  async function deleteBlog(blogId) {
    const blogDoc = doc(db, "blogs", blogId);
    await deleteDoc(blogDoc);
    getBlogs();
  }

  async function updateBlog(blogId, blogTitle, blogContent) {
    navigate('/createblog', {
      state: {
        id: blogId,
        title: blogTitle,
        content: blogContent,
      }
    });
  }


  useEffect(() => {

    if (useEffectIgnore === false) {
      getBlogs();
    }

    return () => {
      useEffectIgnore = true;
    };

  }, []);

  return (
    <>
      <div className="user-info-card">

        {(auth?.currentUser?.photoURL) ? (
          <img src={auth?.currentUser?.photoURL} alt="user" />

        ) : (
          <div className="loading-animated-userphoto"></div>
        )}
        
        
        <div className="user-info-container">
          <h1>{auth?.currentUser?.displayName}</h1>
          <div className="btn-container">
            <Link to='/createblog'>&#43; Add blog</Link>
            <button onClick={signUserOut}>Logout</button>
          </div>
        </div>
      </div>

      <hr />

      <Dialog
        isOpen={isDialogBoxOpen}
        dialogContent={"Would you really like to delete this blog?"}
        btnOneText={"Cancel"}
        btnTwoText={"Confirm"}
        btnOneHandler={() => {
          console.log("clicked on cancel");
          setIsDialogBoxOpen(false);
          setBlogIdToDelete(null);
        }}
        btnTwoHandler={() => {
          console.log("Clicked on Confirm");
          setIsDialogBoxOpen(false);
          deleteBlog(blogIdToDelete);
        }}
      />

      {(isLoading) ? (
        <section className="blog-list">
          <div className="blog-card">
            <div className="loading-animated-title"></div>
            <div className="loading-animated-content"></div>
            <div className="loading-animated-name"></div>
          </div>
          <div className="blog-card">
            <div className="loading-animated-title"></div>
            <div className="loading-animated-content"></div>
            <div className="loading-animated-name"></div>
          </div>
          <div className="blog-card">
            <div className="loading-animated-title"></div>
            <div className="loading-animated-content"></div>
            <div className="loading-animated-name"></div>
          </div>
        </section>

      ) : null}

      <section className="blog-list">
        {blogList
          .map(blogListObj => {
            return (

              <div key={blogListObj.id} className="blog-card">

                <Link to={`/blog/${blogListObj.id}`}>
                  <div className="blog-title">
                    {blogListObj.title}
                  </div>
                </Link>

                <div className="shorten-blog-content pre-wrap">
                  {blogListObj.content}
                </div>

                <div className="blog-card-btn-container">
                  <button onClick={() => {
                    setIsDialogBoxOpen(true);
                    setBlogIdToDelete(blogListObj.id);
                  
                  }}>
                    Delete
                  </button>
                  <button onClick={() =>
                    updateBlog(
                      blogListObj.id,
                      blogListObj.title,
                      blogListObj.content
                    )}>
                    Update
                  </button>
                </div>
              </div>

            );
          })}
      </section>
    </>
  );
}

export default UserPage;


/*
<div className="blog-card-btn-container">
  <button onClick={() => deleteBlog(blogListObj.id)}>Delete</button>
  <button
    onClick={() =>
      updateBlog(
        blogListObj.id,
        blogListObj.title,
        blogListObj.content
      )}>
    Update
  </button>
</div>;
*/