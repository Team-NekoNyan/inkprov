import React, { useState, useCallback } from "react";
import GenreFilter from "../GenreFilter";
import SearchBar from "../SearchBar";
import ProjectCard from "../ProjectCard";
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

  // handler to change ProjectCard based on filter from GenreFilter
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

    // TO DO replace this with ProjectCard with Title == query
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
          <ProjectCard key={session.id} projectData={session} />
        ))}
      </section>
      {/* <div className='bg-background rounded-lg p-6 shadow-sm border border-primary-border'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-lg font-semibold text-primary-text'>
              Poetry Collaboration
            </h3>
            <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded'>
              Open
            </span>
          </div>
          <p className='text-secondary-text mb-4'>
            Collaborative poetry writing session. Share and create together.
          </p>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-secondary-text'>
              3/6 participants
            </span>
            <button className='bg-primary-button hover:bg-primary-button-hover text-white px-4 py-2 rounded'>
              Join Session
            </button>
          </div>
        </div>

        <div className='bg-background rounded-lg p-6 shadow-sm border border-primary-border'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-lg font-semibold text-primary-text'>
              Story Development
            </h3>
            <span className='bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded'>
              Starting Soon
            </span>
          </div>
          <p className='text-secondary-text mb-4'>
            Work on character development and plot structure together.
          </p>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-secondary-text'>
              1/5 participants
            </span>
            <button className='bg-primary-button hover:bg-primary-button-hover text-white px-4 py-2 rounded'>
              Join Session
            </button>
          </div>
        </div> */}
    </main>
  );
};

export default OpenSessionsPage;
