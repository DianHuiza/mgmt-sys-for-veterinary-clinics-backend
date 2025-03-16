import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ZodPipe implements PipeTransform {
  constructor(private readonly schema) {}

  transform(value: any) {
    try {
      this.schema.parse(value);
      return value;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
