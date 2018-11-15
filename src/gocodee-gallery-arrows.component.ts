import { Component, Input, Output, EventEmitter, } from '@angular/core';

@Component({
    selector: 'gocodee-gallery-arrows',
    templateUrl: './gocodee-gallery-arrows.component.html',
    styleUrls: ['./gocodee-gallery-arrows.component.scss']
})
export class GocodeeGalleryArrowsComponent {
    @Input() prevDisabled: boolean;
    @Input() nextDisabled: boolean;
    @Input() arrowPrevIcon: string;
    @Input() arrowNextIcon: string;

    @Output() onPrevClick = new EventEmitter();
    @Output() onNextClick = new EventEmitter();

    handlePrevClick(): void {
        this.onPrevClick.emit();
    }

    handleNextClick(): void {
        this.onNextClick.emit();
    }
}
