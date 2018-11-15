import { Component, Input, HostListener, ViewChild, OnInit,
    HostBinding, DoCheck, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

import { GocodeeGalleryPreviewComponent } from './gocodee-gallery-preview.component';
import { GocodeeGalleryImageComponent } from './gocodee-gallery-image.component';
import { GocodeeGalleryThumbnailsComponent } from './gocodee-gallery-thumbnails.component';
import { GocodeeGalleryHelperService } from './gocodee-gallery-helper.service';

import { GocodeeGalleryOptions } from './gocodee-gallery-options.model';
import { GocodeeGalleryImage } from './gocodee-gallery-image.model';
import { GocodeeGalleryLayout } from './gocodee-gallery-layout.model';
import { GocodeeGalleryOrderedImage } from './gocodee-gallery-ordered-image.model';

@Component({
    selector: 'gocodee-gallery',
    templateUrl: './gocodee-gallery.component.html',
    styleUrls: ['./gocodee-gallery.component.scss'],
    providers: [GocodeeGalleryHelperService]
})
export class GocodeeGalleryComponent implements OnInit, DoCheck, AfterViewInit   {
    @Input() options: GocodeeGalleryOptions[];
    @Input() images: GocodeeGalleryImage[];

    @Output() imagesReady = new EventEmitter();
    @Output() change = new EventEmitter<{ index: number; image: GocodeeGalleryImage; }>();
    @Output() previewOpen = new EventEmitter();
    @Output() previewClose = new EventEmitter();
    @Output() previewChange = new EventEmitter<{ index: number; image: GocodeeGalleryImage; }>();

    smallImages: string[] | SafeResourceUrl[];
    mediumImages: GocodeeGalleryOrderedImage[];
    bigImages: string[] | SafeResourceUrl[];
    descriptions: string[];
    links: string[];
    labels: string[];

    oldImages: GocodeeGalleryImage[];
    oldImagesLength = 0;

    selectedIndex = 0;
    previewEnabled: boolean;

    currentOptions: GocodeeGalleryOptions;

    private breakpoint: number | undefined = undefined;
    private prevBreakpoint: number | undefined = undefined;
    private fullWidthTimeout: any;

    @ViewChild(GocodeeGalleryPreviewComponent) preview: GocodeeGalleryPreviewComponent;
    @ViewChild(GocodeeGalleryImageComponent) image: GocodeeGalleryImageComponent;
    @ViewChild(GocodeeGalleryThumbnailsComponent) thubmnails: GocodeeGalleryThumbnailsComponent;

    @HostBinding('style.width') width: string;
    @HostBinding('style.height') height: string;
    @HostBinding('style.left') left: string;

    constructor(private myElement: ElementRef) {}

    ngOnInit() {
        this.options = this.options.map((opt) => new GocodeeGalleryOptions(opt));
        this.sortOptions();
        this.setBreakpoint();
        this.setOptions();
        this.checkFullWidth();
        if (this.currentOptions) {
            this.selectedIndex = <number>this.currentOptions.startIndex;
        }
    }

    ngDoCheck(): void {
        if (this.images !== undefined && (this.images.length !== this.oldImagesLength)
            || (this.images !== this.oldImages)) {
            this.oldImagesLength = this.images.length;
            this.oldImages = this.images;
            this.setImages();

            if (this.images && this.images.length) {
                this.imagesReady.emit();
            }

            if (this.image) {
                this.image.reset(<number>this.currentOptions.startIndex);
            }

            this.resetThumbnails();
        }
    }

    ngAfterViewInit(): void {
        this.checkFullWidth();
    }

    @HostListener('window:resize') onResize() {
        this.setBreakpoint();

        if (this.prevBreakpoint !== this.breakpoint) {
            this.setOptions();
            this.resetThumbnails();
        }

        if (this.currentOptions && this.currentOptions.fullWidth) {

            if (this.fullWidthTimeout) {
                clearTimeout(this.fullWidthTimeout);
            }

            this.fullWidthTimeout = setTimeout(() => {
                this.checkFullWidth();
            }, 200);
        }
    }

    getImageHeight(): string {
        return (this.currentOptions && this.currentOptions.thumbnails) ?
            this.currentOptions.imagePercent + '%' : '100%';
    }

    getThumbnailsHeight(): string {
        if (this.currentOptions && this.currentOptions.image) {
            return 'calc(' + this.currentOptions.thumbnailsPercent + '% - '
            + this.currentOptions.thumbnailsMargin + 'px)';
        } else {
            return '100%';
        }
    }

    getThumbnailsMarginTop(): string {
        if (this.currentOptions && this.currentOptions.layout === GocodeeGalleryLayout.ThumbnailsBottom) {
            return this.currentOptions.thumbnailsMargin + 'px';
        } else {
            return '0px';
        }
    }

    getThumbnailsMarginBottom(): string {
        if (this.currentOptions && this.currentOptions.layout === GocodeeGalleryLayout.ThumbnailsTop) {
            return this.currentOptions.thumbnailsMargin + 'px';
        } else {
            return '0px';
        }
    }

    openPreview(index: number): void {
        if (this.currentOptions.previewCustom) {
            this.currentOptions.previewCustom(index);
        } else {
            this.previewEnabled = true;
            this.preview.open(index);
        }
    }

    onPreviewOpen(): void {
        this.previewOpen.emit();

        if (this.image && this.image.autoPlay) {
            this.image.stopAutoPlay();
        }
    }

    onPreviewClose(): void {
        this.previewEnabled = false;
        this.previewClose.emit();

        if (this.image && this.image.autoPlay) {
            this.image.startAutoPlay();
        }
    }

    selectFromImage(index: number) {
        this.select(index);
    }

    selectFromThumbnails(index: number) {
        this.select(index);

        if (this.currentOptions && this.currentOptions.thumbnails && this.currentOptions.preview
            && (!this.currentOptions.image || this.currentOptions.thumbnailsRemainingCount)) {
                console.log('open reveiew' + this.selectedIndex) ;
                
            this.openPreview(this.selectedIndex);
        }
    }

    show(index: number): void {
        this.select(index);
    }

    showNext(): void {
        this.image.showNext();
    }

    showPrev(): void {
        this.image.showPrev();
    }

    canShowNext(): boolean {
        if (this.images && this.currentOptions) {
            return (this.currentOptions.imageInfinityMove || this.selectedIndex < this.images.length - 1)
                ? true : false;
        } else {
            return false;
        }
    }

    canShowPrev(): boolean {
        if (this.images && this.currentOptions) {
            return (this.currentOptions.imageInfinityMove || this.selectedIndex > 0) ? true : false;
        } else {
            return false;
        }
    }

    previewSelect(index: number) {
        this.previewChange.emit({index, image: this.images[index]});
    }

    moveThumbnailsRight() {
        this.thubmnails.moveRight();
    }

    moveThumbnailsLeft() {
        this.thubmnails.moveLeft();
    }

    canMoveThumbnailsRight() {
        this.thubmnails.canMoveRight();
    }

    canMoveThumbnailsLeft() {
        this.thubmnails.canMoveLeft();
    }

    private resetThumbnails() {
        if (this.thubmnails) {
            this.thubmnails.reset(<number>this.currentOptions.startIndex);
        }
    }

    private select(index: number) {
        this.selectedIndex = index;

        this.change.emit({
            index,
            image: this.images[index]
        });
    }

    private checkFullWidth(): void {
        if (this.currentOptions && this.currentOptions.fullWidth) {
            this.width = document.body.clientWidth + 'px';
            this.left = (-(document.body.clientWidth -
                this.myElement.nativeElement.parentNode.innerWidth) / 2) + 'px';
        }
    }

    private setImages(): void {
        this.smallImages = this.images.map((img) => <string>img.small);
        this.mediumImages = this.images.map((img, i) => new GocodeeGalleryOrderedImage({
            src: img.medium,
            index: i
        }));
        this.bigImages = this.images.map((img) => <string>img.big);
        this.descriptions = this.images.map((img) => <string>img.description);
        this.links = this.images.map((img) => <string>img.url);
        this.labels = this.images.map((img) => <string>img.label);
    }

    private setBreakpoint(): void {
        this.prevBreakpoint = this.breakpoint;
        let breakpoints;

        if (typeof window !== 'undefined') {
            breakpoints = this.options.filter((opt) => opt.breakpoint >= window.innerWidth)
                .map((opt) => opt.breakpoint);
        }

        if (breakpoints && breakpoints.length) {
            this.breakpoint = breakpoints.pop();
        } else {
            this.breakpoint = undefined;
        }
    }

    private sortOptions(): void {
        this.options = [
            ...this.options.filter((a) => a.breakpoint === undefined),
            ...this.options
                .filter((a) => a.breakpoint !== undefined)
                .sort((a, b) => b.breakpoint - a.breakpoint)
        ];
    }

    private setOptions(): void {
        this.currentOptions = new GocodeeGalleryOptions({});

        this.options
            .filter((opt) => opt.breakpoint === undefined || opt.breakpoint >= this.breakpoint)
            .map((opt) => this.combineOptions(this.currentOptions, opt));

        this.width = <string>this.currentOptions.width;
        this.height = <string>this.currentOptions.height;
    }

    private combineOptions(first: GocodeeGalleryOptions, second: GocodeeGalleryOptions) {
        Object.keys(second).map((val) => first[val] = second[val] !== undefined ? second[val] : first[val]);
    }
}
