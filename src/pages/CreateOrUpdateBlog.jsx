import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase-config";

function CreateOrUpdateBlog({ isAuth }) {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const blogsCollectionRef = collection(db, "blogs");

  const navigate = useNavigate();
  const { state } = useLocation();

  let createOrUpdateButtonContent = {
    clickHandler: createNewBlog,
    textContent: "Create Blog",
  };

  if (state) {
    createOrUpdateButtonContent = {
      clickHandler: updateBlog,
      textContent: "Update Blog",
    };
  }


  async function createNewBlog() {

    if(title.length === 0 || content.length === 0) return;
    
    await addDoc(blogsCollectionRef, {
      title: title,
      content: content,
      createdAt: serverTimestamp(),
      author: {
        name: auth.currentUser.displayName,
        id: auth.currentUser.uid
      }
    });

    navigate('/userpage');
  }

  async function updateBlog() {
    
    if(title.length === 0 || content.length === 0) return;
    
    if (state) {
      const blogDocumentId = state.id;
      const docRef = doc(db, "blogs", blogDocumentId);

      updateDoc(docRef, {
        title: title,
        content: content,
      })
        .then(() => {
          console.log("document updated successfully.");
          navigate(`../blog/${state.id}`);

        }).catch((error) => {
          console.log("Error updating document: ", error);
        });
    }
  }



  useEffect(() => {
    if (isAuth === false) {
      navigate('/', { replace: true });
    }

    if (state) {
      setTitle(state.title);
      setContent(state.content);
    }
  }, []);


  return (
    <>
      <h1 className="create-blog-form-title">
        {(state) ? "Update Blog" : "New Blog"}
      </h1>

      <form
        method="post"
        onSubmit={(e) => e.preventDefault()}
        className="create-blog-form"
      >
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            minLength="10"
            placeholder="min 10 characters"
          />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            name="content"
            id="content"
            cols="30"
            rows="10"
            value={content}
            wrap="hard"
            minLength="30"
            placeholder="min 30 characters"
            onChange={(e) => {

              setContent(e.target.value);
            }}
          />
        </div>

        <div className="create-or-update-form-btn-container">
          <button
            type="submit"
            onClick={createOrUpdateButtonContent.clickHandler}>
            {createOrUpdateButtonContent.textContent}
          </button>
          <button
            type="button"
            onClick={() => navigate('../userpage')}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

export default CreateOrUpdateBlog;