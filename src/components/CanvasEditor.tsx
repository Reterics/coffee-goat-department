import React, {useEffect, useRef} from "react";
import {CanvasEditorArguments, LayerObject} from "../types/editor";
import interact from 'interactjs'


const CanvasEditor = ({selected, setSelected, color, layers, setLayers, mode}:CanvasEditorArguments): JSX.Element => {

    const svg = useRef(null);
    const canvas = useRef(null);

    useEffect(() => {
        if (selected) {
            const layerId = "layer" + layers.indexOf(selected);
            const node = document.getElementById(layerId);
            if (node) {
                const interacted = interact(node).draggable({
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
                        start: ()=>{return mode === "drag"},
                        // call this function on every dragmove event
                        move: function dragMoveListener (event:any) {
                            if (mode !== "drag") {
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
                        },

                        // call this function on every dragend event
                        end (event:any) {
                            console.log("Drag End");
                        }
                    }
                });
                if (selected.type === "image") {
                    interacted.resizable({
                        preserveAspectRatio: true,
                        // resize from all edges and corners
                        edges: { left: true, right: true, bottom: true, top: true },

                        listeners: {
                            move (event:any) {
                                if (mode !== "drag") {
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
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected, mode]);

    useEffect(() => {
        console.log("Loaded: ", svg.current, canvas.current);
    }, []);

    const onClickLayer = (layer: LayerObject) => {
        if (layer !== selected) {
            return setSelected(layer);
        }
        setSelected(undefined)
    }

    function handleContentChange(event: React.FocusEvent<HTMLDivElement, Element>, layer: LayerObject) {
        const innerDiv = event.currentTarget.querySelector('div');
        if (layer.type === "text" && innerDiv && innerDiv.innerText !== layer.content) {
            setLayers([...layers.map(l => {
                if (l === layer) {
                    l.content = innerDiv.innerText;
                }
                return l;
            })]);
        }
    }

    const renderLayer = (layer: LayerObject, index: number) => {
        return (<div
        key={"layer" + index}
        id={"layer" + index}
        className={layer.type + "-element"}
        data-x={layer.x}
        data-y={layer.y}
        style={layer.type === "image" ? {
            backgroundImage: 'url("' + layer.content + '")',
            height: (layer.height || 100) + "px",
            width: (layer.width || 100) + "px",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            transform: `translate(${layer.x || 0}px, ${layer.y || 0}px)`,
            rotate: `${layer.angle || 0}deg`
        } : {
            transform: `translate(${layer.x || 0}px, ${layer.y || 0}px)`,
            rotate: `${layer.angle || 0}deg`,
            fontSize: (layer.fontSize || 16) + "px"
        }}
        onClick={() => onClickLayer(layer)}
        contentEditable={mode === "edit" && layer === selected ? "true" : "inherit"}
        dangerouslySetInnerHTML={layer.type === "text" ?
            {__html: "<div>" + layer.content + "</div>"} :
            undefined}
        onBlur={(event)=>handleContentChange(event, layer)}
        />)
    };

    return (
        <div id="canvasEditor"        >
            <canvas key="canvas" ref={canvas}></canvas>
            <svg key="svg" ref={svg} xmlns="http://www.w3.org/2000/svg"></svg>
            <div key="outer" id="mainOuter">
                {layers.map((layer,index)=>renderLayer(layer, index))}
            </div>
        </div>
    );
};

export default CanvasEditor;