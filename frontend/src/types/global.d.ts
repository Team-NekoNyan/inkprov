// Global types/interfaces

export interface SessionCardData {
  id: string; // not sure if this will be a number or sting
  title: string;
  description: string;
  genre: string;
  currentContributors: string; // number or string
  maxContributors: string;
}

export interface ProjectCardData {
  id: string;
  title: string;
  description: string;
  genre: string;
  contributors: string[];
  dateCompleted: Date;
  // reacts: react[] extended feature
}
