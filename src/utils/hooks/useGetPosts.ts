import { gql, useQuery } from "@apollo/client";

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

export const useGetPosts = ({ page = 1 }: { page: number }) => {
  return useQuery(GET_POSTS, {
    variables: {
      //all these could be a custom hook in ./utils
      //variables should be parsed
      //page must be controled by user.
      //get only 10 results
      options: {
        paginate: {
          page,
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
};
