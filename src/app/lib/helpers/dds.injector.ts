import {
  ApplicationRef,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  Injector,
} from '@angular/core';

export interface InjectorCallback {
  event: string;
  method: any;
}

export const injectComponent: any = (
  applicationRef: ApplicationRef,
  factoryResolver: ComponentFactoryResolver,
  injector: Injector,
  componentClass: any,
  placeholders: any,
  elementClasses: string,
  callback: InjectorCallback
) => {
  // make sure the components you wish to create instances of are in your module's entryComponents
  // make sure your constructor defines the references (see this class's constructor)
  placeholders.forEach((ph: any) => {
    // 1 Find a component factory
    const componentFactory = factoryResolver.resolveComponentFactory(componentClass);
    // move the placeholder HTML to a new node
    var thisNode = document.createElement('span');
    thisNode.innerHTML = ph.innerHTML;
    // 2 create and initialize a component reference
    const componentRef = componentFactory.create(injector, [[thisNode]]);
    // @ts-ignore
    componentRef.instance.elementId = ph.id;
    // @ts-ignore
    componentRef.instance.classList = elementClasses; // this is the custom property "classList"
    // 3 attach component to applicationRef so angular virtual DOM will
    // understand it as dirty (requires re-rendering)
    applicationRef.attachView(componentRef.hostView);
    // 4 let`s do som preparation, get from the component created
    // a view REF
    const viewRef = componentRef.hostView as EmbeddedViewRef<any>;
    // and from view REF the HTML content...
    const viewEl = viewRef.rootNodes[0] as HTMLElement;
    if (callback) {
      viewEl.addEventListener(callback.event, callback.method);
    }
    const phParent = ph.parentElement;
    if (phParent) {
      phParent.appendChild(viewEl);
    }
    ph.remove();
  });
};
