import { Request, Response } from 'express';
import { uuid } from '@src/core/utils/helpers';

import { queryValidation } from '@src/core/utils/validation';
import { NotFoundError, ValidationError } from '@src/core/utils/errors';
import { User } from './entities/user.model';
import { Job } from '@src/core/utils/job';
import { UserService } from './users.service';
import {
  BadRequest,
  Created,
  ErrorResponse,
  NotFound,
  Result,
} from '@src/core/utils/response';

const userService = new UserService(User);

export class UserController {
  // constructor(private userService = new UserService(User)){

  // }
  /**
   * Create User
   */
  async create(req: Request, res: Response) {
    const { data, error } = await userService.create(
      new Job({
        action: 'create',
        body: {
          uid: uuid(),
          ...req.body,
        },
      }),
    );

    if (error) {
      if (error instanceof ValidationError) {
        return BadRequest(res, {
          error,
          message: error.message,
        });
      }
      return ErrorResponse(res, {
        error,
        message: `${error.message || error}`,
      });
    }
    return Created(res, { data: { user: data }, message: 'Created' });
  }

  /**
   * Return all Users list
   */
  async getAll(req: Request, res: Response) {
    const { data, count, limit, offset, error } = await userService.findAll(
      new Job({
        action: 'findAll',
        options: {
          ...queryValidation(req.query),
        },
      }),
    );
    if (error) {
      return ErrorResponse(res, {
        error,
        message: `${error.message || error}`,
      });
    }
    return Result(res, {
      data: { user: data, count, limit, offset },
      message: 'Ok',
    });
  }

  /**
   * Return User Count
   */
  async getCount(req: Request, res: Response) {
    queryValidation(req.query);
    const { data, count, limit, offset, error } = await userService.getCount(
      new Job({
        action: 'getCount',
        options: {
          ...queryValidation(req.query),
        },
      }),
    );
    if (error) {
      return ErrorResponse(res, {
        error,
        message: `${error.message || error}`,
      });
    }
    return Result(res, {
      data: { user: data, count, limit, offset },
      message: 'Ok',
    });
  }

  /**
   * Return Users By Id
   */
  async getById(req: Request, res: Response) {
    const { data, error } = await userService.findById(
      new Job({
        action: 'findById',
        id: +req.params.id,
        options: {
          ...queryValidation(req.query),
        },
      }),
    );
    if (error) {
      if (error instanceof NotFoundError) {
        return NotFound(res, {
          error,
          message: `Record Not found`,
        });
      }
      return ErrorResponse(res, {
        error,
        message: `${error.message || error}`,
      });
    }
    return Result(res, {
      data: { user: data },
      message: 'Ok',
    });
  }

  /**
   * Return User with parameter
   */
  async getOne(req: Request, res: Response) {
    const { data, error } = await userService.findOne(
      new Job({
        action: 'findOne',
        options: {
          ...queryValidation(req.query),
        },
      }),
    );
    if (error) {
      if (error instanceof NotFoundError) {
        return NotFound(res, {
          error,
          message: `Record Not found`,
        });
      }
      return ErrorResponse(res, {
        error,
        message: `${error.message || error}`,
      });
    }
    return Result(res, {
      data: { user: data },
      message: 'Ok',
    });
  }

  /**
   * Update User
   */
  async update(req: Request, res: Response) {
    const { data, error } = await userService.update(
      new Job({
        action: 'update',
        id: +req.params.id,
        body: req.body,
      }),
    );
    if (error) {
      if (error instanceof NotFoundError) {
        return NotFound(res, {
          error,
          message: `Record Not found`,
        });
      }
      return ErrorResponse(res, {
        error,
        message: `${error.message || error}`,
      });
    }
    return Result(res, {
      data: { user: data },
      message: 'Updated',
    });
  }

  /**
   * Delete User
   */
  async deleteOne(req: Request, res: Response) {
    const { data, error } = await userService.delete(
      new Job({
        action: 'delete',
        id: +req.params.id,
        options: {
          ...queryValidation(req.query),
        },
      }),
    );
    if (error) {
      if (error instanceof NotFoundError) {
        return NotFound(res, {
          error,
          message: `Record Not found`,
        });
      }
      return ErrorResponse(res, {
        error,
        message: `${error.message || error}`,
      });
    }
    return Result(res, {
      data: { user: data },
      message: 'Deleted',
    });
  }
}
