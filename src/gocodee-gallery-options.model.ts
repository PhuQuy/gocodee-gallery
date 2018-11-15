import { GocodeeGalleryAnimation } from './gocodee-gallery-animation.model';
import { GocodeeGalleryImageSize } from './gocodee-gallery-image-size.model';
import { GocodeeGalleryLayout } from './gocodee-gallery-layout.model';
import { GocodeeGalleryOrder } from './gocodee-gallery-order.model';
import { GocodeeGalleryAction } from './gocodee-gallery-action.model';

export interface INgxGalleryOptions {
    width?: string;
    height?: string;
    breakpoint?: number;
    fullWidth?: boolean;
    layout?: string;
    startIndex?: number;
    linkTarget?: string;
    lazyLoading?: boolean;
    image?: boolean;
    imagePercent?: number;
    imageArrows?: boolean;
    imageArrowsAutoHide?: boolean;
    imageSwipe?: boolean;
    imageAnimation?: string;
    imageSize?: string;
    imageAutoPlay?: boolean;
    imageAutoPlayInterval?: number;
    imageAutoPlayPauseOnHover?: boolean;
    imageInfinityMove?: boolean;
    imageActions?: GocodeeGalleryAction[];
    imageDescription?: boolean;
    thumbnails?: boolean;
    thumbnailsColumns?: number;
    thumbnailsRows?: number;
    thumbnailsPercent?: number;
    thumbnailsMargin?: number;
    thumbnailsArrows?: boolean;
    thumbnailsArrowsAutoHide?: boolean;
    thumbnailsSwipe?: boolean;
    thumbnailsMoveSize?: number;
    thumbnailsOrder?: GocodeeGalleryOrder;
    thumbnailsRemainingCount?: boolean;
    thumbnailsAsLinks?: boolean;
    thumbnailMargin?: number;
    thumbnailSize?: string;
    thumbnailActions?: GocodeeGalleryAction[];
    preview?: boolean;
    previewDescription?: boolean;
    previewSwipe?: boolean;
    previewFullscreen?: boolean;
    previewForceFullscreen?: boolean;
    previewCloseOnClick?: boolean;
    previewCloseOnEsc?: boolean;
    previewKeyboardNavigation?: boolean;
    previewAnimation?: boolean;
    previewAutoPlay?: boolean;
    previewAutoPlayInterval?: number;
    previewAutoPlayPauseOnHover?: boolean;
    previewInfinityMove?: boolean;
    previewZoom?: boolean;
    previewZoomStep?: number;
    previewZoomMax?: number;
    previewZoomMin?: number;
    previewRotate?: boolean;
    previewDownload?: boolean;
    previewCustom?: (index: number) => void;
    arrowPrevIcon?: string;
    arrowNextIcon?: string;
    closeIcon?: string;
    fullscreenIcon?: string;
    spinnerIcon?: string;
    zoomInIcon?: string;
    zoomOutIcon?: string;
    rotateLeftIcon?: string;
    rotateRightIcon?: string;
    downloadIcon?: string;
    actions?: GocodeeGalleryAction[];
}

export class GocodeeGalleryOptions implements INgxGalleryOptions {
    width?: string;
    height?: string;
    breakpoint?: number;
    fullWidth?: boolean;
    layout?: string;
    startIndex?: number;
    linkTarget?: string;
    lazyLoading?: boolean;
    image?: boolean;
    imagePercent?: number;
    imageArrows?: boolean;
    imageArrowsAutoHide?: boolean;
    imageSwipe?: boolean;
    imageAnimation?: string;
    imageSize?: string;
    imageAutoPlay?: boolean;
    imageAutoPlayInterval?: number;
    imageAutoPlayPauseOnHover?: boolean;
    imageInfinityMove?: boolean;
    imageActions?: GocodeeGalleryAction[];
    imageDescription?: boolean;
    thumbnails?: boolean;
    thumbnailsColumns?: number;
    thumbnailsRows?: number;
    thumbnailsPercent?: number;
    thumbnailsMargin?: number;
    thumbnailsArrows?: boolean;
    thumbnailsArrowsAutoHide?: boolean;
    thumbnailsSwipe?: boolean;
    thumbnailsMoveSize?: number;
    thumbnailsOrder?: GocodeeGalleryOrder;
    thumbnailsRemainingCount?: boolean;
    thumbnailsAsLinks?: boolean;
    thumbnailMargin?: number;
    thumbnailSize?: string;
    thumbnailActions?: GocodeeGalleryAction[];
    preview?: boolean;
    previewDescription?: boolean;
    previewSwipe?: boolean;
    previewFullscreen?: boolean;
    previewForceFullscreen?: boolean;
    previewCloseOnClick?: boolean;
    previewCloseOnEsc?: boolean;
    previewKeyboardNavigation?: boolean;
    previewAnimation?: boolean;
    previewAutoPlay?: boolean;
    previewAutoPlayInterval?: number;
    previewAutoPlayPauseOnHover?: boolean;
    previewInfinityMove?: boolean;
    previewZoom?: boolean;
    previewZoomStep?: number;
    previewZoomMax?: number;
    previewZoomMin?: number;
    previewRotate?: boolean;
    previewDownload?: boolean;
    previewCustom?: (index: number) => void;
    arrowPrevIcon?: string;
    arrowNextIcon?: string;
    closeIcon?: string;
    fullscreenIcon?: string;
    spinnerIcon?: string;
    zoomInIcon?: string;
    zoomOutIcon?: string;
    rotateLeftIcon?: string;
    rotateRightIcon?: string;
    downloadIcon?: string;
    actions?: GocodeeGalleryAction[];

    constructor(obj: INgxGalleryOptions) {

        const preventDefaults = obj.breakpoint === undefined ? false : true;

        function use<T>(source: T, defaultValue: T): T {
            return obj && (source !== undefined || preventDefaults) ? source : defaultValue;
        }

        this.breakpoint = use(obj.breakpoint, undefined);
        this.width = use(obj.width, '500px');
        this.height = use(obj.height, '400px');
        this.fullWidth = use(obj.fullWidth, false);
        this.layout = use(obj.layout, GocodeeGalleryLayout.ThumbnailsBottom);
        this.startIndex = use(obj.startIndex, 0);
        this.linkTarget = use(obj.linkTarget, '_blank');
        this.lazyLoading = use(obj.lazyLoading, true);

        this.image = use(obj.image, true);
        this.imagePercent = use(obj.imagePercent, 75);
        this.imageArrows = use(obj.imageArrows, true);
        this.imageArrowsAutoHide = use(obj.imageArrowsAutoHide, false);
        this.imageSwipe = use(obj.imageSwipe, false);
        this.imageAnimation = use(obj.imageAnimation, GocodeeGalleryAnimation.Fade);
        this.imageSize = use(obj.imageSize, GocodeeGalleryImageSize.Cover);
        this.imageAutoPlay = use(obj.imageAutoPlay, false);
        this.imageAutoPlayInterval = use(obj.imageAutoPlayInterval, 2000);
        this.imageAutoPlayPauseOnHover = use(obj.imageAutoPlayPauseOnHover, false);
        this.imageInfinityMove = use(obj.imageInfinityMove, false);
        if (obj && obj.imageActions && obj.imageActions.length) {
            obj.imageActions = obj.imageActions.map(action => new GocodeeGalleryAction(action));
        }
        this.imageActions = use(obj.imageActions, []);
        this.imageDescription = use(obj.imageDescription, false);

        this.thumbnails = use(obj.thumbnails, true);
        this.thumbnailsColumns = use(obj.thumbnailsColumns, 4);
        this.thumbnailsRows = use(obj.thumbnailsRows, 1);
        this.thumbnailsPercent = use(obj.thumbnailsPercent, 25);
        this.thumbnailsMargin = use(obj.thumbnailsMargin, 10);
        this.thumbnailsArrows = use(obj.thumbnailsArrows, true);
        this.thumbnailsArrowsAutoHide = use(obj.thumbnailsArrowsAutoHide, false);
        this.thumbnailsSwipe = use(obj.thumbnailsSwipe, false);
        this.thumbnailsMoveSize = use(obj.thumbnailsMoveSize, 1);
        this.thumbnailsOrder = use(obj.thumbnailsOrder, GocodeeGalleryOrder.Column);
        this.thumbnailsRemainingCount = use(obj.thumbnailsRemainingCount, false);
        this.thumbnailsAsLinks = use(obj.thumbnailsAsLinks, false);
        this.thumbnailMargin = use(obj.thumbnailMargin, 10);
        this.thumbnailSize = use(obj.thumbnailSize, GocodeeGalleryImageSize.Cover);
        if (obj && obj.thumbnailActions && obj.thumbnailActions.length) {
            obj.thumbnailActions = obj.thumbnailActions.map(action => new GocodeeGalleryAction(action));
        }
        this.thumbnailActions = use(obj.thumbnailActions, []);

        this.preview = use(obj.preview, true);
        this.previewDescription = use(obj.previewDescription, true);
        this.previewSwipe = use(obj.previewSwipe, false);
        this.previewFullscreen = use(obj.previewFullscreen, false);
        this.previewForceFullscreen = use(obj.previewForceFullscreen, false);
        this.previewCloseOnClick = use(obj.previewCloseOnClick, false);
        this.previewCloseOnEsc = use(obj.previewCloseOnEsc, false);
        this.previewKeyboardNavigation = use(obj.previewKeyboardNavigation, false);
        this.previewAnimation = use(obj.previewAnimation, true);
        this.previewAutoPlay = use(obj.previewAutoPlay, false);
        this.previewAutoPlayInterval = use(obj.previewAutoPlayInterval, 2000);
        this.previewAutoPlayPauseOnHover = use(obj.previewAutoPlayPauseOnHover, false);
        this.previewInfinityMove = use(obj.previewInfinityMove, false);
        this.previewZoom = use(obj.previewZoom, false);
        this.previewZoomStep = use(obj.previewZoomStep, 0.1);
        this.previewZoomMax = use(obj.previewZoomMax, 2);
        this.previewZoomMin = use(obj.previewZoomMin, 0.5);
        this.previewRotate = use(obj.previewRotate, false);
        this.previewDownload = use(obj.previewDownload, false);
        this.previewCustom = use(obj.previewCustom, undefined);

        this.arrowPrevIcon = use(obj.arrowPrevIcon, 'fa fa-arrow-circle-left');
        this.arrowNextIcon = use(obj.arrowNextIcon, 'fa fa-arrow-circle-right');
        this.closeIcon = use(obj.closeIcon, 'fa fa-times-circle');
        this.fullscreenIcon = use(obj.fullscreenIcon, 'fa fa-arrows-alt');
        this.spinnerIcon = use(obj.spinnerIcon, 'fa fa-spinner fa-pulse fa-3x fa-fw');
        this.zoomInIcon = use(obj.zoomInIcon, 'fa fa-search-plus');
        this.zoomOutIcon = use(obj.zoomOutIcon, 'fa fa-search-minus');
        this.rotateLeftIcon = use(obj.rotateLeftIcon, 'fa fa-undo');
        this.rotateRightIcon = use(obj.rotateRightIcon, 'fa fa-repeat');
        this.downloadIcon = use(obj.downloadIcon, 'fa fa-arrow-circle-down');

        if (obj && obj.actions && obj.actions.length) {
            obj.actions = obj.actions.map(action => new GocodeeGalleryAction(action));
        }
        this.actions = use(obj.actions, []);
    }
}
