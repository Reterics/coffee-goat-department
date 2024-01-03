export type LayerType = 'text'|'image';

export interface LayerObject {
    type: LayerType
    content?: string
    selected?: boolean
    x?: number
    y?: number
    fontSize?: number
    width?: number
    height?: number
    angle?: number
}

export type EditorMode = 'drag'|'edit';

export interface CanvasEditorArguments {
    selected?: LayerObject
    setSelected: Function
    color: string
    layers: LayerObject[]
    setLayers: Function
    mode: EditorMode
}

