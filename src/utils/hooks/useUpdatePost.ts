import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

interface UpdatePostOptions {
    onCompleted?: (data: unknown) => void;
}

const UPDATE_POST = gql`
  mutation ($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      body
    }
  }
`;

export const useUpdatePost = (options: UpdatePostOptions = {}) => {
  const [mutate, { data, loading, error }] = useMutation(UPDATE_POST, {
    onCompleted: options.onCompleted
  });
  const updatePost = ({
    id,
    body,
  }: {
    id: number;
    body: string;
  }) => {
    mutate({
      variables: {
        id,
        input: {
          body,
        },
      },
    });
  };
  return { updatePost, data, loading, error };
};
