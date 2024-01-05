import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonModal,
    IonPage,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import './GalleryComponent.css';
import React, {useEffect, useRef, useState} from "react";
import {UserPhoto} from "../components/usePhotoGallery";
import {download, share} from "ionicons/icons";
import {Share} from '@capacitor/share';

const GalleryComponent = ({gallery, loadSaved}: {gallery:UserPhoto[], loadSaved:Function}): JSX.Element => {
    const page = useRef(null);
    const [currentImage, setCurrentImage] = useState<UserPhoto|undefined>(undefined);

    useEffect(() => {
        void loadSaved()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function canDismiss(data?: any, role?: string) {
        return role !== 'gesture';
    }
    const getFileNameFromPath = (filePath: string) => {
        const pathSegments = filePath.split('/');
        return pathSegments[pathSegments.length - 1];
    };

    // @ts-ignore
    const openImage = (photo) => {
        setCurrentImage(photo)
    };

    const downloadImage = () => {
        if (currentImage && currentImage.webviewPath) {
            const downloadLink = document.createElement('a');
            downloadLink.href = currentImage.webviewPath;
            downloadLink.download = currentImage.filepath ? getFileNameFromPath(currentImage.filepath) : "image.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    const shareImage = async () => {
        if (currentImage && currentImage.webviewPath) {
            const imagePath = currentImage.webviewPath;
            const name = currentImage.filepath ? getFileNameFromPath(currentImage.filepath) : "image.png";
            // setCurrentImage(undefined)
            const blob = await (await fetch(imagePath)).blob();
            const file = new File([blob], name, { type: blob.type });
            // TODO: Handle canShare issues
            if (!navigator || typeof navigator.share !== "function") {
                return Share.share({
                    files: [currentImage.filepath],
                });/*.catch(e=>{
                    console.error(e);
                });*/
            }
            await navigator.share({
                files: [file],
            })
        }
    };

    return (
    <IonPage ref={page}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Image Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          <div className="image-gallery">
              {
                  gallery.map((photo, index) =>
                      <div key={index} className={"thumbnail-image-outer"}>
                          <img src={photo.webviewPath} onClick={()=>openImage(photo)} alt="" className="thumbnail-image"/>
                      </div>
                  )
              }
          </div>
          <IonModal isOpen={!!currentImage} canDismiss={canDismiss}>
              <IonHeader>
                  <IonToolbar>
                      <IonButtons slot="start">
                          <IonButton onClick={() => downloadImage()}>
                              Download
                              <IonIcon slot="end" icon={download}></IonIcon>
                          </IonButton>
                          <IonButton onClick={() => shareImage()}>
                              Share
                              <IonIcon slot="end" icon={share}></IonIcon>
                          </IonButton>
                      </IonButtons>
                      <IonButtons slot="end">
                          <IonButton onClick={() => setCurrentImage(undefined)}>Close</IonButton>
                      </IonButtons>
                  </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding" style={{webkitUserSelect: "auto"}}>
                  <img id="modal-image" src={currentImage?.webviewPath} alt="" className="modal-image"/>
              </IonContent>
          </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default GalleryComponent;
