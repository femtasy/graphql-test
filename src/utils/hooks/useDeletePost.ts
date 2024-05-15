import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

interface DeletePostOptions {
  onCompleted?: (data: unknown) => void;
}

const DELETE_POST = gql`
  mutation ($id: ID!) {
    deletePost(id: $id)
  }
`;

export const useDeletePost = (options: DeletePostOptions = {}) => {
  const [mutate, { data, loading, error }] = useMutation(DELETE_POST, {
    onCompleted: options.onCompleted,
  });
  const deletePost = ({ id }: { id: number }) => {
    mutate({
      variables: {
        id,
      },
    });
  };
  return { deletePost, data, loading, error };
};
