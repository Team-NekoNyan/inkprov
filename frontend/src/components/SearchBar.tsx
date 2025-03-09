import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

const SearchBar: React.FC = () => {
  return (
    <div className='group flex items-center border-2 border-yellow-400 rounded-md overflow-hidden transition-all duration-200 focus-within:border-amber-500 focus-within:shadow-md w-60'>
      <span>
        <Search className='ml-2 h-5 w-5 text-amber-600' />
      </span>
      <Input
        className='border-none focus-visible:ring-0 w-full'
        type='text'
        placeholder='Search sessions...'
      ></Input>
    </div>
  );
};

export default SearchBar;
