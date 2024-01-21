// import react-testing methods
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import { Main, GET_POSTS } from "./../App";

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
