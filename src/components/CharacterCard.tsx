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
      className="w-full bg-doki-dark-grey 
    rounded-[22px] m-2 p-2 gap-5"
    >
      <div
        className="flex flex-row lg:flex-col xl:flex-row items-center justify-between
      gap-7 md:gap-2"
      >
        <div className="flex flex-row items-center justify-items-start">
          {/* Character Image */}
          <div className="flex-shrink-0">
            <a href={characterUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={characterImage}
                alt={characterName}
                className="w-[51px] rounded-[12px] object-cover aspect-square"
              />
            </a>
          </div>

          {/* Character Details */}
          <div className="flex-col justify-center items-center lg:px-4 px-2 max-w-full">
            <h2 className="text-[10px] lg:text-[14px] font-lato text-doki-white break-words">
              {characterName}
            </h2>
            <p className="opacity-65 text-doki-purple text-[10px] lg:text-[10px] font-lato break-words">
              {role}
            </p>
          </div>
        </div>

        <div className="flex flex-row items-center justify-end gap-1">
          {/* Staff Details */}
          <p className="text-[10px] lg:text-[14px] font-lato">{staffName}</p>
          {staffName && (
            <div className="lg:hidden xl:block flex-shrink-0">
              <a
                href={staffUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={staffImage || ""}
                  alt={staffName}
                  className="w-[51px] rounded-[12px] 
              object-cover aspect-square"
                />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
