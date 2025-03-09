import React, { useState } from "react";
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
  const [selectedGenre, setSelectedGenre] = useState("All");

  // this handler sends filter selected to SessionsPage to render filter
  // also this handler prevents
  const handleSelect = (value: string | null) => {
    // if value is truthy send the filter type to parent
    if (value) {
      console.log(value);
      setSelectedGenre(value); // preventing from deselecting when re-clicking same filter
    } else {
      // this code is for if re-selected it would do the following (might need if we want refresh on re-select) if not delete this
      // if this is deleted , it could be better as is it wont cause refresh on spam select on a button
      console.log(selectedGenre);
    }
  };

  return (
    // ToggleGroup is like a bunch of Buttons together, when select button it will go to handleSelect
    <ToggleGroup
      className='bg-secondary-background text-[var(--filter-btn-text)]'
      type='single'
      value={selectedGenre}
      onValueChange={handleSelect}
    >
      {/* map through hard coded genres */}
      {genres.map((genre) => (
        <ToggleGroupItem
          className='px-3 hover:bg-amber-600 rounded-lg not-data-[state=on]:hover:text-white data-[state=on]:text-white data-[state=on]:bg-amber-700 data-[state=on]:rounded-lg '
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
