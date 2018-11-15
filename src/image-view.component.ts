import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'image-view',
    templateUrl: './image-view.component.html',
    styleUrls: ['./image-view.component.scss']
})
export class ImageViewComponent implements OnInit {
    @Input() src: string = '';
    @Input() linkTo: string = `['/']`;
    isVideo: boolean = false;
    type: string = 'video/mp4';
    @Input() minHeight: number = 0;
    error: boolean = false;

    supported = ['mp4', 'webm', 'ogg'];
    constructor() { }

    ngOnInit() {
        let cloneSrc = this.src + '';
        if (this.checkVideo(cloneSrc)) {
            this.isVideo = true;
        }
    }

    checkVideo(image) {
        let type = image.substring(image.lastIndexOf('.') + 1, image.length);
        return this.checkMatch(type, this.supported);
    }

    checkMatch(src: string, supported: Array<string>): boolean {
        let filters = supported.filter(support => src.toLowerCase() === support);
        if (filters.length > 0) {
            this.type = `video/${filters[0]}`;
            return true;
        }
        return false;
    }

    catchError() {
        this.error = true;
    }

    success() {
        this.error = false;
    }
}
