import React from "react";
import GenreFilter from "../GenreFilter";

const OpenSessionsPage: React.FC = () => {
  // handler to change ProjectCard based on filter from GenreFilter
  const handleGenreFilter = (genre: string) => {
    console.log("I came from GenreFilter component: " + genre);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-primary-text'>
          Open Writing Sessions
        </h1>
        <p className='text-secondary-text mt-2'>
          Join an existing session or create your own.
        </p>
      </div>

      <GenreFilter onSelect={handleGenreFilter}></GenreFilter>

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

      {/* Create New Session Button - pretty sure Tanner has a Button component that can be used here */}

      <div className='mt-8 flex justify-center'>
        <button className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2'>
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M12 4v16m8-8H4'
            />
          </svg>
          Create New Session
        </button>
      </div>
    </div>
  );
};

export default OpenSessionsPage;
