export class ApiResponse {
  private success = true;
  private status = 200;
  private message?: string;
  private data?: any = null;
  private errors?: any = null;
  private stack?: string = null;

  static success(message = 'Operation Successful') {
    const obj = new ApiResponse();
    obj.setSuccess(true).setMessage(message).setStatus(200);
    return obj;
  }

  static error(message: string, status = 500) {
    const obj = new ApiResponse();
    obj.setSuccess(false).setMessage(message).setStatus(status);
    return obj;
  }

  setSuccess(value: boolean) {
    this.success = value;
    return this;
  }

  getStatus() {
    return this.status;
  }

  setStatus(value: number) {
    this.status = value;
    return this;
  }

  setMessage(value: string) {
    this.message = value;
    return this;
  }

  setErrors(value: any) {
    this.errors = value;
    return this;
  }

  setStack(value: any) {
    this.stack = value;
    return this;
  }

  setData(data: any) {
    this.data = data;
    return this;
  }
}
