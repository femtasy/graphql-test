import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

export const CREATE_POST = gql`
  mutation ($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      body
    }
  }
`;

export const useCreatePost = () => {
  const [mutate, { data, loading, error }] = useMutation(CREATE_POST);
  const createPost = ({
    title = "New post",
    body = "New post body description",
  }: {
    title: string;
    body: string;
  }) => {
    mutate({
      variables: {
        input: {
          title,
          body,
        },
      },
    });
  };
  return { createPost, data, loading, error };
};
