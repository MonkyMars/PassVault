import { Credential } from "./types";

type FetchResponse = {
  credentials: Credential[];
  errors: string[];
};

export const FetchCredentials = async (): Promise<FetchResponse> => {
  return fetch("http://localhost:8200/api/v1/credentials", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return { credentials: await response.json(), errors: [] };
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
      return { credentials: [], errors: [error.message] };
    });
};

export const SendCredentials = async (
  credentials: Credential
): Promise<FetchResponse> => {
  return fetch("http://localhost:8200/api/v1/credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
};
