import { Module } from '@nestjs/common';
import { ViewTrackerService } from './view-tracker.service';

@Module({
  providers: [ViewTrackerService],
  exports: [ViewTrackerService],
})
export class ViewTrackerModule {}
