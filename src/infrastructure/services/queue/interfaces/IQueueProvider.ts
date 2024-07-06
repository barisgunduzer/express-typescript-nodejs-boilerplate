export interface IQueueProvider {
  setJobName(jobName: string): this;
  setJobOptions(jobOptions: any): this;
  handle(job: any): Promise<any> | any;
  dispatch(): void;
  onCompleted(job: any): any;
  onFailed(job: any): any;
}
