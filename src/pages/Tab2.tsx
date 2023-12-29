import {
    IonContent, IonFab, IonFabButton, IonFabList, IonFooter,
    IonHeader, IonIcon, IonPage, IonThumbnail,
    IonTitle, IonToolbar
} from '@ionic/react';
import './Tab2.css';
import {usePhotoGallery, UserPhoto} from "../components/usePhotoGallery";
import React, {useEffect, useState} from "react";
import {
    addOutline, appsOutline, cameraOutline, caretDown, caretUp, closeOutline,
    ellipsisHorizontalOutline, imageOutline,
    layersOutline,
    move,
    pencil,
    removeOutline,
    returnUpBackOutline,
    returnUpForwardOutline,
    textOutline, trashBinOutline
} from 'ionicons/icons';
import MainImageEditor from "../components/editor";
let mainImageEditor:MainImageEditor;
const Tab2: React.FC = () => {
    const {takePhoto, loadSaved, photos, pickPhotoFromGallery, deletePhoto} = usePhotoGallery();

    if (!mainImageEditor) {
        mainImageEditor = new MainImageEditor()
    }
    const [photoToDelete, setPhotoToDelete] = useState<UserPhoto>();
    const [thumbnailContainerIcon, setThumbnailContainerIcon] = useState("up");

    const [selected, setSelected] = useState<HTMLElement|undefined>(undefined)
    useEffect(() => {
        loadSaved().finally(()=>{
            mainImageEditor.init("#editorCanvas", setSelected);
            // mainImageEditor.applyMultiTouchRotationFeature();
        });
    }, []);

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
        mainImageEditor.addImageElement(photo.webviewPath || "");
        toggleImageSelectorContainer();
    }
    // @ts-ignore
    return (
    <IonPage placeholder={undefined}>
      <IonHeader placeholder={undefined}>
        <IonToolbar placeholder={undefined}>
          <IonTitle placeholder={undefined}>Meme/Image Editor</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen placeholder={undefined}>
          <div id={"editorCanvas"}>

          </div>
          <IonFabButton size="small" onClick={() => mainImageEditor.addTextElement()} style={{
              position: "absolute", top: "55px",
              right: "calc(var(--ion-safe-area-right, 0px))"
          }} placeholder={undefined}>
              <IonIcon size="small" icon={textOutline} placeholder={undefined}> </IonIcon>
          </IonFabButton>

          <IonFabButton size="small" onClick={() => mainImageEditor.moveUpper()} style={{
              position: "absolute", top: "110px",
              right: "calc(var(--ion-safe-area-right, 0px))"
          }} placeholder={undefined}>
              <IonIcon size="small" icon={layersOutline} placeholder={undefined}> </IonIcon>
          </IonFabButton>

          <IonFabButton size="small" onClick={() => mainImageEditor.switchToDrag()} style={{
              position: "absolute", top: "165px",
              right: "calc(var(--ion-safe-area-right, 0px))"
          }} placeholder={undefined}>
              <IonIcon size="small" icon={move} placeholder={undefined}> </IonIcon>
          </IonFabButton>

          <IonFabButton size="small" onClick={() => mainImageEditor.switchToEdit()} style={{
              position: "absolute", top: "220px",
              right: "calc(var(--ion-safe-area-right, 0px))"
          }} placeholder={undefined}>
              <IonIcon size="small" icon={pencil} placeholder={undefined}> </IonIcon>
          </IonFabButton>

          <IonFabButton size="small" onClick={() => mainImageEditor.switchToEdit()} style={{
              position: "absolute", top: "330px",
              right: "calc(var(--ion-safe-area-right, 0px))"
          }} placeholder={undefined}>
              <IonIcon size="small" icon={addOutline} placeholder={undefined}> </IonIcon>
          </IonFabButton>
          <IonFabButton size="small" onClick={() => mainImageEditor.switchToEdit()} style={{
              position: "absolute", top: "385px",
              right: "calc(var(--ion-safe-area-right, 0px))"
          }} placeholder={undefined}>
              <IonIcon size="small" icon={removeOutline} placeholder={undefined}> </IonIcon>
          </IonFabButton>




          <IonFabButton size="small" onClick={() => toggleImageSelectorContainer()} style={{
              position: "absolute", bottom: "calc(var(--offset-bottom, 0px) + 10px)",
              right: "calc(var(--ion-safe-area-right, 0px))"
          }} placeholder={undefined}>
              <IonIcon size="small" icon={appsOutline} placeholder={undefined}> </IonIcon>

          </IonFabButton>


          <IonFabButton size="small" onClick={() => mainImageEditor.switchToEdit()} style={{
              position: "absolute", bottom: "calc(var(--offset-bottom, 0px) + 10px)",
              left: "calc(var(--ion-safe-area-left, 0) + 55px)"
          }} placeholder={undefined}>
              <IonIcon size="small" icon={returnUpBackOutline} placeholder={undefined}> </IonIcon>
          </IonFabButton>


          <IonFabButton color="danger" size="small" onClick={() => mainImageEditor.removeSelected()} style={{
              position: "absolute", bottom: "calc(var(--offset-bottom, 0px) + 10px)",
              left: "calc(var(--ion-safe-area-left, 0) + 137.5px)",
              display: selected ? 'block' : 'none'
          }} placeholder={undefined}>
              <IonIcon size="small" icon={trashBinOutline} placeholder={undefined}> </IonIcon>
          </IonFabButton>

          <IonFabButton size="small" onClick={() => mainImageEditor.switchToEdit()} style={{
              position: "absolute", bottom: "calc(var(--offset-bottom, 0px) + 10px)",
              left: "calc(var(--ion-safe-area-left, 0px) + 220px)"
          }} placeholder={undefined}>
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
                                      <img src={photo.webviewPath} onClick={()=>imageOnClick(photo)}/>
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

export default Tab2;
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
