import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { GocodeeGalleryActionComponent } from './gocodee-gallery-action.component';
import { GocodeeGalleryArrowsComponent } from './gocodee-gallery-arrows.component';
import { ImageViewComponent } from './image-view.component';
import { GocodeeGalleryImageComponent } from './gocodee-gallery-image.component';
import { GocodeeGalleryThumbnailsComponent } from './gocodee-gallery-thumbnails.component';
import { GocodeeGalleryPreviewComponent } from './gocodee-gallery-preview.component';
import { GocodeeGalleryComponent } from './gocodee-gallery.component';

export * from './image-view.component';
export * from './gocodee-gallery.component';
export * from './gocodee-gallery-action.component';
export * from './gocodee-gallery-thumbnails.component';
export * from './gocodee-gallery-preview.component';
export * from './gocodee-gallery-arrows.component';
export * from './gocodee-gallery-options.model';
export * from './gocodee-gallery-image.model';
export * from './gocodee-gallery-animation.model';
export * from './gocodee-gallery-helper.service';
export * from './gocodee-gallery-image-size.model';
export * from './gocodee-gallery-layout.model';
export * from './gocodee-gallery-order.model';
export * from './gocodee-gallery-image.component';
export * from './gocodee-gallery-ordered-image.model';
export * from './gocodee-gallery-action.model';

export class CustomHammerConfig extends HammerGestureConfig  {
    overrides = <any>{
        'pinch': { enable: false },
        'rotate': { enable: false }
    };
}

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ImageViewComponent,
        GocodeeGalleryActionComponent,
        GocodeeGalleryArrowsComponent,
        GocodeeGalleryThumbnailsComponent,
        GocodeeGalleryPreviewComponent,
        GocodeeGalleryImageComponent,
        GocodeeGalleryComponent
    ],
    exports: [
        GocodeeGalleryComponent
    ],
    providers: [
        { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }
    ]
})
export class GocodeeGalleryModule {}
