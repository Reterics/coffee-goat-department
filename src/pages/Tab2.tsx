import {
    IonActionSheet,
    IonButton,
    IonCol,
    IonContent,
    IonFab,
    IonFabButton, IonFabList, IonFooter,
    IonGrid,
    IonHeader, IonIcon,
    IonImg,
    IonPage,
    IonRow, IonThumbnail,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './Tab2.css';
import {usePhotoGallery, UserPhoto} from "../components/usePhotoGallery";
import {useEffect, useState} from "react";
import {
    addOutline, appsOutline, camera, cameraOutline, caretDown, caretUp, close, closeOutline, copyOutline,
    ellipsisHorizontalOutline, imageOutline,
    layersOutline,
    move,
    pencil,
    removeOutline,
    returnUpBackOutline,
    returnUpForwardOutline,
    textOutline, trash, trashBinOutline
} from 'ionicons/icons';
import MainImageEditor from "../components/editor";
let mainImageEditor:MainImageEditor;
const Tab2: React.FC = () => {
    const {takePhoto,loadSaved,photos,pickPhotoFromGallery,deletePhoto }  = usePhotoGallery();

    if (!mainImageEditor) {
        mainImageEditor = new MainImageEditor()
    }
    const [photoToDelete, setPhotoToDelete] = useState<UserPhoto>();
    const [thumbnailContainerIcon, setThumbnailContainerIcon] = useState("up");
    useEffect(() => {
        loadSaved().finally(()=>{
            mainImageEditor.init("#editorCanvas");
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
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Meme/Image Editor</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          <div id={"editorCanvas"}>

          </div>
          <IonFabButton size="small" onClick={()=>mainImageEditor.addTextElement()} style={{position:"absolute", top: "55px",
              right: "calc(var(--ion-safe-area-right, 0px))"}}>
              <IonIcon size="small" icon={textOutline}> </IonIcon>
          </IonFabButton>

          <IonFabButton size="small" onClick={()=>mainImageEditor.moveUpper()} style={{position:"absolute", top: "110px",
              right: "calc(var(--ion-safe-area-right, 0px))"}}>
              <IonIcon size="small" icon={layersOutline}> </IonIcon>
          </IonFabButton>

          <IonFabButton size="small" onClick={()=>mainImageEditor.switchToDrag()} style={{position:"absolute", top: "165px",
              right: "calc(var(--ion-safe-area-right, 0px))"}}>
              <IonIcon size="small" icon={move}> </IonIcon>
          </IonFabButton>

          <IonFabButton size="small" onClick={()=>mainImageEditor.switchToEdit()} style={{position:"absolute", top: "220px",
              right: "calc(var(--ion-safe-area-right, 0px))"}}>
              <IonIcon size="small" icon={pencil}> </IonIcon>
          </IonFabButton>

          <IonFabButton size="small" onClick={()=>mainImageEditor.switchToEdit()} style={{position:"absolute", top: "330px",
              right: "calc(var(--ion-safe-area-right, 0px))"}}>
              <IonIcon size="small" icon={addOutline}> </IonIcon>
          </IonFabButton>
          <IonFabButton size="small" onClick={()=>mainImageEditor.switchToEdit()} style={{position:"absolute", top: "385px",
              right: "calc(var(--ion-safe-area-right, 0px))"}}>
              <IonIcon size="small" icon={removeOutline}> </IonIcon>
          </IonFabButton>




          <IonFabButton size="small" onClick={() => toggleImageSelectorContainer()} style={{position:"absolute", bottom: "calc(var(--offset-bottom, 0px) + 10px)",
              right: "calc(var(--ion-safe-area-right, 0px))"}}>
              <IonIcon size="small" icon={appsOutline}> </IonIcon>

          </IonFabButton>


          <IonFabButton size="small" onClick={()=>mainImageEditor.switchToEdit()} style={{position:"absolute", bottom: "calc(var(--offset-bottom, 0px) + 10px)",
              left: "calc(var(--ion-safe-area-left, 0) + 55px)"}}>
              <IonIcon size="small" icon={returnUpBackOutline}> </IonIcon>
          </IonFabButton>


          <IonFabButton color="danger" size="small" onClick={()=>mainImageEditor.switchToEdit()} style={{position:"absolute", bottom: "calc(var(--offset-bottom, 0px) + 10px)",
              left: "calc(var(--ion-safe-area-left, 0) + 137.5px)"}}>
              <IonIcon size="small" icon={trashBinOutline}> </IonIcon>
          </IonFabButton>

          <IonFabButton size="small" onClick={()=>mainImageEditor.switchToEdit()} style={{position:"absolute", bottom: "calc(var(--offset-bottom, 0px) + 10px)",
              left: "calc(var(--ion-safe-area-left, 0px) + 220px)"}}>
              <IonIcon size="small" icon={returnUpForwardOutline}> </IonIcon>
          </IonFabButton>

          <div id={"footer"} style={{display:"none"}}>

              <IonFab vertical={"bottom"} horizontal={"end"} slot={"fixed"} style={{right:'calc(var(--ion-safe-area-right, 0px))', position: 'absolute'}}>
                  <IonFabButton size="small" >
                      <IonIcon size="small" icon={ellipsisHorizontalOutline}> </IonIcon>
                  </IonFabButton>
                  <IonFabList side="start">


                      <IonFabButton onClick={()=> takePhoto()}>
                          <IonIcon icon={cameraOutline}> </IonIcon>
                      </IonFabButton>
                      <IonFabButton onClick={()=> pickImageFromGallery()}>
                          <IonIcon icon={imageOutline}> </IonIcon>
                      </IonFabButton>

                      <IonFabButton size="small" onClick={()=> toggleImageSelectorContainer()}>
                          <IonIcon size="small" icon={closeOutline}> </IonIcon>
                      </IonFabButton>
                      <IonFabButton size="small" onClick={()=> toggleThumbnailContainer()}>
                          <IonIcon size="small" icon={thumbnailContainerIcon === "up" ? caretUp : caretDown}> </IonIcon>
                      </IonFabButton>

                  </IonFabList>
              </IonFab>
              <IonToolbar>
                  <IonContent id="thumbnailContent" style={{ display:"flex"}}>

                      {
                          photos.map((photo, index) =>
                              <div key={index} className={"imageThumbnailFlex"}>
                                  <IonThumbnail>
                                      <img src={photo.webviewPath} onClick={()=>imageOnClick(photo)}/>
                                  </IonThumbnail>

                              </div>
                          ) }

                  </IonContent>
              </IonToolbar>
          </div>
      </IonContent>
        <IonFooter style={{display:"none"}}>

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
