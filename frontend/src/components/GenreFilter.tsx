import React, { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// hard coded some genres here
const genres: string[] = [
  "All",
  "Adventure",
  "Comedy",
  "Crime",
  "Fantasy",
  "History",
  "Horror",
  "Mystery",
  "Paranormal",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Western",
];
interface GenreFilterProps {
  onSelect: (genre: string) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ onSelect }) => {
  const [selectedGenre, setSelectedGenre] = useState<string>("All");

  // this handler sends filter selected to SessionsPage to render filter
  const handleSelectFilter = (value: string | null) => {
    // if value is truthy send the filter type to parent
    // and prevent to spam onSelect handler
    if (value) {
      setSelectedGenre(value);
      onSelect(value); // sending what genre to filter
    } else {
      // if we want to refresh on re-select, but then could be spammed
    }
  };

  return (
    // ToggleGroup is like a bunch of Buttons together, when selected a button it will go to handleSelect
    <ToggleGroup
      className="bg-secondary-background text-[var(--filter-btn-text)]"
      type="single"
      value={selectedGenre}
      onValueChange={handleSelectFilter}
    >
      {/* map through hard coded genres */}
      {genres.map((genre) => (
        <ToggleGroupItem
          className="px-3 hover:bg-amber-600 rounded-lg not-data-[state=on]:hover:text-white data-[state=on]:text-white data-[state=on]:bg-amber-700 data-[state=on]:rounded-lg cursor-pointer"
          key={genre}
          value={genre}
        >
          {genre}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default GenreFilter;
