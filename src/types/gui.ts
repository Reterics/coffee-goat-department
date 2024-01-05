import React, {MouseEventHandler} from "react";


export type SideButtonPosition = 'top-right'|'bottom-right'|'left-bottom'|'right-bottom';

export interface SideButtonArguments {
    onClick?: MouseEventHandler<HTMLIonFabButtonElement>
    disabled?: boolean
    icon?: string
    children?: React.ReactNode,
    position: SideButtonPosition
    order?: number
    style?: CSSStyleDeclaration
    color?: string
}