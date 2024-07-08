import React from "react";

export const AnimeStack = (props: AnimeStackProps) => {
  let accessToken;
  const user = localStorage.getItem("user");
  if (user) {
    accessToken = JSON.parse(user).access_token;
    console.log("Access Token:", accessToken);
  }
  return (
    <div className="flex-row p-4 m-6 rounded-md bg-gray-800 ">
      <h2 className="text-xl">Anime {props.type}</h2>
      <hr className="my-4" />
    </div>
  );
};

interface AnimeStackProps {
  type: string;
}
