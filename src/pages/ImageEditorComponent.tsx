import {
    IonContent, IonFab, IonFabButton, IonFabList, IonFooter,
    IonHeader, IonIcon, IonPage, IonThumbnail,
    IonTitle, IonToolbar
} from '@ionic/react';
import './ImageEditorComponent.css';
import {useExportedGallery, usePhotoGallery, UserPhoto} from "../components/usePhotoGallery";
import React, {useEffect, useRef, useState} from "react";
import {
    addOutline, appsOutline, cameraOutline, caretDown, caretUp, closeOutline,
    ellipsisHorizontalOutline, imageOutline,
    layersOutline,
    pencil,
    removeOutline,
    returnUpBackOutline,
    returnUpForwardOutline, saveOutline,
    textOutline, trashBinOutline
} from 'ionicons/icons';
import {EditorMode, LayerObject} from "../types/editor";
import CanvasEditor from "../components/CanvasEditor";
import html2canvas from "html2canvas";


let _colorTimeout:NodeJS.Timeout|number|undefined|null|string;
const ImageEditorComponent = ({galleryReload, exportImage}: {galleryReload:Function, exportImage:Function}): JSX.Element => {
    const {takePhoto, loadSaved, photos, pickPhotoFromGallery} = usePhotoGallery();

    const [thumbnailContainerIcon, setThumbnailContainerIcon] = useState("up");
    const [color, setColor] = useState("black");
    const [layers, setLayers] = useState<LayerObject[]>([]);
    const [mode, setMode] = useState<EditorMode>("drag");
    const [selected, setSelected] = useState<LayerObject|undefined>(undefined);
    const [staticCanvas, setStaticCanvas] = useState<HTMLCanvasElement|null>(null);

    useEffect(() => {
        void loadSaved();
       // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setColorDelayed = (color: string) => {
        console.log('Color: '+color);
        if (_colorTimeout) {
            clearTimeout(_colorTimeout);
        }
        _colorTimeout = setTimeout(() => {
            setColor(color);
        }, 500);
        return color;
    };

    const toggleImageSelectorContainer = () => {
        const footer = document.getElementById("footer");
        if (footer) {
            if (footer.style.display === "none") {
                footer.style.display = "block";
            } else {
                footer.style.display = "none"
            }

        }
    };

    const toggleThumbnailContainer = () => {
        const thumbnailContent = document.getElementById("thumbnailContent");
        if (thumbnailContent) {
            if (!thumbnailContent.classList.contains('opened')) {
                thumbnailContent.classList.add('opened')
                setThumbnailContainerIcon("down");
            } else {
                thumbnailContent.classList.remove('opened')
                setThumbnailContainerIcon("up")
            }
        }
    }

    const pickImageFromGallery = async () => {
        await pickPhotoFromGallery();
        toggleImageSelectorContainer();
    }
    const imageOnClick = (photo: UserPhoto) => {
        setLayers([...layers.map(l=> {
            l.selected = false
            return l;
        }), {
            type: 'image',
            content: photo.webviewPath || "",
            selected: true
        }])
        toggleImageSelectorContainer();
    }

    const addText = (string = "") => {
        setLayers([...layers.map(l=> {
            l.selected = false
            return l;
        }), {
            type: 'text',
            content: string,
            selected: true
        }])
    }

    const moveUp = () => {
        if (!selected) {
            return;
        }
        const selectedIndex = layers.findIndex((layer) => layer === selected);
        if (selectedIndex > 0) {
            const newLayers = [...layers];
            const temp = newLayers[selectedIndex];
            newLayers[selectedIndex] = newLayers[selectedIndex - 1];
            newLayers[selectedIndex - 1] = temp;

            setLayers(newLayers);
            // setSelected(newLayers[selectedIndex - 1]);
        }
    }

    const zoomLayer = (scaleType: number) => {
        if (!selected) {
            return;
        }

        setLayers([...layers.map(layer => {
            if (layer === selected) {
                if (layer.type === "text") {
                    layer.fontSize = layer.fontSize ? layer.fontSize + scaleType : 16 + scaleType;
                } else {
                    layer.width = Math.floor((layer.width || 100) * (1 + scaleType * 0.1));
                    layer.height = Math.floor((layer.height || 100) * (1 + scaleType * 0.1));
                }
            }
            return layer;
        })]);
    }

    const rotate = (angle: number) => {
        if (!selected) {
            return;
        }

        setLayers([...layers.map(layer => {
            if (layer === selected) {
                layer.angle = (layer.angle || 0) + angle;
            }
            return layer;
        })]);
    };

    const removeSelected = () => {
        if (!selected) {
            return;
        }

        setLayers([...layers.filter(layer => layer !== selected)]);
    };

    const exportToGallery = () => {
        const canvasEditor = document.getElementById('canvasEditor');
        if (canvasEditor) {
            const mainOuter = canvasEditor.querySelector('div');
            const canvas = canvasEditor.querySelector('canvas');
            if (mainOuter && canvas) {
                console.log('Execute html2canvas')
                html2canvas(mainOuter, {
                    // scale: 4,
                    width: canvas.offsetWidth,
                    height: canvas.offsetHeight,
                    backgroundColor: "#e1e1e1"
                }).then(async generatedCanvas => {
                    generatedCanvas.id = "image_" + new Date().getTime().toString();
                    await exportImage(generatedCanvas);
                    galleryReload();
                    setStaticCanvas(generatedCanvas);
                    // setLayers([]);
                });
            } else {
                console.error('mainOuter or canvas reference has not found');
            }
        } else {
            console.error('CanvasEditor reference has not found');
        }
    };

    return (
    <IonPage placeholder={undefined}>
      <IonHeader placeholder={undefined}>
        <IonToolbar placeholder={undefined}>
          <IonTitle placeholder={undefined}>Meme/Image Editor</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen placeholder={undefined} scrollY={false} scrollX={false}>
          <CanvasEditor staticCanvas={staticCanvas}
                        selected={selected}
                        setSelected={setSelected}
                        color={color}
                        layers={layers}
                        setLayers={setLayers}
                        mode={mode}/>
          <IonFabButton size="small" onClick={() => addText('Edit me')} style={{
              position: "absolute", top: "55px",
              right: "calc(var(--ion-safe-area-right, 0px))"
          }} placeholder={undefined}>
              <IonIcon size="small" icon={textOutline} placeholder={undefined}> </IonIcon>
          </IonFabButton>

          <IonFabButton size="small" onClick={() => moveUp()} style={{
              position: "absolute", top: "110px",
              right: "calc(var(--ion-safe-area-right, 0px))"
          }} disabled={!selected} placeholder={undefined}>
              <IonIcon size="small" icon={layersOutline} placeholder={undefined}> </IonIcon>
          </IonFabButton>

          <IonFabButton size="small" style={{
              position: "absolute", top: "165px",
              right: "calc(var(--ion-safe-area-right, 0px))"
          }} placeholder={undefined} color={color}>
              <input type="color"
                     className="colorPicker"
                     style={{padding: "0px"}}
                     onChange={(e)=> setColorDelayed(e.target.value)}/>
          </IonFabButton>

          <IonFabButton size="small" onClick={() => setMode(mode !== "drag" ? "drag" : "edit")} style={{
              position: "absolute", top: "220px",
              right: "calc(var(--ion-safe-area-right, 0px))"
          }} disabled={!selected} placeholder={undefined}>
              {
                  mode === 'drag' ?
                      <IonIcon size="small" icon={pencil} placeholder={undefined}> </IonIcon>
                      : <IonIcon size="small" icon={addOutline} placeholder={undefined}> </IonIcon>

              }
          </IonFabButton>

          <IonFabButton size="small" onClick={() => exportToGallery()} style={{
              position: "absolute", bottom: "calc(var(--offset-bottom, 0px) + 65px)",
              right: "calc(var(--ion-safe-area-right, 0px))"
          }} disabled={!layers.length} placeholder={undefined}>
              <IonIcon size="small" icon={saveOutline} placeholder={undefined}> </IonIcon>
          </IonFabButton>

          <IonFabButton size="small" onClick={() => zoomLayer(1)} style={{
              position: "absolute", top: "330px",
              right: "calc(var(--ion-safe-area-right, 0px))"
          }} disabled={!selected} placeholder={undefined}>
              <IonIcon size="small" icon={addOutline} placeholder={undefined}> </IonIcon>
          </IonFabButton>
          <IonFabButton size="small" onClick={() => zoomLayer(-1)} style={{
              position: "absolute", top: "385px",
              right: "calc(var(--ion-safe-area-right, 0px))"
          }} disabled={!selected} placeholder={undefined}>
              <IonIcon size="small" icon={removeOutline} placeholder={undefined}> </IonIcon>
          </IonFabButton>




          <IonFabButton size="small" onClick={() => toggleImageSelectorContainer()} style={{
              position: "absolute", bottom: "calc(var(--offset-bottom, 0px) + 10px)",
              right: "calc(var(--ion-safe-area-right, 0px))"
          }} placeholder={undefined}>
              <IonIcon size="small" icon={appsOutline} placeholder={undefined}> </IonIcon>
          </IonFabButton>


          <IonFabButton size="small" onClick={() => rotate(-90)} style={{
              position: "absolute", bottom: "calc(var(--offset-bottom, 0px) + 10px)",
              left: "calc(var(--ion-safe-area-left, 0) + 55px)"
          }} disabled={!selected} placeholder={undefined}>
              <IonIcon size="small" icon={returnUpBackOutline} placeholder={undefined}> </IonIcon>
          </IonFabButton>


          <IonFabButton color="danger" size="small" onClick={() => removeSelected()} style={{
              position: "absolute", bottom: "calc(var(--offset-bottom, 0px) + 10px)",
              left: "calc(var(--ion-safe-area-left, 0) + 137.5px)",
              display: selected ? 'block' : 'none'
          }} placeholder={undefined}>
              <IonIcon size="small" icon={trashBinOutline} placeholder={undefined}> </IonIcon>
          </IonFabButton>

          <IonFabButton size="small" onClick={() => rotate(90)} style={{
              position: "absolute", bottom: "calc(var(--offset-bottom, 0px) + 10px)",
              left: "calc(var(--ion-safe-area-left, 0px) + 220px)"
          }} disabled={!selected} placeholder={undefined}>
              <IonIcon size="small" icon={returnUpForwardOutline} placeholder={undefined}> </IonIcon>
          </IonFabButton>

          <div id={"footer"} style={{display:"none"}}>

              <IonFab vertical={"bottom"} horizontal={"end"} slot={"fixed"}
                      style={{right: 'calc(var(--ion-safe-area-right, 0px))', position: 'absolute'}}
                      placeholder={undefined}>
                  <IonFabButton size="small" placeholder={undefined} >
                      <IonIcon size="small" icon={ellipsisHorizontalOutline} placeholder={undefined}> </IonIcon>
                  </IonFabButton>
                  <IonFabList side="start" placeholder={undefined}>


                      <IonFabButton onClick={() => takePhoto()} placeholder={undefined}>
                          <IonIcon icon={cameraOutline} placeholder={undefined}> </IonIcon>
                      </IonFabButton>
                      <IonFabButton onClick={() => pickImageFromGallery()} placeholder={undefined}>
                          <IonIcon icon={imageOutline} placeholder={undefined}> </IonIcon>
                      </IonFabButton>

                      <IonFabButton size="small" onClick={() => toggleImageSelectorContainer()} placeholder={undefined}>
                          <IonIcon size="small" icon={closeOutline} placeholder={undefined}> </IonIcon>
                      </IonFabButton>
                      <IonFabButton size="small" onClick={() => toggleThumbnailContainer()} placeholder={undefined}>
                          <IonIcon size="small" icon={thumbnailContainerIcon === "up" ? caretUp : caretDown}
                                   placeholder={undefined}> </IonIcon>
                      </IonFabButton>

                  </IonFabList>
              </IonFab>
              <IonToolbar placeholder={undefined}>
                  <IonContent id="thumbnailContent" style={{display: "flex"}} placeholder={undefined}>

                      {
                          photos.map((photo, index) =>
                              <div key={index} className={"imageThumbnailFlex"}>
                                  <IonThumbnail placeholder={undefined}>
                                      <img src={photo.webviewPath} onClick={()=>imageOnClick(photo)} alt="" />
                                  </IonThumbnail>

                              </div>
                          ) }

                  </IonContent>
              </IonToolbar>
          </div>
      </IonContent>
        <IonFooter style={{display: "none"}} placeholder={undefined}>

        </IonFooter>
    </IonPage>
  );
};

export default ImageEditorComponent;
/*
* <IonActionSheet
              isOpen={!!photoToDelete}
              buttons={[{
                  text: 'Delete',
                  role: 'destructive',
                  icon: trash,
                  handler: () => {
                      if (photoToDelete) {
                          deletePhoto(photoToDelete);
                          setPhotoToDelete(undefined);
                      }
                  }
              }, {
                  text: 'Cancel',
                  icon: close,
                  role: 'cancel'
              }]}
              onDidDismiss={() => setPhotoToDelete(undefined)}
          />
          * */
