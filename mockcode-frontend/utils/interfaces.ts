interface Competition {
  id: number;
  createdAt: string;
  updatedAt: string;
  isOpened: boolean;
  name: string;
  problemStatement: string;
  inputFiles: any[];
}
