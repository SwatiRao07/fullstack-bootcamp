export interface EmailJob {
  id: string;
  to: string;
  subject: string;
  body: string;
  createdAt: Date;
}

export const inMemoryQueue: EmailJob[] = [];

export const pushToQueue = (job: EmailJob) => {
  inMemoryQueue.push(job);
};

export const popFromQueue = (): EmailJob | undefined => {
  return inMemoryQueue.shift();
};
