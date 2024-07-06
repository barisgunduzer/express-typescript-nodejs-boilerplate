export interface IQueueJob {
  setJobName(jobName: string): this;
  setOptions(jobOptions: any): this;
  dispatch(): Promise<void>;
}
