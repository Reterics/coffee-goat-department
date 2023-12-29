import interact from "interactjs"

/**
 * @name MainImageEditor
 * @class
 */
class MainImageEditor {
    parent?: Element | null;
    canvas?: HTMLCanvasElement;
    svg?: SVGSVGElement;
    div?: Element;
    selected?: Element;
    setSelectedState?: Function;
    initNeeded: boolean;
    constructor() {
        this.initNeeded = true;
    }

    public init(selector:string, setSelected: Function|undefined) {
        if (!this.initNeeded) {
            return;
        }
        this.initNeeded = false;
        this.setSelectedState = setSelected;
        console.log('Initialize Editor...');
        this.parent = document.querySelector(selector);
        if (!this.parent) {
            throw Error('Parent element is not found at ' + selector);
        }
        this.canvas = document.createElement('canvas');

        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        this.div = document.createElement('div');
        this.div.id = "main_outer";
        this.parent.innerHTML = "";
        this.parent?.appendChild(this.canvas);
        this.parent?.appendChild(this.svg);
        this.parent?.appendChild(this.div);
    }


    private createElement(options: any): Element {
        if (!options) {
            options = {};
        }
        const element = document.createElement(options.type || 'div');

        if (options.className) {
            options.className.split(' ').forEach((className: string) => {
                if (className) {
                    element.classList.add(className);
                }
            });
        }
        if (Array.isArray(options.classList)) {
            options.classList.forEach((className: string) => {
                if (className) {
                    element.classList.add(className);
                }
            });
        }
        if (options.id) {
            element.id = options.id;
        }
        if (options.innerHTML) {
            element.innerHTML = options.innerHTML;
        }
        if (options.innerText) {
            element.innerText = options.innerText;
        }

        if (Array.isArray(options.children)) {
            options.children.forEach((child:Element)=>{
                element.appendChild(child);
            });
        }

        if (options.contenteditable) {
            element.setAttribute('contenteditable', 'true');
        }
        return element;

    }

    private changeEditorState () {
        if (!this.selected) {
            return;
        }
        const element = this.selected as HTMLElement;
        element.onclick = function () {
            if(element.classList.contains('state-edit')) {
                element.classList.remove('state-edit');
                element.classList.add('state-drag');
            } else if(element.classList.contains('state-drag')) {
                element.classList.remove('state-drag');
            } else {
                element.classList.add('state-edit');
            }
        }
    }

    public switchToDrag () {
        if (!this.selected) {
            return;
        }
        const element = this.selected as HTMLElement;
        element.classList.remove('state-edit');
        element.classList.add('state-drag');

        if (element.classList.contains('text-element')) {
            const innerDiv = element.querySelector('div');
            if (innerDiv) {
                element.removeAttribute('contenteditable');
            }
        }
    }
    public switchToEdit () {
        if (!this.selected) {
            return;
        }
        const element = this.selected as HTMLElement;
        element.classList.add('state-edit');
        element.classList.remove('state-drag');
        if (element.classList.contains('text-element')) {
            const innerDiv = element.querySelector('div');
            if (innerDiv) {
                element.setAttribute('contenteditable', 'true');
            }
        }
    }

    private makeSelectable(element: HTMLElement) {
        element.onclick =  () => {
            if (!element.classList.contains('selected')) {
                this.div?.querySelectorAll('.selected').forEach(node=>node.classList.remove('selected'));
                element.classList.add('selected');

                this.selected = element;
                if (this.setSelectedState) {
                    this.setSelectedState(this.selected)
                }
            }
        }
    }

    private applyInteractTo(element: HTMLElement) {
        // let angle = 0;
        const interacted = interact('#' + element.id)
            .draggable({
                // enable inertial throwing
                inertia: true,
                // keep the element within the area of it's parent
                modifiers: [
                    // @ts-ignore
                    interact.modifiers.restrictRect({
                        restriction: 'parent',
                        endOnly: true
                    })
                ],
                // enable autoScroll
                autoScroll: true,

                listeners: {
                    start: ()=>{return element.classList.contains('state-drag')},
                    // call this function on every dragmove event
                    move: dragMoveListener,

                    // call this function on every dragend event
                    // end (event:any) {}
                }
            });

        if (element.classList.contains('image-element')) {
            interacted.resizable({
                preserveAspectRatio: element.classList.contains('image-element'),
                // resize from all edges and corners
                edges: { left: true, right: true, bottom: true, top: true },

                listeners: {
                    move (event:any) {
                        if(!element.classList.contains('state-drag')) {
                            return;
                        }
                        const target = event.target
                        let x = (parseFloat(target.getAttribute('data-x')) || 0)
                        let y = (parseFloat(target.getAttribute('data-y')) || 0)
                        // const angle = Number.parseInt(element.getAttribute('data-angle') || '0');

                        // update the element's style
                        target.style.width = event.rect.width + 'px'
                        target.style.height = event.rect.height + 'px'

                        // translate when resizing from top or left edges
                        x += event.deltaRect.left
                        y += event.deltaRect.top

                        target.style.transform = 'translate(' + x + 'px,' + y + 'px)'; //rotate('+angle+'deg)

                        target.setAttribute('data-x', x)
                        target.setAttribute('data-y', y)
                        // target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
                    }
                },
                modifiers: [
                    // keep the edges inside the parent
                    // @ts-ignore
                    // interact.modifiers.restrictEdges({
                    //    outer: 'parent'
                    //}),

                    // minimum size
                    // @ts-ignore
                    interact.modifiers.restrictSize({
                        min: { width: 100, height: 50 }
                    })
                ],

                inertia: true
            })
        }

        /*if (element.classList.contains('text-element') && false) {
            const rotateTarget = element.querySelector('div');

            interacted.gesturable({
                listeners: {
                    move (event:any) {
                        if (element.classList.contains('state-drag') && rotateTarget) {
                            const x = parseFloat(element.getAttribute('data-x') || '0');
                            const y = parseFloat(element.getAttribute('data-y') || '0');
                            let angle = Number.parseInt(element.getAttribute('data-angle') || '0');
                            angle += event.da;

                            element.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
                            rotateTarget.style.transform = 'rotate(' + angle + 'deg)';
                            element.setAttribute('data-angle', angle.toString());
                        }

                    }
                }
            });
        }*/

        function dragMoveListener (event:any) {
            if(!element.classList.contains('state-drag')) {
                return;
            }
            const target = event.target;
            // keep the dragged position in the data-x/data-y attributes
            const x = (parseFloat(target?.getAttribute('data-x')) || 0) + event.dx
            const y = (parseFloat(target?.getAttribute('data-y')) || 0) + event.dy
            //const angle = Number.parseInt(element.getAttribute('data-angle') || '0');

            // translate the element
            target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'; //rotate('+angle+'deg)

            // update the posiion attributes
            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)
        }
    }

    public addImageElement(src: string) {
        const imageElement = this.createElement({
            id: 'draggable_' + new Date().getTime(),
            type: 'div',
            classList: ['image-element', 'selected', 'state-drag'],
            innerHTML: ''
        }) as HTMLElement;
        imageElement.style.backgroundImage = 'url("'+src+'")';
        imageElement.style.height = '100px';
        imageElement.style.width = '100px';
        imageElement.style.backgroundRepeat = 'no-repeat';
        imageElement.style.backgroundSize = 'contain';
        this.div?.querySelectorAll('.selected').forEach(node=>node.classList.remove('selected'));
        this.div?.appendChild(imageElement);
        this.selected = imageElement;
        this.applyInteractTo(imageElement);
        this.makeSelectable(imageElement);
        if (this.setSelectedState) {
            this.setSelectedState(this.selected)
        }
    }
    public addTextElement() {
        const textElement = this.createElement({
            id: 'draggable_' + new Date().getTime(),
            type: 'div',
            classList: ['text-element', 'selected', 'state-drag'],
            innerHTML: '<div>Edit me</div>'
        }) as HTMLElement;
        // this.applyEditorStates(textElement as HTMLElement);
        this.div?.querySelectorAll('.selected').forEach(node=>node.classList.remove('selected'));
        this.div?.appendChild(textElement);
        this.selected = textElement;
        this.applyInteractTo(textElement);
        this.makeSelectable(textElement);
        if (this.setSelectedState) {
            this.setSelectedState(this.selected)
        }
    }


    public moveUpper() {
        if (!this.selected) {
            return;
        }
        const element = this.selected as HTMLElement;
        const parent = this.selected.parentElement;
        if (parent) {
            const nextSibling = element.nextElementSibling;
            // If this is the last element
            if (!nextSibling) {
                parent.insertBefore(element, parent.children[0]);
            } else if(nextSibling && !nextSibling.nextElementSibling) {
                // Only one has next to it
                parent.appendChild(element);
            } else {
                parent.insertBefore(element, nextSibling.nextElementSibling);
            }
            for (let i = 0; i < parent.children.length; i++) {
                const child = parent.children[i] as HTMLElement;
                child.style.zIndex = (i+1).toString();
            }
        }
    }

    public applyMultiTouchRotationFeature() {
        if (this.div) {
            const self = this;
            // @ts-ignore
            interact("#" + this.div.id).gesturable({
                listeners: {
                    move (event:any) {
                        const target = self.selected as HTMLElement;
                        if (target) {
                            let angle = Number.parseInt(target.getAttribute('data-angle') || '0');
                            angle += event.da;

                            target.style.rotate = '' + angle + 'deg';
                            target.setAttribute('data-angle', angle.toString());
                        }
                    }
                }
            })
        }

    }

    public removeSelected() {
        if (this.selected) {
            this.selected.outerHTML = '';
            this.selected = undefined;
            if (this.setSelectedState) {
                this.setSelectedState(this.selected)
            }
        }
    }

}

export default MainImageEditor;
