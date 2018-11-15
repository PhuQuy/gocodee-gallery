import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, HostListener, ViewChild, Renderer } from '@angular/core';
import { SafeResourceUrl, DomSanitizer, SafeUrl, SafeStyle } from '@angular/platform-browser';

import { GocodeeGalleryAction } from './gocodee-gallery-action.model';
import { GocodeeGalleryHelperService } from './gocodee-gallery-helper.service';

@Component({
    selector: 'gocodee-gallery-preview',
    templateUrl: './gocodee-gallery-preview.component.html',
    styleUrls: ['./gocodee-gallery-preview.component.scss']
})
export class GocodeeGalleryPreviewComponent implements OnChanges {

    src: SafeUrl;
    srcIndex: number;
    description: string;
    showSpinner = false;
    positionLeft = 0;
    positionTop = 0;
    zoomValue = 1;
    loading = false;
    rotateValue = 0;
    index = 0;

    @Input() images: string[] | SafeResourceUrl[];
    @Input() descriptions: string[];
    @Input() showDescription: boolean;
    @Input() swipe: boolean;
    @Input() fullscreen: boolean;
    @Input() forceFullscreen: boolean;
    @Input() closeOnClick: boolean;
    @Input() closeOnEsc: boolean;
    @Input() keyboardNavigation: boolean;
    @Input() arrowPrevIcon: string;
    @Input() arrowNextIcon: string;
    @Input() closeIcon: string;
    @Input() fullscreenIcon: string;
    @Input() spinnerIcon: string;
    @Input() autoPlay: boolean;
    @Input() autoPlayInterval: number;
    @Input() autoPlayPauseOnHover: boolean;
    @Input() infinityMove: boolean;
    @Input() zoom: boolean;
    @Input() zoomStep: number;
    @Input() zoomMax: number;
    @Input() zoomMin: number;
    @Input() zoomInIcon: string;
    @Input() zoomOutIcon: string;
    @Input() animation: boolean;
    @Input() actions: GocodeeGalleryAction[];
    @Input() rotate: boolean;
    @Input() rotateLeftIcon: string;
    @Input() rotateRightIcon: string;
    @Input() download: boolean;
    @Input() downloadIcon: string;

    @Output() onOpen = new EventEmitter();
    @Output() onClose = new EventEmitter();
    @Output() onActiveChange = new EventEmitter<number>();

    @ViewChild('previewImage') previewImage: ElementRef;

    private isOpen = false;
    private timer;
    private initialX = 0;
    private initialY = 0;
    private initialLeft = 0;
    private initialTop = 0;
    private isMove = false;

    private keyDownListener: Function;

    constructor(private sanitization: DomSanitizer, private elementRef: ElementRef,
        private helperService: GocodeeGalleryHelperService, private renderer: Renderer) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef,
            'preview', () => this.showNext(), () => this.showPrev());
        }
    }

    ngOnDestroy() {
        if (this.keyDownListener) {
            this.keyDownListener();
        }
    }

    onKeyDown(e) {
        if (this.isOpen) {
            if (this.keyboardNavigation) {
                if (this.isKeyboardPrev(e)) {
                    this.showPrev();
                } else if (this.isKeyboardNext(e)) {
                    this.showNext();
                }
            }
            if (this.closeOnEsc && this.isKeyboardEsc(e)) {
                this.close();
            }
        }
    }

    open(index: number): void {
        this.onOpen.emit();

        this.index = index;
        this.isOpen = true;
        this.show(true);

        if (this.forceFullscreen) {
            this.manageFullscreen();
        }

        this.keyDownListener = this.renderer.listenGlobal("window", "keydown", (e) => this.onKeyDown(e));
    }

    close(): void {
        this.isOpen = false;
        this.closeFullscreen();
        this.onClose.emit();

        this.stopAutoPlay();

        if (this.keyDownListener) {
            this.keyDownListener();
        }
    }

    imageMouseEnter(): void {
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.stopAutoPlay();
        }
    }

    imageMouseLeave(): void {
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.startAutoPlay();
        }
    }

    startAutoPlay(): void {
        if (this.autoPlay) {
            this.stopAutoPlay();

            this.timer = setTimeout(() => {
                if (!this.showNext()) {
                    this.index = -1;
                    this.showNext();
                }
            }, this.autoPlayInterval);
        }
    }

    stopAutoPlay(): void {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    showNext(): boolean {
        if (this.canShowNext()) {
            this.index++;

            if (this.index === this.images.length) {
                this.index = 0;
            }

            this.show();
            return true;
        } else {
            return false;
        }
    }

    showPrev(): void {
        if (this.canShowPrev()) {
            this.index--;

            if (this.index < 0) {
                this.index = this.images.length - 1;
            }

            this.show();
        }
    }

    canShowNext(): boolean {
        if (this.loading) {
            return false;
        } else if (this.images) {
            return this.infinityMove || this.index < this.images.length - 1 ? true : false;
        } else {
            return false;
        }
    }

    canShowPrev(): boolean {
        if (this.loading) {
            return false;
        } else if (this.images) {
            return this.infinityMove || this.index > 0 ? true : false;
        } else {
            return false;
        }
    }

    manageFullscreen(): void {
        if (this.fullscreen || this.forceFullscreen) {
            const doc = <any>document;

            if (!doc.fullscreenElement && !doc.mozFullScreenElement
                && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                this.openFullscreen();
            } else {
                this.closeFullscreen();
            }
        }
    }

    getSafeUrl(image: string): SafeUrl {
        return image.substr(0, 10) === 'data:image' ?
            image : this.sanitization.bypassSecurityTrustUrl(image);
    }

    zoomIn(): void {
        if (this.canZoomIn()) {
            this.zoomValue += this.zoomStep;

            if (this.zoomValue > this.zoomMax) {
                this.zoomValue = this.zoomMax;
            }
        }
    }

    zoomOut(): void {
        if (this.canZoomOut()) {
            this.zoomValue -= this.zoomStep;

            if (this.zoomValue < this.zoomMin) {
                this.zoomValue = this.zoomMin;
            }

            if (this.zoomValue <= 1) {
                this.resetPosition()
            }
        }
    }

    rotateLeft(): void {
        this.rotateValue -= 90;
    }

    rotateRight(): void {
        this.rotateValue += 90;
    }

    getTransform(): SafeStyle {
        return this.sanitization.bypassSecurityTrustStyle('scale(' + this.zoomValue + ') rotate(' + this.rotateValue + 'deg)');
    }

    canZoomIn(): boolean {
        return this.zoomValue < this.zoomMax ? true : false;
    }

    canZoomOut(): boolean {
        return this.zoomValue > this.zoomMin ? true : false;
    }

    canDragOnZoom() {
        return this.zoom && this.zoomValue > 1;
    }

    mouseDownHandler(e): void {
        if (this.canDragOnZoom()) {
            this.initialX = this.getClientX(e);
            this.initialY = this.getClientY(e);
            this.initialLeft = this.positionLeft;
            this.initialTop = this.positionTop;
            this.isMove = true;

            e.preventDefault();
        }
    }

    mouseUpHandler(e): void {
        this.isMove = false;
    }

    mouseMoveHandler(e) {
        if (this.isMove) {
            this.positionLeft = this.initialLeft + (this.getClientX(e) - this.initialX);
            this.positionTop = this.initialTop + (this.getClientY(e) - this.initialY);
        }
    }

    private getClientX(e): number {
        return e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;
    }

    private getClientY(e): number {
        return e.touches && e.touches.length ? e.touches[0].clientY : e.clientY;
    }

    private resetPosition() {
        if (this.zoom) {
            this.positionLeft = 0;
            this.positionTop = 0;
        }
    }

    private isKeyboardNext(e): boolean {
        return e.keyCode === 39 ? true : false;
    }

    private isKeyboardPrev(e): boolean {
        return e.keyCode === 37 ? true : false;
    }

    private isKeyboardEsc(e): boolean {
        return e.keyCode === 27 ? true : false;
    }

    private openFullscreen(): void {
        const element = <any>document.documentElement;

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
    }

    private closeFullscreen(): void {

        const doc = <any>document;

        if (doc.exitFullscreen) {
            doc.exitFullscreen();
        } else if (doc.msExitFullscreen) {
            doc.msExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
        } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
        }
    }

    private show(first = false) {
        this.loading = true;
        this.stopAutoPlay();

        this.onActiveChange.emit(this.index);

        if (first || !this.animation) {
            this._show();
        } else {
            setTimeout(() => this._show(), 600);
        }
    }

    private _show() {
        this.zoomValue = 1;
        this.rotateValue = 0;
        this.resetPosition();

        this.src = this.getSafeUrl(<string>this.images[this.index]);
        this.srcIndex = this.index;
        this.description = this.descriptions[this.index];

        setTimeout(() => {
            if (this.isLoaded(this.previewImage.nativeElement)) {
                this.loading = false;
                this.startAutoPlay();
            } else {
                setTimeout(() => {
                    if (this.loading) {
                        this.showSpinner = true;
                    }
                })

                this.previewImage.nativeElement.onload = () => {
                    this.loading = false;
                    this.showSpinner = false;
                    this.previewImage.nativeElement.onload = null;
                    this.startAutoPlay();
                }
            }
        })
    }

    private isLoaded(img): boolean {
        if (!img.complete) {
            return false;
        }

        if (typeof img.naturalWidth !== 'undefined' && img.naturalWidth === 0) {
            return false;
        }

        return true;
    }
}
