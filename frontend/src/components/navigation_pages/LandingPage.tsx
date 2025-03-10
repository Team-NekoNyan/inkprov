import React from "react";
import { Button } from "@/components/ui/button";
import { Feather, BookOpen, Users } from "lucide-react";
import groupWritingImg from "../../assets/group-writing.png";

const LandingPage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="flex flex-col items-center">
        <header>
          <h1 className="text-6xl font-bold mt-8 mb-8 w-xl text-primary-text">
            Write Together, Create Together
          </h1>
          <p className="text-lg mb-8 text-secondary-text">
            Join a community of writers and collaborate on stories, poems, and
            more in real-time.
          </p>
        </header>
        <section className="flex gap-4 mb-8">
          <Button
            className="bg-primary-button hover:bg-primary-button-hover cursor-pointer"
            variant="default"
            onClick={() => window.location.href = "/login"}
          >
            Start Writing
          </Button>
          <Button
            className="bg-secondary-button text-secondary-text hover:bg-secondary-button-hover border border-primary-border cursor-pointer"
            variant="default"
            onClick={() => window.location.href = "/sessions"}
          >
            Explore Sessions
          </Button>
        </section>
      </section>
      {/* Flow Steps Section */}
      <section
        className="relative flex flex-col items-center bg-accent text-primary-text
  before:absolute before:bottom-0 before:left- before:-translate-x-1/2 before:w-screen before:h-px before:bg-accent 
  after:absolute after:inset-y-0 after:left-1/2 after:-translate-x-1/2 after:w-screen after:-z-10 after:bg-accent"
      >
        <h2 className="text-3xl font-bold mt-9 mb-9">How Inkprov Works</h2>
        <section className="flex gap-4 mb-8">
          {/* Join a Session */}
          <article className="flex flex-col items-center gap-4 mb-8 w-md">
            <div className="rounded-full bg-tertiary-background p-4">
              <Users />
            </div>
            <p className="text-lg font-bold">Join a Session</p>
            <p className="text-md">
              Find an open writing session that matches your interests or create
              your own.
            </p>
          </article>
          {/* Write Together */}
          <article className="flex flex-col items-center gap-4 mb-8">
            <div className="rounded-full bg-tertiary-background p-4">
              <Feather />
            </div>
            <p className="text-lg font-bold">Write Together</p>
            <p className="text-md">
              Collaborate in real-time with other writers to create something
              beautiful.
            </p>
          </article>
          {/* Share & Discover */}
          <article className="flex flex-col items-center gap-4 mb-8">
            <div className="rounded-full bg-tertiary-background p-4">
              <BookOpen />
            </div>
            <p className="text-lg font-bold">Share & Discover</p>
            <p className="text-md">
              Publish your collaborative works and explore creations from other
              writers.
            </p>
          </article>
        </section>
      </section>
      {/* Bottom Hero Section */}
      <section className="flex justify-between text-left mb-10">
        {/* Feature Description */}
        <article>
          <h2 className="text-3xl font-bold mt-9 mb-9 text-primary-text">
            A Cozy Space for Creative Minds
          </h2>
          <p className="text-lg mb-8 text-secondary-text w-lg">
            Inkprov provides a warm, inviting environment that feels like
            writing in your favorite reading nook. Our platform is designed to
            inspire creativity and foster collaboration.
          </p>
          <ul className="list-disc list-inside marker:text-amber-500">
            <li className="text-secondary-text">
              Real-time collaborative writing
            </li>
            <li className="text-secondary-text">
              Writing prompts when you need inspiration
            </li>
            <li className="text-secondary-text">
              Genre-based sessions and filtering
            </li>
            <li className="text-secondary-text">
              Community feedback and reactions
            </li>
          </ul>
        </article>
        {/* Image */}
        <div className="relative w-96 h-56 mt-10">
          {/* Styled Borders */}
          <div className="absolute -inset-4 rounded-lg bg-tertiary-background rotate-2"></div>
          <div className="relative w-full h-full overflow-hidden rounded-lg border-8 border-white bg-white shadow-lg flex items-center justify-center">
            {/* Background image */}
            <div className="absolute inset-0 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${groupWritingImg})` }}></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
