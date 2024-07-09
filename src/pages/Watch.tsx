import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";

interface Source {
  url: string;
  quality: string;
}

export const Watch: React.FC = () => {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [settingsVisible, setSettingsVisible] = useState(false);
  let params = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_CONSUMET_API_ENDPOINT}watch/${params.id}`
        );
        const data = await response.json();
        if (data && data.sources && data.sources.length > 0) {
          setSources(data.sources);
          setStreamUrl(data.sources[0].url); // Default to the first source
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchData();
  }, [params.id]);

  const handleQualityChange = (url: string) => {
    setStreamUrl(url);
    setSettingsVisible(false); // Hide settings menu after selection
  };

  return (
    <div>
      <div style={{ position: "relative" }}>
        {streamUrl ? (
          <ReactPlayer
            url={streamUrl}
            playing={true}
            controls={true}
            width="100%"
            height="500px"
          />
        ) : (
          <p>Loading...</p>
        )}
        <button
          onClick={() => setSettingsVisible(!settingsVisible)}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: "1",
            padding: "8px",
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Settings
        </button>
        {settingsVisible && (
          <div
            style={{
              position: "absolute",
              top: "40px",
              right: "10px",
              backgroundColor: "black", // Set background color to black
              border: "1px solid #ccc",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              zIndex: "2",
            }}
          >
            {sources.map((source, index) => (
              <div
                key={index}
                onClick={() => handleQualityChange(source.url)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  backgroundColor: streamUrl === source.url ? "Black" : "Black",
                }}
              >
                {source.quality}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
