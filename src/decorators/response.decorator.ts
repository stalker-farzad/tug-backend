import { SetMetadata } from '@nestjs/common';

export const ResponseClass = (responseClass: Function) => {
  return SetMetadata('responseClass', responseClass);
};
