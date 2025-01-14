import HttpStatus from 'http-status-codes';
import { Response } from 'express';

/* 
  Utility function to wrap response data.
  Adds additional info to response data if required.
*/
const ResponseData = (data: any = {}) => ({ ...data });

/**
 * Generic function for sending HTTP responses.
 * @param res - response object
 * @param status - HTTP status code
 * @param data - response data (optional)
 * @returns JSON response with the given status and data
 */
const sendResponse = (res: Response, status: number, data: any = {}) => {
  return res.status(status).json(ResponseData(data));
};

/**
 * 200 - HTTP OK response
 * @param res - response object
 * @param data - response data (optional)
 * @returns HTTP OK response
 */
export const Result = (res: Response, data?: any) =>
  sendResponse(res, HttpStatus.OK, data);

/**
 * 201 - HTTP Created response
 * @param res - response object
 * @param data - response data (optional)
 * @returns HTTP Created response
 */
export const Created = (res: Response, data?: any) =>
  sendResponse(res, HttpStatus.CREATED, data);

/**
 * 400 - HTTP Bad Request response
 * @param res - response object
 * @param data - response error data (optional)
 * @returns HTTP Bad Request response
 */
export const BadRequest = (
  res: Response,
  data = { error: {}, message: 'Error' },
) => sendResponse(res, HttpStatus.BAD_REQUEST, data);

/**
 * 401 - HTTP Unauthorized response
 * @param res - response object
 * @param data - response error data (optional)
 * @returns HTTP Unauthorized response
 */
export const Unauthorized = (
  res: Response,
  data = { error: {}, message: 'Error' },
) => sendResponse(res, HttpStatus.UNAUTHORIZED, data);

/**
 * 403 - HTTP Forbidden response
 * @param res - response object
 * @param data - response error data (optional)
 * @returns HTTP Forbidden response
 */
export const Forbidden = (
  res: Response,
  data = { error: {}, message: 'Error' },
) => sendResponse(res, HttpStatus.FORBIDDEN, data);

/**
 * 404 - HTTP Not Found response
 * @param res - response object
 * @param data - response error data (optional)
 * @returns HTTP Not Found response
 */
export const NotFound = (
  res: Response,
  data = { error: {}, message: 'Not Found' },
) => sendResponse(res, HttpStatus.NOT_FOUND, data);

/**
 * 500 - HTTP Internal Server Error response
 * @param res - response object
 * @param data - response error data (optional)
 * @returns HTTP Internal Server Error response
 */
export const ErrorResponse = (
  res: Response,
  data = { error: {}, message: 'Error' },
) => sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, data);
