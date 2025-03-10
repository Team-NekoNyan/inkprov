import React, { useCallback } from "react";
import GenreFilter from "../GenreFilter";
import SearchBar from "../SearchBar";
import SessionCard from "../SessionCard";
import { Button } from "@/components/ui/button";

const OpenSessionsPage: React.FC = () => {
  const sessionsHardCodedData = [
    {
      id: "1",
      title: "Creative Writing",
      description:
        "Join our weekly creative writing workshop. All skill levels welcome!",
      genre: "Adventure",
      currentContributors: "2",
      maxContributors: "4",
    },
    {
      id: "2",
      title: "Poetry Collaboration",
      description:
        "Collaborative poetry writing session. Share and create together.",
      genre: "Horror",
      currentContributors: "1",
      maxContributors: "3",
    },
    {
      id: "3",
      title: "Story Development",
      description: "Work on character development and plot structure together.",
      genre: "Romance",
      currentContributors: "3",
      maxContributors: "5",
    },
  ];

  // handler to change SessionCard based on filter from GenreFilter
  const handleGenreFilter = (genre: string = "All") => {
    console.log("I came from GenreFilter component: " + genre);
  };

  // When create Session btn is clicked go to create new Session page
  const handleCreateSession = () => {
    console.log("Going to page: CreateSession");
  };

  // handle search , useCallback prevents handleSearh to render on every render of this page,
  // but will render on refresh with empty string, could cause bug
  const handleSearch = useCallback((query: string) => {
    console.log("Search: " + query);
    if (query === "") return; // => TODO return all cards

    // TO DO replace this with SessionCard with Title == query
  }, []);

  return (
    <main className='container mx-auto px-4 py-8'>
      <header className='flex justify-between'>
        <div className='mb-8 text-left'>
          <h1 className='text-3xl font-bold text-primary-text'>
            Open Writing Sessions
          </h1>
          <p className='text-secondary-text mt-2'>
            Join an existing session or create your own.
          </p>
        </div>

        <div className='flex gap-3'>
          <SearchBar onSearch={handleSearch} />
          <Button
            className='bg-amber-800 hover:bg-amber-700'
            onClick={handleCreateSession}
          >
            + Create Session
          </Button>
        </div>
      </header>

      <nav className='my-6'>
        <GenreFilter onSelect={handleGenreFilter}></GenreFilter>
      </nav>

      {/* More placeholder content - to be replaced with actual session list */}
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {sessionsHardCodedData.map((session) => (
          <SessionCard key={session.id} sessionData={session} />
        ))}
      </section>
    </main>
  );
};

export default OpenSessionsPage;
