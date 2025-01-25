import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

/**
 * Custom Logger Service to log messages.
 */
@Injectable()
export class LoggerService implements NestLoggerService {
    log(message: string) {
        console.log(`LOG: ${message}`);
    }

    error(message: string, trace: string) {
        console.error(`ERROR: ${message}`, trace);
    }

    warn(message: string) {
        console.warn(`WARN: ${message}`);
    }

    debug(message: string) {
        console.debug(`DEBUG: ${message}`);
    }

    verbose(message: string) {
        console.info(`VERBOSE: ${message}`);
    }
}
