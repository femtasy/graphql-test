// import react-testing methods
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import { Main } from "./../App";
import gql from "graphql-tag";
const GET_POSTS = gql`
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
test("loads and displays header", async () => {
  const mocks = [
    {
      request: {
        query: GET_POSTS,
      },
      result: {
        data: {
          posts: {
            data: [],
          },
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={true}>
      <Main />
    </MockedProvider>
  );

  expect(await screen.findByText("Posts")).toBeInTheDocument();
});
