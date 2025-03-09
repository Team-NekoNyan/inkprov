import { Input } from "@/components/ui/input";
import React from "react";

const SearchBar: React.FC = () => {
  return (
    <Input className='' type='text' placeholder='Search sessions...'></Input>
  );
};

export default SearchBar;
