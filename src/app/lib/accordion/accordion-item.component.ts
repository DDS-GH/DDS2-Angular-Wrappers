import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnInit,
    Renderer2,
    SimpleChanges,
  } from "@angular/core";
import { stringToBoolean } from "../helpers/dds.helpers";
import { Accordion } from "@dds/components";
  
  @Component({
    selector: "dds-accordion-item",
    templateUrl: "./accordion-item.component.html",
  })
  export class AccordionItemComponent implements OnInit, AfterViewInit, AfterContentInit, OnChanges {
      // @Input() accordionId!: string;
      // @Input() hidden = false;
    @Input() id!: string;
    @Input() elementId: string = ``;
    @Input() title: string = ``;
    @Input() disabled: any = false;
    @Input() expanded: any = false;
    public isDisabled: boolean = false;
    private el: any;
    private parent: any;
  
    private unwrap() {
        // access the DOM. get the element to unwrap
        this.el = this.elRef.nativeElement; // app-page
        this.parent = this.renderer.parentNode(this.elRef.nativeElement) as HTMLElement;
        
        // move children to parent (everything is moved including comments which angular depends on)
        while (this.el.firstChild) {
            // this line doesn't work with server-rendering
            this.renderer.appendChild(this.parent, this.el.firstChild);
        }
  
        // remove empty element from parent
        // - true to signal that this removed element is a host element
        this.renderer.removeChild(this.parent, this.el, true);
    }
    constructor(private renderer: Renderer2, private elRef: ElementRef<HTMLElement>) {}
    ngAfterContentInit(): void {
        ;
    }
    ngAfterViewInit(): void { 
        this.unwrap(); 
        setTimeout(() => {
            this.isDisabled = this.disabled;
        });
    }
  
    ngOnInit(): void { 
        this.disabled = stringToBoolean(this.disabled);
        this.expanded = stringToBoolean(this.expanded);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes[`disabled`] && !changes[`disabled`].firstChange) {
            this.isDisabled = this.disabled;
        }
    }
  }
  