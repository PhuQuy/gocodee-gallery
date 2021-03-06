import { Component, Input, Output, EventEmitter, HostListener, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { DomSanitizer, SafeStyle, SafeResourceUrl } from '@angular/platform-browser';

import { GocodeeGalleryHelperService } from './gocodee-gallery-helper.service';
import { GocodeeGalleryOrder } from './gocodee-gallery-order.model';
import { GocodeeGalleryAction } from './gocodee-gallery-action.model';

@Component({
    selector: 'gocodee-gallery-thumbnails',
    templateUrl: './gocodee-gallery-thumbnails.component.html',
    styleUrls: ['./gocodee-gallery-thumbnails.component.scss']
})
export class GocodeeGalleryThumbnailsComponent implements OnChanges {

    thumbnailsLeft: string;
    thumbnailsMarginLeft: string;
    mouseenter: boolean;
    remainingCountValue: number;

    minStopIndex = 0;

    @Input() images: string[] | SafeResourceUrl[];
    @Input() links: string[];
    @Input() labels: string[];
    @Input() linkTarget: string;
    @Input() columns: number;
    @Input() rows: number;
    @Input() arrows: boolean;
    @Input() arrowsAutoHide: boolean;
    @Input() margin: number;
    @Input() selectedIndex: number;
    @Input() clickable: boolean;
    @Input() swipe: boolean;
    @Input() size: string;
    @Input() arrowPrevIcon: string;
    @Input() arrowNextIcon: string;
    @Input() moveSize: number;
    @Input() order: number;
    @Input() remainingCount: boolean;
    @Input() lazyLoading: boolean;
    @Input() actions: GocodeeGalleryAction[];

    @Output() onActiveChange = new EventEmitter();

    private index = 0;

    constructor(private sanitization: DomSanitizer, private elementRef: ElementRef,
        private helperService: GocodeeGalleryHelperService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedIndex']) {
            this.validateIndex();
        }

        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef,
            'thumbnails', () => this.moveRight(), () => this.moveLeft());
        }

        if (this.images) {
            this.remainingCountValue = this.images.length - (this.rows * this.columns);
        }
    }

    @HostListener('mouseenter') onMouseEnter() {
        this.mouseenter = true;
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.mouseenter = false;
    }

    reset(index: number): void {
        this.selectedIndex = index;
        this.setDefaultPosition();

        this.index = 0;
        this.validateIndex();
    }

    getImages(): string[] | SafeResourceUrl[] {
        if (this.remainingCount) {
            return this.images.slice(0, this.rows * this.columns);
        } else if (this.lazyLoading && this.order != GocodeeGalleryOrder.Row) {
            let stopIndex = this.index + this.columns + this.moveSize;

            if (this.rows > 1 && this.order === GocodeeGalleryOrder.Column) {
                stopIndex = stopIndex * this.rows;
            }

            if (stopIndex <= this.minStopIndex) {
                stopIndex = this.minStopIndex;
            } else {
                this.minStopIndex = stopIndex;
            }

            return this.images.slice(0, stopIndex);
        } else {
            return this.images;
        }
    }

    handleClick(event: Event, index: number): void {
        if (!this.hasLinks()) {
            this.selectedIndex = index;
            this.onActiveChange.emit(index);

            event.stopPropagation();
            event.preventDefault();
        }
    }

    hasLinks(): boolean {
        if (this.links && this.links.length) return true;
    }

    moveRight(): void {
        if (this.canMoveRight()) {
            this.index += this.moveSize;
            let maxIndex = this.getMaxIndex() - this.columns;

            if (this.index > maxIndex) {
                this.index = maxIndex;
            }

            this.setThumbnailsPosition();
        }
    }

    moveLeft(): void {
        if (this.canMoveLeft()) {
            this.index -= this.moveSize;

            if (this.index < 0) {
                this.index = 0;
            }

            this.setThumbnailsPosition();
        }
    }

    canMoveRight(): boolean {
        return this.index + this.columns < this.getMaxIndex() ? true : false;
    }

    canMoveLeft(): boolean {
        return this.index !== 0 ? true : false;
    }

    getThumbnailLeft(index: number): SafeStyle {
        let calculatedIndex;

        if (this.order === GocodeeGalleryOrder.Column) {
            calculatedIndex = Math.floor(index / this.rows);
        } else {
            calculatedIndex = index % Math.ceil(this.images.length / this.rows);
        }

        return this.getThumbnailPosition(calculatedIndex, this.columns);
    }

    getThumbnailTop(index: number): SafeStyle {
        let calculatedIndex;

        if (this.order === GocodeeGalleryOrder.Column) {
            calculatedIndex = index % this.rows;
        } else {
            calculatedIndex = Math.floor(index / Math.ceil(this.images.length / this.rows));
        }

        return this.getThumbnailPosition(calculatedIndex, this.rows);
    }

    getThumbnailWidth(): SafeStyle {
        return this.getThumbnailDimension(this.columns);
    }

    getThumbnailHeight(): SafeStyle {
        return this.getThumbnailDimension(this.rows);
    }

    setThumbnailsPosition(): void {
        this.thumbnailsLeft = - ((100 / this.columns) * this.index) + '%'

        this.thumbnailsMarginLeft = - ((this.margin - (((this.columns - 1)
        * this.margin) / this.columns)) * this.index) + 'px';
    }

    setDefaultPosition(): void {
        this.thumbnailsLeft = '0px';
        this.thumbnailsMarginLeft = '0px';
    }

    canShowArrows(): boolean {
        if (this.remainingCount) {
            return false;
        } else if (this.arrows && this.images && this.images.length > this.getVisibleCount()
            && (!this.arrowsAutoHide || this.mouseenter)) {
            return true;
        } else {
            return false;
        }
    }

    validateIndex(): void {
        let newIndex;

        if (this.order === GocodeeGalleryOrder.Column) {
            newIndex = Math.floor(this.selectedIndex / this.rows);
        } else {
            newIndex = this.selectedIndex % Math.ceil(this.images.length / this.rows);
        }

        if (this.remainingCount) {
            newIndex = 0;
        }

        if (newIndex < this.index || newIndex >= this.index + this.columns) {
            const maxIndex = this.getMaxIndex() - this.columns;
            this.index = newIndex > maxIndex ? maxIndex : newIndex;

            this.setThumbnailsPosition();
        }
    }

    getSafeUrl(image: string): SafeStyle {
        return this.sanitization.bypassSecurityTrustStyle(this.helperService.getBackgroundUrl(image));
    }

    private getThumbnailPosition(index: number, count: number): SafeStyle {
        return this.getSafeStyle('calc(' + ((100 / count) * index) + '% + '
            + ((this.margin - (((count - 1) * this.margin) / count)) * index) + 'px)');
    }

    private getThumbnailDimension(count: number): SafeStyle {
        if (this.margin !== 0) {
            return this.getSafeStyle('calc(' + (100 / count) + '% - '
                + (((count - 1) * this.margin) / count) + 'px)');
        } else {
            return this.getSafeStyle('calc(' + (100 / count) + '% + 1px)');
        }
    }

    private getMaxIndex(): number {
        return Math.ceil(this.images.length / this.rows);
    }

    private getVisibleCount(): number {
        return this.columns * this.rows;
    }

    private getSafeStyle(value: string): SafeStyle {
        return this.sanitization.bypassSecurityTrustStyle(value);
    }
}
