import { useEffect, useState } from "react";
import "./App.css";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useMutation,
  useQuery,
} from "@apollo/client";

import { Post } from "./__generated__/graphql";

import { gql } from "@apollo/client";

//Get Posts Query

export const GET_POSTS = gql`
  query Posts($options:PageQueryOptions  ) {
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

//Create Post Mutation

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput! ) {
    createPost(input: $input) {
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
`;

//Update Post Mutation

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID! , $input: UpdatePostInput! ) {
    updatePost(id: $id, input: $input) {
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
`;

//Delete Post Mutation

export const DELETE_POST = gql`
  mutation DeletePost($id: ID! ) {
    deletePost(id: $id)
  }
`;

const client = new ApolloClient({
  uri: "https://graphqlzero.almansi.me/api",
  cache: new InMemoryCache(),
});

//Post Type with aditional values like IsNew: to see if its a new element isSelected: to verify if the item is the selected item
type PostProps = {
  id: number;
  title: string;
  body: string;
  isNew: boolean;
  isSelected: boolean;
};
//Create Post Type
type CreatePostProps = {
  title: string;
  body: string;
};
export const PostItem = (props: { post: PostProps, key: number, onClick: () => void }) => (
  //use props.post.isNew to display the right post UI
  props.post.isNew ? <NewPostItem {...props} /> :
    <div onClick={() => props.onClick()} key={props.key} className={props.post.isSelected ? "bg-white rounded-md px-2 py-1 mt-4 border-2 border-rose" : "bg-white rounded-md px-2 py-1 mt-4"}>
      <h2>{props.post.title}</h2>
      <p className="text-dark-body text-sm m-0">{props.post.body}</p>
    </div>
);
const CreateUpdatePostModal = (props: { post?: PostProps, submit: (newPost: CreatePostProps) => void, isUpdatingPost: boolean, close: () => void }) => {
  //the modal for creating or updating a post
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  useEffect(() => {
    //verify if its an update or a create request
    if (props.post && props.isUpdatingPost) {
      setNewPost({ title: props.post.title, body: props.post.body })
    }
  }, [props.post, props.isUpdatingPost])
  const newPostTitleChange = (val: string) => {
    //update the state title value
    setNewPost({ ...newPost, title: val })
  }

  const newPostBodyChange = (val: string) => {
    //update the state body value
    setNewPost({ ...newPost, body: val })
  }
  return (
    <div className="flex absolute flex-col justify-center w-full h-full bg-modal left-0 top-0">
      <div className="self-center mx-auto w-[50%] h-[50%]  rounded-xl bg-white flex flex-col p-4 gap-3 relative">
        <h3 className="w-[80%] self-center text-[20px]">
          Create Post
        </h3>
        <label className="w-[80%] self-center">
          Title
        </label>
        <input placeholder="title..." className="w-[80%] self-center border-2 p-2 rounded-md" value={newPost.title} onChange={(event) => newPostTitleChange(event.target.value)} />
        <label className="w-[80%] self-center">
          Content
        </label>
        <textarea cols={20} placeholder="Content..." className="w-[80%] self-center border-2 p-2 rounded-md" value={newPost.body} onChange={(event) => newPostBodyChange(event.target.value)} />
        <div className="absolute right-4 bottom-4 flex flex-row w-[20%] justify-between">
          <button className="rounded border-2  p-2 " onClick={() => props.close()} > cancel </button>
          <button className="rounded border-2  p-2 bg-[#0b57d0] text-white" onClick={() => props.submit(newPost)} > Send </button>
        </div>
      </div>
    </div>
  )
}

const NewPostItem = (props: { post: PostProps, key: number, onClick: () => void }) => (
  <div key={props.post.id} className="bg-secondary rounded-md px-2 py-1 mt-4">
    <h2>{props.post.title}</h2>
    <p className="text-dark-body text-sm m-0">{props.post.body}</p>
  </div>
);

export const Main = () => {

  //State used to  store posts and apply changes in front-end
  const [posts, setPosts] = useState<PostProps[]>([]);

  //State used to verify if we are updating a post
  const [isUpdatingPost, setIsUpdatingPost] = useState(false);
  //State used to display the create or update Post modal
  const [showUpdateCreateModal, setShowUpdateCreateModal] = useState(false);

  //Hook to use createPost mutation
  const [createPost] = useMutation(CREATE_POST);

  //Hook to use updatePost mutation
  const [updatePost] = useMutation(UPDATE_POST);

  //Hook to use deletePost mutation
  const [deletePost] = useMutation(DELETE_POST);

  //Hook to use Get posts Query
  const { loading, error, data } = useQuery(GET_POSTS, {

    //Variables for get posts query like the limit per page and the sort field and order
    variables: { options: { slice: { limit: 10 }, sort: { field: "id", order: "DESC" } } },

    //The function that executes once the query is successfull
    onCompleted: () => {
      setPosts(data?.posts?.data.map((post: Post) => {
        return { ...post, isSelected: false, isNew: false }
      }))
    }
  });

  //The function that executes from the modal to send to GQL the new Data for update or create
  const createOrUpdatePost = (newPost: CreatePostProps) => {

    //Update case
    if (isUpdatingPost) {

      const selectedPost = posts.find((post) => post.isSelected);
      if (selectedPost) {
        updatePost({ variables: { id: selectedPost?.id, input: newPost } }).then((result) => {
          if (result.data.updatePost) {
            setShowUpdateCreateModal(false);
            setIsUpdatingPost(false);
            const arrayOfPosts = [...posts];
            const updateIndex = arrayOfPosts.indexOf(selectedPost);
            arrayOfPosts[updateIndex] = result.data.updatePost;
            setPosts(arrayOfPosts)
          }

        })
      }

    }
    //Create case
    else {
      createPost({ variables: { input: newPost } }).then((result) => {
        if (result.data.createPost) {
          setShowUpdateCreateModal(false);
          const arrayOfPosts = [...posts];
          arrayOfPosts.unshift({ ...result.data.createPost, isNew: true });
          setPosts(arrayOfPosts)

        }

      })
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div className="flex flex-col h-screen">
      <header className="h-16 bg-header p-4">
        <h2 className="text-dark-body text-lg">Posts</h2>
      </header>
      <main className="flex-grow overflow-auto flex-col-reverse bg-body">
        <div className="px-4 py-4">
          {posts.map((post: PostProps, index: number) => (
            <PostItem onClick={() => {

              //Function for post selection used in Delete and update post functions
              const postsArray = posts.map((post: PostProps) => {
                return { ...post, isSelected: false }
              });
              postsArray[index].isSelected = !postsArray[index].isSelected;
              setPosts(postsArray);
            }} key={index} post={post} />
          ))}
        </div>
      </main>
      <footer className="h-40 bg-header">
        <div className="px-2 py-4 flex flex-col gap-2">
          <div>
            <button
              className="bg-white text-dark-body text-sm px-4 py-2 border-light-body border-2 border-solid rounded-xl"
              onClick={() => {

                //Function for post Creation it toggles the modal and set isUpdating to false
                setIsUpdatingPost(false);
                setShowUpdateCreateModal(true);

              }}
            >
              Create a new post
            </button>
          </div>
          <div>
            <button
              className="bg-white text-dark-body text-sm px-4 py-2 border-light-body border-2 border-solid rounded-xl"
              onClick={() => {

                //Function for post Update it toggles the modal and set isUpdating to true and see if there is any selected items else it does nothing
                const selectedPost = posts.find((post) => post.isSelected);
                if (selectedPost) {
                  console.log(selectedPost)
                  setIsUpdatingPost(true);
                  setShowUpdateCreateModal(true);
                }
              }}
            >
              Update post
            </button>
          </div>
          <div>
            <button
              className="bg-white text-dark-body text-sm px-4 py-2 border-light-body border-2 border-solid rounded-xl"
              onClick={() => {

                //Function for post deletion it see if there is any selected items else it does nothing
                const selectedPost = posts.find((post) => post.isSelected);
                if (selectedPost) {
                  deletePost({ variables: { id: selectedPost.id } }).then(result => {
                    if (result.data.deletePost) {
                      const postsArray = [...posts];
                      const idx = postsArray.indexOf(selectedPost);
                      postsArray.splice(idx, 1);
                      setPosts(postsArray);
                    }
                  });

                }
              }}
            >
              Delete post
            </button>
          </div>
        </div>
      </footer>
      {/* CreateUpdatePostModal component call if the state of showUpdateCreateModal is false then it does not display the modal */}
      {showUpdateCreateModal ? <CreateUpdatePostModal close={() => setShowUpdateCreateModal(false)} submit={(val: CreatePostProps) => { createOrUpdatePost(val) }} post={posts.find((post) => post.isSelected)} isUpdatingPost={isUpdatingPost} /> : <></>}
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
