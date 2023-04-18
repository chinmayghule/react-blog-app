import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase-config";

function Blog({ isAuth }) {

  const { id } = useParams();
  let useEffectIgnore = false;

  const [blogTitle, setBlogTitle] = useState(null);
  const [blogContent, setBlogContent] = useState(null);
  const [blogAuthor, setBlogAuthor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);



  async function getDocumentById(documentId) {
    const documentRef = doc(db, "blogs", documentId);
    const documentSnapshot = await getDoc(documentRef);

    if (documentSnapshot.exists()) {
      const data = documentSnapshot.data();
      return { id: documentId, ...data };

    } else {
      return null;
    }
  }


  useEffect(() => {
    async function fetchData() {
      const blogData = await getDocumentById(id);

      setBlogTitle(blogData?.title);
      setBlogContent(blogData?.content);
      setBlogAuthor(blogData?.author?.name);

      if (blogTitle && blogContent && blogAuthor) {
        setIsLoading(false);
      }
    }

    if (useEffectIgnore === false) {
      fetchData();
    }

    return () => {
      useEffectIgnore = true;
    };

  }, [blogTitle, blogContent, blogAuthor]);


  return (
    <>
      {(isLoading) ? (
        <div className="blog-container">
          <div className="loading-animated-title"></div>
          <div className="loading-animated-content"></div>
          <div className="loading-animated-name"></div>
        </div>

      ) : (
        <div className="blog-container">
          <h1>{blogTitle}</h1>
          <p>by {blogAuthor}</p>
          <p className="pre-wrap blog-content">{blogContent}</p>
        </div>
      )}
    </>
  );
}

export default Blog;