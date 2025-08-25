import { MySQLException } from './mysql.exception';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(MySQLException)
export class MySQLExceptionFilter implements ExceptionFilter {
  catch(exception: MySQLException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse = {
      statusCode: status,
      message: exception.message,
      error: 'Internal Server Error',
    };
    
    response.status(status).json(errorResponse);
  }
}