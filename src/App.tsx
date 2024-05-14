import { useState } from "react";

import "./App.css";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useQuery,
  useMutation,
} from "@apollo/client";

import { Post } from "./__generated__/graphql";

import { gql } from "@apollo/client";

//get post
const GET_POSTS = gql`
  query Posts($options: PageQueryOptions) {
    posts(options: $options) {
      data {
        id
        title
        body
        user {
          id
          name
          email
        }
      }
    }
  }
`;

//create post
const CREATE_POST = gql`
  mutation ($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      body
    }
  }
`;

//update post
const UPDATE_POST = gql`
  mutation ($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      body
    }
  }
`;

const client = new ApolloClient({
  uri: "https://graphqlzero.almansi.me/api",
  cache: new InMemoryCache(),
});

type Post = {
  id: number;
  title: string;
  body: string;
};

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
  const { loading, error, data } = useQuery(GET_POSTS, {
    variables: {
      //all these could be a custom hook in ./utils
      //variables should be parsed
      //page must be controled by user.
      //get only 10 results
      options: {
        paginate: {
          page: 1,
          limit: 10,
        },
        //sort desc order by id
        sort: {
          field: "id",
          order: "DESC",
        },
      },
    },
  });

  const [
    createPost,
    {
      data: create_post_response,
      loading: create_post_loading,
      error: create_post_error,
    },
  ] = useMutation(CREATE_POST);

  const [
    updatePost,
    {
      //data: update_post_response,
      loading: update_post_loading,
      error: update_post_error,
    },
  ] = useMutation(UPDATE_POST, {
    onCompleted: () => {
      setShowUpdateSuccess(true);
      setTimeout(() => {
        setShowUpdateSuccess(false);
      }, 4000); // Display the message for 4 seconds
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  // if (update_post_error) alert("Error: couldn't update post. Try again later");
  // if (update_post_response?.updatePost) alert("Post successfully updated ✅");

  return (
    <div className="flex flex-col h-screen">
      <header className="h-16 bg-header p-4">
        <h2 className="text-dark-body text-lg">Posts</h2>
      </header>
      <main className="flex-grow overflow-auto flex-col-reverse bg-body">
        <div className="px-4 py-4">
          {update_post_error && "Error: couldn't update post. Try again later"}
          {showUpdateSuccess && (
            <div className="bg-[#D1FFBD] rounded-md px-2 py-1 mt-4">
              <p className="text-dark-body text-sm m-0">
                Post successfully updated ✅
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
              onClick={() => {
                //should be a function appart.
                createPost({
                  variables: {
                    input: {
                      title: "A Very Captivating Post Title",
                      body: "Some interesting content.",
                    },
                  },
                });
              }}
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
                //should be a function appart.
                updatePost({
                  variables: {
                    id: "1",
                    input: {
                      body: "Some interesting content.",
                    },
                  },
                });
              }}
            >
              Update post
            </button>
          </div>
          <div>
            <button
              className="bg-white text-dark-body text-sm px-4 py-2 border-light-body border-2 border-solid rounded-xl"
              onClick={() => {
                console.log("Delete");
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
