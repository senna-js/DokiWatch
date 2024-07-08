import React, { useEffect, useState } from "react";
import { start } from "repl";

export const AnimeStack = (props: AnimeStackProps) => {
  const [animeData, setAnimeData] = useState<
    | null
    | {
        image: string;
        mediaID: string;
        malID: string;
        titleEng: string;
        titleRom: string;
        //startDate: string;
        //endDate: string;
        Progress: string;
      }[]
  >(null); // State to hold the data
  let accessToken;
  //const user = localStorage.getItem("user");
  ///////////////////////////////
  let username = JSON.parse(
    localStorage.getItem("user") as string
  ).access_token;
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  accessToken = hashParams.get("access_token");
  // accessToken = "hi";
  // let username = "itzKirito";
  useEffect(() => {
    if (accessToken) {
      // Assuming you have a function to make the POST request
      fetchYourData(accessToken).then((data) => {
        return setAnimeData(data); // Update state with the data received
      });
    }
  }, [accessToken]); // This effect depends on accessToken

  // Function to fetch data using accessToken
  async function fetchYourData(token: string) {
    const query = `
  query($name: String) {
    MediaListCollection(userName: $name, type: ANIME, status: CURRENT) {
    lists {
      entries {
        mediaId
        progress
        status
        media {
          idMal
          title {
            romaji
            english
            native
            userPreferred
          }
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
          coverImage {
            large
          }
        }
      }
      name
      isCustomList
      isSplitCompletedList
      status
    }
  }
  }`;
    const variables = {
      name: username,
    };
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjBkY2ZkY2U2ZGRjYWE1NWZlMWRkNDBhMTU3MDQyOTllOTY4OTViNjNjZWUzNDczZjU5ODE2NTJjZTkzN2Q4OGYxNGRhYjM0OTlmMzZhYjgzIn0.eyJhdWQiOiIxOTc1MyIsImp0aSI6IjBkY2ZkY2U2ZGRjYWE1NWZlMWRkNDBhMTU3MDQyOTllOTY4OTViNjNjZWUzNDczZjU5ODE2NTJjZTkzN2Q4OGYxNGRhYjM0OTlmMzZhYjgzIiwiaWF0IjoxNzIwNDY3NDg4LCJuYmYiOjE3MjA0Njc0ODgsImV4cCI6MTc1MjAwMzQ4OCwic3ViIjoiNjAzMDIyOCIsInNjb3BlcyI6W119.BiMzpOnIQyM0m3WulzoLxAfqGg49qIkcu87AnGgzrzQh2pov4Pxn-sOBhWxuixJwmS2bwbXp7jjvklbnl5rv14fT4vJQz85oY2ZMqllHelS5CUHrrnXDKn7sqEKxotzKe53ifiwe7qhxfGCOJYYT1ec2VwrBS_W8whRClAlLrs0HI7EiCoLbUAC9bjA3hk9q4xi6Dj9FlCGyLE5mJz3DnmATCMbDegXqzc3wOe8JxLfQ039wBAN2qsHPNui4eaR6e0GyDeOW1XBaAd_Mu0VWaMYqeC5dx5WkvdmCusR_4dMRKLDfCFpjSEOXalCbYIEduWFWGX1jLCZCWyOvS758w-hZN1JaVmqcIRtxGI9hW8UVFx1sdWAi1se49lINf9-WQt-OKK0xRDNofwDgbcMPoKQQH6zvttyNb9retKpcIlxQ8CJGudz5hvNkjfRT5NcycMl7lGRtlMZVpPAsBo1xB6gp7-UEAarsfeyOnn4IBw2xFfssvo1b54LMuoFAhRNhOOVhT69ZcUNhQ2GtWfdi9dUt_XMtZaSey6uwWYjB_GMfqI-07QvHvHXuGYN1MWL9FgN6VTvCFG6Hw13USUZuiFOopk3mYMhjNvJ4VnAPxingHkejiBaCnGWtKVv7HqydUYy2Q4HXzdj1P0Nef6jEthp-w2pJUJ0JObgKf2Qq6O0`,
        Authorization: `Bearer ${token}`, // Include the access token in the Authorization header
      },
      body: JSON.stringify({
        // Your request body if needed
        query,
        variables,
      }),
    });
    const data = await response.json();
    //console.log("final data", data);
    let finalreturndata: {
      image: any;
      mediaID: any;
      malID: any;
      titleEng: any;
      titleRom: any;
      // Uncomment and adjust if needed
      // startDate: element.media.startDate,
      // endDate: element.media.endDate,
      Progress: any;
    }[] = []; // Initialize as an array

    data.data.MediaListCollection.lists[0].entries.forEach((element: any) => {
      // For each element, create a new object with the required data
      const elementData = {
        image: element.media.coverImage.large,
        mediaID: element.mediaId,
        malID: element.media.idMal,
        titleEng: element.media.title.english,
        titleRom: element.media.title.romaji,
        // Uncomment and adjust if needed
        // startDate: element.media.startDate,
        // endDate: element.media.endDate,
        Progress: element.progress,
      };

      // Push the new object into the finalreturndata array
      finalreturndata.push(elementData);
    });

    console.log("final data", finalreturndata);
    return finalreturndata;
  }
  // {animeData &&
  //         // Assuming animeData is an array. Adjust according to the actual structure.
  //         animeData.map((anime) => (
  //           <div key={anime.id}>
  //             {/* Populate with your data */}
  //             <h3>{anime.title}</h3>
  //             {/* More anime details */}
  //           </div>
  //         ))}
  return (
    <div className="flex-row p-4 m-6 rounded-md bg-gray-800 ">
      <h2 className="text-xl">Anime {props.type}</h2>
      <hr className="my-4" />
      {animeData &&
        // Assuming animeData is an array. Adjust according to the actual structure.
        animeData.map((anime) => (
          <div key={anime.mediaID}>
            {/* Populate with your data */}
            <h3>{anime.titleEng}</h3>
            <h3>{anime.titleRom}</h3>
            <img src={anime.image} alt={anime.titleEng} />
            {/* More anime details */}
          </div>
        ))}
    </div>
  );
};
interface AnimeStackProps {
  type: string;
}
