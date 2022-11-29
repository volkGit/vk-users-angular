import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-modal-content',
	template: `
		<div class="modal-header">
			<h4 class="modal-title">{{ title }}</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
			<p>{{ text }}</p>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Да</button>
			<button type="button" class="btn btn-outline-dark" (click)="activeModal.dismiss('Close click')">Нет</button>
		</div>
	`,
})

export class NgbdModalContent {
	@Input() text: string
    @Input() title: string

	constructor(public activeModal: NgbActiveModal) {}
}