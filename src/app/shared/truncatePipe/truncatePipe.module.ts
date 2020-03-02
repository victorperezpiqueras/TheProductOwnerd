import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from './truncatePipe';

@NgModule({
  declarations: [TruncatePipe],
  imports: [CommonModule],
  exports: [TruncatePipe]
})
export class TruncatePipeModule {}
