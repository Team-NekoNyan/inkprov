import React from "react";
import GenreFilter from "../GenreFilter";
import SearchBar from "../SearchBar";
import { Button } from "@/components/ui/button";

const OpenSessionsPage: React.FC = () => {
  // handler to change ProjectCard based on filter from GenreFilter
  const handleGenreFilter = (genre: string) => {
    console.log("I came from GenreFilter component: " + genre);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <header className='mb-8 text-left'>
        <h1 className='text-3xl font-bold text-primary-text'>
          Open Writing Sessions
        </h1>
        <p className='text-secondary-text mt-2'>
          Join an existing session or create your own.
        </p>
      </header>

      <div className=''>
        <SearchBar />
        <Button className='bg-amber-800'>+ Create Session</Button>
      </div>

      <div className='my-6'>
        <GenreFilter onSelect={handleGenreFilter}></GenreFilter>
      </div>

      {/* More placeholder content - to be replaced with actual session list */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='bg-background rounded-lg p-6 shadow-sm border border-primary-border'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-lg font-semibold text-primary-text'>
              Creative Writing Workshop
            </h3>
            <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded'>
              Open
            </span>
          </div>
          <p className='text-secondary-text mb-4'>
            Join our weekly creative writing workshop. All skill levels welcome!
          </p>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-secondary-text'>
              2/8 participants
            </span>
            <button className='bg-primary-button hover:bg-primary-button-hover text-white px-4 py-2 rounded'>
              Join Session
            </button>
          </div>
        </div>

        <div className='bg-background rounded-lg p-6 shadow-sm border border-primary-border'>
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
        </div>
      </div>
    </div>
  );
};

export default OpenSessionsPage;
