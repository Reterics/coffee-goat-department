import {
    IonContent, IonFab, IonFabButton, IonFabList,
    IonHeader, IonIcon, IonPage, IonThumbnail,
    IonTitle, IonToolbar
} from '@ionic/react';
import './ImageEditorComponent.css';
import {usePhotoGallery, UserPhoto} from "../components/usePhotoGallery";
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
import {SideButton} from "../components/gui/SideButton";


let _colorTimeout:NodeJS.Timeout|number|undefined|null|string;
const ImageEditorComponent = ({galleryReload, exportImage}: {galleryReload:Function, exportImage:Function}): JSX.Element => {
    const {takePhoto, loadSaved, photos, pickPhotoFromGallery} = usePhotoGallery();

    const [thumbnailContainerIcon, setThumbnailContainerIcon] = useState("up");
    const [color, setColor] = useState("black");
    const [layers, setLayers] = useState<LayerObject[]>([]);
    const [mode, setMode] = useState<EditorMode>("drag");
    const [selected, setSelected] = useState<LayerObject|undefined>(undefined);
    const [staticCanvas, setStaticCanvas] = useState<HTMLCanvasElement|null>(null);

    const [imageSelector, setImageSelector] = useState<boolean>(false);
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
        setThumbnailContainerIcon(thumbnailContainerIcon === "down" ? "up" : "down");
    }

    const pickImageFromGallery = async () => {
        await pickPhotoFromGallery();
        setImageSelector(!imageSelector);
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
        setImageSelector(!imageSelector);
        if (thumbnailContainerIcon === "down") {
            setThumbnailContainerIcon("up");
        }
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
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Meme/Image Editor</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={false} scrollX={false}>
          <CanvasEditor staticCanvas={staticCanvas}
                        selected={selected}
                        setSelected={setSelected}
                        setMode={setMode}
                        color={color}
                        layers={layers}
                        setLayers={setLayers}
                        mode={mode}/>


          <SideButton
              onClick={() => addText('Edit me')}
              position={'top-right'}
              order={1}
              icon={textOutline}
          />

          <SideButton
              onClick={() => moveUp()}
              disabled={!selected}
              position={'top-right'}
              order={2}
              icon={layersOutline}
          />

          <SideButton
              onClick={() => addText('Edit me')}
              position={'top-right'}
              order={3}
              color={color}
          >
              <input type="color"
                     className="colorPicker"
                     style={{padding: "0px"}}
                     onChange={(e)=> setColorDelayed(e.target.value)}/>
          </SideButton>



          <SideButton
              onClick={() => setMode(mode !== "drag" ? "drag" : "edit")}
              order={4}
              disabled={!selected}
              position={'top-right'}
          >
              {
                  mode === 'drag' ?
                      <IonIcon size="small" icon={pencil}> </IonIcon>
                      : <IonIcon size="small" icon={addOutline}> </IonIcon>

              }
          </SideButton>

          <SideButton
              onClick={() => zoomLayer(1)}
              order={5}
              disabled={!selected}
              position={'top-right'}
              icon={addOutline}
          />
          <SideButton
              onClick={() => zoomLayer(-1)}
              order={6}
              disabled={!selected}
              position={'top-right'}
              icon={removeOutline}
          />

          <SideButton
              onClick={() => exportToGallery()}
              order={3}
              disabled={!layers.length}
              position={'bottom-right'}
              icon={saveOutline}
          />
          <SideButton
              onClick={() => setImageSelector(!imageSelector)}
              order={1}
              position={'bottom-right'}
              icon={appsOutline}
          />


          <IonFabButton size="small" onClick={() => rotate(-90)} style={{
              position: "absolute", bottom: "calc(var(--offset-bottom, 0px) + 10px)",
              left: "calc(var(--ion-safe-area-left, 0) + 55px)"
          }} disabled={!selected}>
              <IonIcon size="small" icon={returnUpBackOutline}> </IonIcon>
          </IonFabButton>


          <IonFabButton color="danger" size="small" onClick={() => removeSelected()} style={{
              position: "absolute", bottom: "calc(var(--offset-bottom, 0px) + 10px)",
              left: "calc(var(--ion-safe-area-left, 0) + 137.5px)",
              display: selected ? 'block' : 'none'
          }}>
              <IonIcon size="small" icon={trashBinOutline}> </IonIcon>
          </IonFabButton>

          <IonFabButton size="small" onClick={() => rotate(90)} style={{
              position: "absolute", bottom: "calc(var(--offset-bottom, 0px) + 10px)",
              left: "calc(var(--ion-safe-area-left, 0px) + 220px)"
          }} disabled={!selected}>
              <IonIcon size="small" icon={returnUpForwardOutline}> </IonIcon>
          </IonFabButton>

          {imageSelector && <SideButton
              onClick={() => setImageSelector(!imageSelector)}
              order={2}
              position={'bottom-right'}
              icon={closeOutline}
          />}
          <div style={{display:imageSelector ? "block" : "none"}}>

              <IonFab vertical={"bottom"} horizontal={"end"} slot={"fixed"}
                      activated={thumbnailContainerIcon === "down" ? true : undefined}
                      style={{right: 'calc(var(--ion-safe-area-right, 0px))', position: 'absolute',
                          bottom: "calc(var(--offset-bottom, 0px) + 10px"}}
                     >
                  <IonFabButton size="small" >
                      <IonIcon size="small" icon={ellipsisHorizontalOutline}> </IonIcon>
                  </IonFabButton>
                  <IonFabList side="start" >

                      <IonFabButton onClick={() => takePhoto()}>
                          <IonIcon icon={cameraOutline}> </IonIcon>
                      </IonFabButton>
                      <IonFabButton onClick={() => pickImageFromGallery()}>
                          <IonIcon icon={imageOutline}> </IonIcon>
                      </IonFabButton>
                      <IonFabButton size="small" onClick={(e) => toggleThumbnailContainer()}>
                          <IonIcon size="small" icon={thumbnailContainerIcon === "up" ? caretUp : caretDown}/>
                      </IonFabButton>
                  </IonFabList>
              </IonFab>
              <IonToolbar style={{
                  zIndex: 901,
                  bottom:thumbnailContainerIcon === "up" ? '0' : '50vh'
              }}>
                  <IonContent id="thumbnailContent" style={{
                      display: "flex",
                      height:thumbnailContainerIcon === "up" ? '0' : '60vh'
                  }}>
                      {
                          photos.map((photo, index) =>
                              <div key={index} className={"imageThumbnailFlex"}>
                                  <IonThumbnail>
                                      <img src={photo.webviewPath} onClick={()=>imageOnClick(photo)} alt="" />
                                  </IonThumbnail>

                              </div>
                          ) }

                  </IonContent>
              </IonToolbar>
          </div>
      </IonContent>
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
