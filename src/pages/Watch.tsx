import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export const Watch = () => {
  const [streamUrl, setStreamUrl] = useState(null);
  let params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          import.meta.env.VITE_CONSUMET_API_ENDPOINT + "servers/" + params.id;
        console.log("URL:", url);
        const response = await fetch(url);
        console.log("Data:", response);
        const data = await response.json();

        if (data && data.length > 0) {
          setStreamUrl(data[0].url);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchData();
  }, [params.id]);

  return (
    <div>
      {streamUrl ? (
        <iframe
          src={streamUrl}
          width="100%"
          height="500px"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
