export default interface HttpError {
  httpCode: number;
  message: string;
  error?: unknown;
}
