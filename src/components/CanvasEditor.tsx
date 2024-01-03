import {useRef} from "react";

interface CanvasEditorArguments {
    setSelected: Function,
    color: string
}

interface LayerType {

}

let _colorTimeout;
const CanvasEditor = ({setSelected, color}:CanvasEditorArguments): JSX.Element => {

    const svg = useRef(null);
    const canvas = useRef(null);
    const outer = useRef(null);



    return (
        <div id="canvasEditor">
            <canvas ref={canvas}></canvas>
            <svg ref={svg} xmlns="http://www.w3.org/2000/svg"></svg>
            <div ref={outer} id="mainOuter"></div>
        </div>
    );
};

export default CanvasEditor;