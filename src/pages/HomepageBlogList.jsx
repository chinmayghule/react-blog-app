import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase-config";

function HomepageBlogList() {

  const [blogList, setBlogList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const blogsCollectionRef = collection(db, "blogs");

  let useEffectIgnore = false;


  async function getBlogs() {

    const q = query(
      blogsCollectionRef,
      orderBy('createdAt', 'desc'));

    onSnapshot(q, (querySnapshot) => {
      const extractedQuerySnapshot =
        querySnapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id }));

      setBlogList(extractedQuerySnapshot);
      setIsLoading(false);
    });
  };

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
        {blogList.map(blogListObj => {
          return (

            <div key={blogListObj.id} className="blog-card">

              <Link to={`blog/${blogListObj.id}`}>
                <div className="blog-title">
                  {blogListObj.title}
                </div>
              </Link>

              <div className="shorten-blog-content pre-wrap">
                {blogListObj.content}
              </div>

              <div>by {blogListObj.author.name}</div>
            </div>

          );
        })}
      </section>
    </>
  );

}

export default HomepageBlogList;