import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UpdateUserActivityDto } from '../dto/update-user-activity.dto';

@ValidatorConstraint({ async: false })
export class MaxNonDeleteActivitiesConstraint implements ValidatorConstraintInterface {
  validate(activities: UpdateUserActivityDto[], args: ValidationArguments) {
    if (!Array.isArray(activities)) {
      return false;
    }

    const maxSize = args.constraints[0];
    const nonDeleteCount = activities.filter(
      (activity) => activity.action !== 'DELETE'
    ).length;

    return nonDeleteCount <= maxSize;
  }

  defaultMessage(args: ValidationArguments) {
    const maxSize = args.constraints[0];
    return `Максимум ${maxSize} видов деятельности (не считая удаляемых)`;
  }
}

export function MaxNonDeleteActivities(
  maxSize: number,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions || {},
      constraints: [maxSize],
      validator: MaxNonDeleteActivitiesConstraint,
    });
  };
}
