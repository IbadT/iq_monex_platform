import { GetAvailableSlotResponseDto } from '../dto/response/get-available-slot-response.dto';
import { SlotPackageResponseDto } from '../dto/response/slot-package-response.dto';
import { SlotPackageEntity } from '../entities/slot-package.entity';
import { UserSlotEntity } from '../entities/user-slot.entity';

export class SlotMapper {
  static availableSlotsListToResponse(
    availableSlots: UserSlotEntity[],
  ): GetAvailableSlotResponseDto[] {
    return availableSlots.map((slot) => {
      return new GetAvailableSlotResponseDto(
        slot.id,
        slot.userId,
        slot.slotIndex,
        slot.sourceType,
        slot.sourceId,
        slot.slotPackageId,
        slot.subscriptionId,
        slot.expiresAt,
        slot.listingSlot,
      );
    });
  }

  static slotPackageListToResponse = (
    slotPackages: SlotPackageEntity[],
  ): SlotPackageResponseDto[] => {
    return slotPackages.map(
      (pkg) =>
        new SlotPackageResponseDto(
          pkg.id,
          pkg.userId,
          pkg.slots,
          pkg.expiresAt,
          pkg.paymentId,
          pkg.isActive,
        ),
    );
  };
}
