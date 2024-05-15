import { useState } from "react";

import "./App.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import { Post } from "./__generated__/graphql";

import { useGetPosts } from "./utils/hooks/useGetPosts";
import { useCreatePost } from "./utils/hooks/useCreatePost";
import { useUpdatePost } from "./utils/hooks/useUpdatePost";
import { useDeletePost } from "./utils/hooks/useDeletePost";

const client = new ApolloClient({
  uri: "https://graphqlzero.almansi.me/api",
  cache: new InMemoryCache(),
});

export const PostItem = (post: Post) => (
  <div className="bg-white rounded-md px-2 py-1 mt-4">
    <h2>{post.title}</h2>
    <p className="text-dark-body text-sm m-0">{post.body}</p>
  </div>
);

const NewPostItem = (post: Post) => (
  <div key={post.id} className="bg-secondary rounded-md px-2 py-1 mt-4">
    <h2>{post.title}</h2>
    <p className="text-dark-body text-sm m-0">{post.body}</p>
  </div>
);

export const Main = () => {
  const [showUpdateSuccess, setShowUpdateSuccess] = useState<boolean>(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState<boolean>(false);

  //get post with pagination, pagination should be dynamic and controlled by the user
  const { loading, error, data } = useGetPosts({ page: 1 });

  //create a new post call
  const {
    createPost,
    data: create_post_response,
    loading: create_post_loading,
    error: create_post_error,
  } = useCreatePost();

  //update post call
  const {
    updatePost,
    loading: update_post_loading,
    error: update_post_error,
  } = useUpdatePost({
    onCompleted: () => {
      setShowUpdateSuccess(true);
      setTimeout(() => {
        setShowUpdateSuccess(false);
      }, 4000); // Display the message for 4 seconds
    },
  });

  //delete post call
  const {
    deletePost,
    loading: delete_post_loading,
    error: delete_post_error,
  } = useDeletePost({
    onCompleted: () => {
      setShowDeleteSuccess(true);
      setTimeout(() => {
        setShowDeleteSuccess(false);
      }, 4000); // Display the message for 4 seconds
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div className="flex flex-col h-screen">
      <header className="h-16 bg-header p-4">
        <h2 className="text-dark-body text-lg">Posts</h2>
      </header>
      <main className="flex-grow overflow-auto flex-col-reverse bg-body">
        <div className="px-4 py-4">
          {update_post_error && "Error: couldn't update post. Try again later"}
          {delete_post_error && "Error: couldn't delete post. Try again later"}
          {showUpdateSuccess && (
            <div className="bg-[#D1FFBD] rounded-md px-2 py-1 mt-4">
              <p className="text-dark-body text-sm m-0">
                Post successfully updated ✅
              </p>
            </div>
          )}

          {showDeleteSuccess && (
            <div className="bg-[#D1FFBD] rounded-md px-2 py-1 mt-4">
              <p className="text-dark-body text-sm m-0">
                Post successfully deleted ✅
              </p>
            </div>
          )}

          {create_post_error //display created post if there's no error and is not loading
            ? "Error: couldn't create new post"
            : !create_post_loading &&
              create_post_response?.createPost && (
                <NewPostItem {...create_post_response.createPost} />
              )}
          {data.posts.data.map((post: Post) => (
            //improve: each element should have a unique key, id works but could be a repeated value.
            <PostItem key={post.id} {...post} />
          ))}
        </div>
      </main>
      <footer className="h-40 bg-header">
        <div className="px-2 py-4 flex flex-col gap-2">
          <div>
            <button
              //disable button if there's a petition to create a new post already running.
              disabled={create_post_loading}
              className={`bg-white text-dark-body text-sm px-4 py-2 border-light-body border-2 border-solid rounded-xl
              ${create_post_loading && "opacity-30"}`}
              onClick={() =>
                createPost({
                  title: "A Very Captivating Post Title",
                  body: "Some interesting content.",
                })
              }
            >
              Create a new post
            </button>
          </div>
          <div>
            <button
              disabled={update_post_loading}
              className={`bg-white text-dark-body text-sm px-4 py-2 border-light-body border-2 border-solid rounded-xl
              ${update_post_loading && "opacity-30"}`}
              onClick={() => {
                updatePost({ id: 1, body: "Some updated content." });
              }}
            >
              Update post
            </button>
          </div>
          <div>
            <button
              disabled={delete_post_loading}
              className={`bg-white text-dark-body text-sm px-4 py-2 border-light-body border-2 border-solid rounded-xl
               ${delete_post_loading && "opacity-30"}`}
              onClick={() => {
                deletePost({ id: 1 });
              }}
            >
              Delete post
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <div className="container sm mx-auto">
          <Main />
        </div>
      </ApolloProvider>
    </>
  );
}

export default App;
