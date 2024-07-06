import IORedis from 'ioredis';
import { Job, JobsOptions, Processor, Queue, QueueEvents, Worker } from 'bullmq';
import { queueConfig } from '@base/config/queue';
import { AppException } from '@api/exceptions/Application/AppException';
import { IQueueJob } from '@base/infrastructure/services/queue/interfaces/IQueueJob';

export abstract class QueueJobBase implements IQueueJob {
  protected readonly _data: any;
  private _queue: Queue;
  private _queueEvents: QueueEvents;
  private _jobName: string = this.constructor.name;
  private _jobOptions: JobsOptions;

  /**
   * Creates a new job instance.
   */
  public constructor(data: any) {
    this._data = data;
  }

  public setJobName(jobName: string): this {
    this._jobName = jobName;
    return this;
  }

  /**
   * Set job options
   * @param jobOptions
   * @returns this
   */
  public setOptions(jobOptions: JobsOptions): this {
    this._jobOptions = jobOptions;
    return this;
  }

  /**
   * Dispatch job to the queue
   */
  public async dispatch() {
    await this.process();
  }

  /**
   * Executes the job.
   */
  protected abstract handle(job: Job): Promise<Processor<any, any, string>> | any;

  /**
   * On job completed do.
   */
  protected abstract onCompleted(job: Job): any;

  /**
   * On job failed do.
   */
  protected abstract onFailed(job: Job): any;

  /**
   * Create new redis connection
   */
  private _createConnection(): IORedis {
    try {
      return new IORedis({ ...queueConfig.redis });
    } catch (e) {
      throw new AppException('Connection problem. Please try again later. Code: 001');
    }
  }

  /**
   * Process the job
   */
  private async process() {
    const connection = this._createConnection();
    this._queue = new Queue(this._jobName);

    await this._queue.add(this._jobName, this._data, this._jobOptions);

    const worker = new Worker(this._jobName, this.handle, { connection });

    worker.on('completed', this.onCompleted);
    worker.on('failed', this.onFailed);
  }
}
