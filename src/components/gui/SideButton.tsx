import {IonFabButton, IonIcon} from "@ionic/react";
import React from "react";
import {SideButtonArguments} from "../../types/gui";

export const SideButton = ({onClick, disabled, icon, children, position, style, order, color}:SideButtonArguments): JSX.Element => {

    const steps = 55;
    const padding = {
        bottom: 10
    }
    const customStyle = style || {} as CSSStyleDeclaration;
    const nth = order || 1;

    switch (position) {
        case "top-right":
            customStyle.top = (nth * steps) + "px";
            customStyle.right = "calc(var(--ion-safe-area-right, 0px))";
            break;
        case "bottom-right":
            customStyle.bottom = "calc(var(--offset-bottom, 0px) + " + (((nth-1) * steps) + padding.bottom) + "px)";
            customStyle.right = "calc(var(--ion-safe-area-right, 0px))";
            break;
        case "left-bottom":
            customStyle.left = "calc(var(--ion-safe-area-left, 0px) + " + (nth * steps) + "px)";
            customStyle.bottom = "calc(var(--offset-bottom, 0px) + " + (padding.bottom) + "px)";
            break;
        case "right-bottom":
            customStyle.right = "calc(var(--ion-safe-area-right, " + ((nth * steps) + padding.bottom) + "px))";
            customStyle.bottom = "calc(var(--offset-bottom, 0px) + " + (padding.bottom) + "px)";
            break;
    }
    customStyle.position = "absolute";

    return (
        <IonFabButton size="small" onClick={onClick} style={customStyle} disabled={disabled} color={color}>
            {icon && <IonIcon size="small" icon={icon} />}
            {children}
        </IonFabButton>
    )
}