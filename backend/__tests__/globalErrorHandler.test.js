import express from 'express';
import request from 'supertest';
import { globalErrorHandler } from '../Middlewares/globalErrorHandler.js';
import { AppError } from '../utils/AppError.js';

describe('globalErrorHandler middleware', () => {
  let localApp;

  beforeEach(() => {
    // create a fresh express app for each test and attach the handler last
    localApp = express();
    // route that triggers AppError
    localApp.get('/__test-op-error', (req, res, next) => {
      return next(new AppError('Test operational error', 400));
    });
    // route that throws unexpected error
    localApp.get('/__test-unexpected', () => {
      throw new Error('unexpected crash');
    });
    // attach global error handler last
    localApp.use(globalErrorHandler);
  });

  test('returns operational error response when next(new AppError(...)) is called', async () => {
    const res = await request(localApp).get('/__test-op-error');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      status: 'fail',
      message: 'Test operational error'
    });
  });

  test('returns generic 500 for non-operational (unexpected) errors', async () => {
    const res = await request(localApp).get('/__test-unexpected');

    expect(res.status).toBe(500);
    // globalErrorHandler returns generic message for non-operational errors
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body).toHaveProperty('message', 'Something went very wrong!');
  });
});
