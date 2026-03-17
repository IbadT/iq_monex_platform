import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ListingStatus } from '../enums/listing-status.enum';

@ValidatorConstraint({ name: 'conditionalRequired', async: false })
export class ConditionalRequiredConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [requiredStatus] = args.constraints;
    const object = args.object as any;
    const status = object.status || ListingStatus.DRAFT;

    // Поле обязательно только для указанных статусов
    if (requiredStatus.includes(status)) {
      return value !== undefined && value !== null && value !== '';
    }

    return true; // Для других статусов поле опционально
  }

  defaultMessage(args: ValidationArguments) {
    const [requiredStatus] = args.constraints;
    const property = args.property;
    
    return `${property} is required for status: ${requiredStatus.join(', ')}`;
  }
}

export function ConditionalRequired(requiredStatus: ListingStatus[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    const options: ValidationOptions = validationOptions || {};
    
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: options,
      constraints: [requiredStatus],
      validator: ConditionalRequiredConstraint,
    });
  };
}
