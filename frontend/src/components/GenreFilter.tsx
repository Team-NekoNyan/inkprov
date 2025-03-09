import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// hard coded some genres here
const genres: string[] = [
  "All",
  "Adventure",
  "Horror",
  "Romance",
  "Mystery",
  "Sci-Fi",
  "Fantasy",
  "Comedy",
];

const GenreFilter: React.FC = () => {
  return (
    <ToggleGroup type='single' defaultValue='All'>
      {genres.map((genre) => (
        <ToggleGroupItem value={genre}>{genre}</ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default GenreFilter;
