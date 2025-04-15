export class StandardResponse {
  statusCode: number;
  status: string;
  message: string;
  data?: any;
  constructor(message: string, data?: any, statusCode = 200) {
    this.statusCode = statusCode;
    this.status = "success";
    this.message = message;
    this.data = data;
  }
}
