import React from "react";

interface CharacterProps {
  characterName: string;
  role: string;
  characterImage: string;
  characterUrl: string;
  staffName: string | null;
  staffImage: string | null;
  staffUrl: string | null;
  mal_id: number;
}

const CharacterCard: React.FC<CharacterProps> = ({
  characterName,
  role,
  characterImage,
  characterUrl,
  staffName,
  staffImage,
  staffUrl,
}) => {
  return (
    <div
      className="flex flex-row items-center w-full bg-doki-dark-grey 
    rounded-[22px] m-2 p-2 "
    >
      {/* Character Image */}
      <div className="w-1/3">
        <a href={characterUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={characterImage}
            alt={characterName}
            className="rounded-[22px] object-cover w-full border-2 border-doki-purple"
          />
        </a>
      </div>

      {/* Character Details */}
      <div className="flex-grow px-6">
        <h2 className="text-2xl font-bold">{characterName}</h2>
        <p className="text-doki-white italic">{role}</p>
      </div>

      {/* Staff Details */}
      {staffName && (
        <div className="flex flex-col items-center w-1/4">
          <a href={staffUrl || "#"} target="_blank" rel="noopener noreferrer">
            <img
              src={staffImage || ""}
              alt={staffName}
              className="rounded-full w-24 h-24 object-cover"
            />
          </a>
          <p className="text-lg font-semibold mt-2">{staffName}</p>
        </div>
      )}
    </div>
  );
};

export default CharacterCard;
