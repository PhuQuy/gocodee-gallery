import { Component, Input, Output, EventEmitter, HostListener,  ElementRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { SafeResourceUrl, DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { GocodeeGalleryHelperService } from './gocodee-gallery-helper.service';
import { GocodeeGalleryOrderedImage } from './gocodee-gallery-ordered-image.model';
import { GocodeeGalleryAnimation } from './gocodee-gallery-animation.model';
import { GocodeeGalleryAction } from './gocodee-gallery-action.model';

@Component({
    selector: 'gocodee-gallery-image',
    templateUrl: './gocodee-gallery-image.component.html',
    styleUrls: ['./gocodee-gallery-image.component.scss']
})
export class GocodeeGalleryImageComponent implements OnInit, OnChanges {
    @Input() images: GocodeeGalleryOrderedImage[];
    @Input() clickable: boolean;
    @Input() selectedIndex: number;
    @Input() arrows: boolean;
    @Input() arrowsAutoHide: boolean;
    @Input() swipe: boolean;
    @Input() animation: string;
    @Input() size: string;
    @Input() arrowPrevIcon: string;
    @Input() arrowNextIcon: string;
    @Input() autoPlay: boolean;
    @Input() autoPlayInterval: number;
    @Input() autoPlayPauseOnHover: boolean;
    @Input() infinityMove: boolean;
    @Input() lazyLoading: boolean;
    @Input() actions: GocodeeGalleryAction[];
    @Input() descriptions: string[];
    @Input() showDescription: boolean;

    @Output() onClick = new EventEmitter();
    @Output() onActiveChange = new EventEmitter();

    canChangeImage = true;

    private timer;

    constructor(private sanitization: DomSanitizer,
        private elementRef: ElementRef, private helperService: GocodeeGalleryHelperService) {}

    ngOnInit(): void {
        if (this.arrows && this.arrowsAutoHide) {
            this.arrows = false;
        }

        if (this.autoPlay) {
            this.startAutoPlay();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef, 'image', () => this.showNext(), () => this.showPrev());
        }
    }

    @HostListener('mouseenter') onMouseEnter() {
        if (this.arrowsAutoHide && !this.arrows) {
            this.arrows = true;
        }

        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.stopAutoPlay();
        }
    }

    @HostListener('mouseleave') onMouseLeave() {
        if (this.arrowsAutoHide && this.arrows) {
            this.arrows = false;
        }

        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.startAutoPlay();
        }
    }

    reset(index: number): void {
        this.selectedIndex = index;
    }

    getImages(): GocodeeGalleryOrderedImage[] {
        if (this.lazyLoading) {
            let indexes = [this.selectedIndex];
            let prevIndex = this.selectedIndex - 1;

            if (prevIndex === -1 && this.infinityMove) {
                indexes.push(this.images.length - 1)
            } else if (prevIndex >= 0) {
                indexes.push(prevIndex);
            }

            let nextIndex = this.selectedIndex + 1;

            if (nextIndex == this.images.length && this.infinityMove) {
                indexes.push(0);
            } else if (nextIndex < this.images.length) {
                indexes.push(nextIndex);
            }

            return this.images.filter((img, i) => indexes.indexOf(i) != -1);
        } else {
            return this.images;
        }
    }

    startAutoPlay(): void {
        this.stopAutoPlay();

        this.timer = setInterval(() => {
            if (!this.showNext()) {
                this.selectedIndex = -1;
                this.showNext();
            }
        }, this.autoPlayInterval);
    }

    stopAutoPlay() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    handleClick(event: Event, index: number): void {
        if (this.clickable) {
            this.onClick.emit(index);

            event.stopPropagation();
            event.preventDefault();
        }
    }

    showNext(): boolean {
        if (this.canShowNext() && this.canChangeImage) {
            this.selectedIndex++;

            if (this.selectedIndex === this.images.length) {
                this.selectedIndex = 0;
            }

            this.onActiveChange.emit(this.selectedIndex);
            this.setChangeTimeout();

            return true;
        } else {
            return false;
        }
    }

    showPrev(): void {
        if (this.canShowPrev() && this.canChangeImage) {
            this.selectedIndex--;

            if (this.selectedIndex < 0) {
                this.selectedIndex = this.images.length - 1;
            }

            this.onActiveChange.emit(this.selectedIndex);
            this.setChangeTimeout();
        }
    }

    setChangeTimeout() {
        this.canChangeImage = false;
        let timeout = 1000;

        if (this.animation === GocodeeGalleryAnimation.Slide
            || this.animation === GocodeeGalleryAnimation.Fade) {
                timeout = 500;
        }

        setTimeout(() => {
            this.canChangeImage = true;
        }, timeout);
    }

    canShowNext(): boolean {
        if (this.images) {
            return this.infinityMove || this.selectedIndex < this.images.length - 1
                ? true : false;
        } else {
            return false;
        }
    }

    canShowPrev(): boolean {
        if (this.images) {
            return this.infinityMove || this.selectedIndex > 0 ? true : false;
        } else {
            return false;
        }
    }

    getSafeUrl(image: string): SafeStyle {
        return this.sanitization.bypassSecurityTrustStyle(this.helperService.getBackgroundUrl(image));
    }
}
