import "./App.css";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useQuery,
} from "@apollo/client";

import { Post } from "./__generated__/graphql";

import { gql } from "@apollo/client";

export const GET_POSTS = gql`
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
  const { loading, error, data } = useQuery(GET_POSTS, {variables: {
    //all these could be a custom hook in ./utils
    //variables should be parsed
    //page must be controled by user.
    //get only 10 results
    "options": {
      "paginate": {
        "page": 1,
        "limit": 10
      },
      //sort desc order by id
      "sort": {
        "field": "id",
        "order": "DESC"
      }
    }
  }});
  console.log(data)

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div className="flex flex-col h-screen">
      <header className="h-16 bg-header p-4">
        <h2 className="text-dark-body text-lg">Posts</h2>
      </header>
      <main className="flex-grow overflow-auto flex-col-reverse bg-body">
        <div className="px-4 py-4">
          {data.posts.data.map((post: PostProps) => (
            <PostItem {...post} />
          ))}
        </div>
      </main>
      <footer className="h-40 bg-header">
        <div className="px-2 py-4 flex flex-col gap-2">
          <div>
            <button
              className="bg-white text-dark-body text-sm px-4 py-2 border-light-body border-2 border-solid rounded-xl"
              onClick={() => {
                console.log("Create");
              }}
            >
              Create a new post
            </button>
          </div>
          <div>
            <button
              className="bg-white text-dark-body text-sm px-4 py-2 border-light-body border-2 border-solid rounded-xl"
              onClick={() => {
                console.log("Update");
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
