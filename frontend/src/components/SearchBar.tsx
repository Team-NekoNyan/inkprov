import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  //handle onChange inputs of the search
  const handleSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  //useEffect when searchTerm state changes it will call onSearch after 400ms of no typing
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(searchTerm);
    }, 400);

    return () => clearTimeout(delayDebounce); // reset timeout
  }, [searchTerm, onSearch]);

  return (
    <div className='h-fit group flex items-center border-2 border-yellow-400 rounded-md overflow-hidden transition-all duration-200 focus-within:border-amber-500 focus-within:shadow-md w-60'>
      <span>
        <Search className='ml-2 h-5 w-5 text-amber-600' />
      </span>
      <Input
        className='border-none focus-visible:ring-0 w-full'
        type='text'
        placeholder='Search sessions...'
        value={searchTerm}
        onChange={handleSearchOnChange}
      ></Input>
    </div>
  );
};

export default SearchBar;
