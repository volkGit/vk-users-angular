import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'text-hide',
	template: `
		<div>
            <p *ngIf="!show">{{ textSmall }}</p>
            <p *ngIf="show">{{ text }}</p>
            <a href="#" (click)="updateText()" *ngIf="text.length > 100">{{ linkText }}</a>
        </div>
	`,
})

export class TextHideComponent implements OnInit {
	@Input() text: string
    textSmall: string
    linkTest: string
    linkText: string
    show: boolean = false

    updateText() {
        this.linkText = this.show ? 'Показать полностью' : 'Скрыть';
        this.show = !this.show;
    }

    ngOnInit(): void {
        this.textSmall = this.text.length === 0 ? '' : this.text.length < 100 ? this.text : this.text.slice(0, 100) + '...';
    }
}