export interface Competition {
  id: number;
  createdAt: string;
  updatedAt: string;
  isOpened: boolean;
  name: string;
  problemStatement: string;
  inputFiles: string[];
}

export interface Solution {
  inputFile: string;
  outputFile: string;
  score: number;
  errorMessage: string | null;
}
export interface Solutions {
  id: number;
  createdAt: string;
  totalScore: number;
  solutions: Solution[];
}

export interface LeaderboardEntry {
  id: number;
  userId: number;
  submissionScore: number;
  email: string;
  firstName: string;
  lastName: string;
}
