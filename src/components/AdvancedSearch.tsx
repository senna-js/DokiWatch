import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
  MdOutlineIndeterminateCheckBox,
} from "react-icons/md";
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const Bullet = (props: BulletProps) => {
  const [bulletType, setBulletType] = useState<BulletType>(
    BulletType.indeterminate
  );
  const handleClick = () => {
    if (bulletType === BulletType.enabled) {
      setBulletType(BulletType.disabled);
      props.handleGenreSelection(props.genreIndex, -1);
    } else if (bulletType === BulletType.disabled) {
      setBulletType(BulletType.indeterminate);
      props.handleGenreSelection(props.genreIndex, 0);
    } else {
      setBulletType(BulletType.enabled);
      props.handleGenreSelection(props.genreIndex, 1);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex hover:cursor-pointer items-center gap-1"
    >
      {bulletType === BulletType.enabled && <MdOutlineCheckBox />}
      {bulletType === BulletType.indeterminate && (
        <MdOutlineCheckBoxOutlineBlank />
      )}
      {bulletType === BulletType.disabled && <MdOutlineIndeterminateCheckBox />}
      <p className="select-none">{props.text}</p>
    </div>
  );
};

export const AdvancedSearch = (props: AdvancedSearchProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchParams = useSearchParams()[0];

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchTerm("");
    }
  }, [searchParams]);

  return (
    <div className="bg-doki-light-grey backdrop-blur-lg rounded-[16px] mt-4">
      <div className="container rounded-lg flex flex-col gap-4 px-12 py-6">
        <h1 className="text-doki-purple text-start text-bold font-lato text-2xl sm:text-4xl ml-2">
          Filter
        </h1>
        <hr className="border border-doki-purple mb-2" />
        <TextField
          label="Search for anime"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          InputLabelProps={{
            style: { color: "white" },
          }}
          InputProps={{
            style: { color: "white" },
          }}
          style={{
            borderColor: "white",
            color: "white",
          }}
          classes={{
            root: "text-field-root",
          }}
          inputProps={{
            autoFocus: true,
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                props.handleSearch(searchTerm);
                setSearchTerm("");
              }
            },
          }}
        />
        <h1 className="text-doki-purple text-start text-bold font-lato text-2xl ml-2">
          Genres
        </h1>
        {/* <hr className="" /> */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-x-4 mb-2 text-doki-purple font-lato">
          {props.genres.map((genre, index) => (
            <Bullet
              key={genre}
              text={genre}
              genreIndex={index}
              handleGenreSelection={props.handleGenreSelection}
            />
          ))}
        </div>
        <div
          onClick={() => {
            props.handleSearch(searchTerm);
            setSearchTerm("");
          }}
          className="bg-doki-dark-grey text-xl sm:text-2xl text-center font-bold text-doki-purple rounded-[16px] p-2.5 font-lato cursor-pointer shadow-md hover:bg-doki-purple hover:text-doki-white hover:scale-105 transform transition duration-150 ease-in-out"
        >
          <div>
            <div className="flex items-center justify-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <span>Search</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

enum BulletType {
  enabled,
  disabled,
  indeterminate,
}

type BulletProps = {
  text: string;
  genreIndex: number;
  handleGenreSelection: (index: number, set: number) => void;
};

type AdvancedSearchProps = {
  genres: string[];
  handleGenreSelection: (index: number, set: number) => void;
  handleSearch: (searchTerm: string) => void;
};
