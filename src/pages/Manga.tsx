import { useEffect } from 'react';


// Define the shape of the query response
interface MediaTitle {
    romaji: string;
    english: string;
    native: string;
}

interface Media {
    id: number;
    title: MediaTitle;
}

interface QueryResponse {
    data: {
        Media: Media;
    };
}

// Define our query as a multi-line string
var query = `
{
  Page(page: 1, perPage: 54) {
    media(sort: POPULARITY_DESC, type: MANGA) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        extraLarge
        color
      }
      description
      chapters
      averageScore
      genres
      volumes
      status
      startDate {
        year
        month
        day
      }
    }
  }
}
`;

// Define our query variables and values that will be used in the query request
const variables = {
    id: 30001
};

// Define the config we'll need for our API request
const url = 'https://graphql.anilist.co';
const options: RequestInit = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    body: JSON.stringify({
        query: query,
        variables: variables
    })
};

// Function to handle the API response
const handleResponse = (response: Response): Promise<QueryResponse> => {
    return response.json().then((json) => {
        return response.ok ? json : Promise.reject(json);
    });
};

// Function to handle the data
const handleData = (data: QueryResponse) => {
    console.log(data);
};

// Function to handle errors
const handleError = (error: any) => {
    alert('Error, check console');
    console.error(error);
};

const Manga = () => {
    useEffect(() => {
        // Make the HTTP API request
        fetch(url, options)
            .then(handleResponse)
            .then(handleData)
            .catch(handleError);
    }, []);

    return <div className='flex flex-col justify-center items-center font-anime font-bold mt-20 text-4xl cursor-pointer'>Check console for data</div>;
};

export default Manga;