import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'gocodee-gallery-action',
    templateUrl: './gocodee-gallery-action.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GocodeeGalleryActionComponent {
    @Input() icon: string;
    @Input() disabled = false;
    @Input() titleText = '';

    @Output() onClick: EventEmitter<Event> = new EventEmitter();

    handleClick(event: Event) {
        if (!this.disabled) {
            this.onClick.emit(event);
        }

        event.stopPropagation();
        event.preventDefault();
    }
}
