import { Component, Input } from '@angular/core';

@Component({
	selector: 'link-post',
	template: `
		<div>
            <a :href="link.url" *ngIf="link.photo === ''">
                {{ link.title }}
            </a>
            <a [href]="link.url" v-else>
                <img [src]="link.photo.url">
            </a>
        </div>
	`,
})

export class LinkPostComponent {
	@Input() link: any
}