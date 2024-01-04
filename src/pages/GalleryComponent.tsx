import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonModal,} from '@ionic/react';
import './GalleryComponent.css';
import React, {useRef, useEffect, useState} from "react";
import {UserPhoto} from "../components/usePhotoGallery";

const GalleryComponent = ({gallery, loadSaved}: {gallery:UserPhoto[], loadSaved:Function}): JSX.Element => {
    const page = useRef(null);
    const [currentImage, setCurrentImage] = useState<string|undefined>(undefined);

    useEffect(() => {
        void loadSaved()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function canDismiss(data?: any, role?: string) {
        return role !== 'gesture';
    }
    // @ts-ignore
    const openImage = (photo) => {
        setCurrentImage(photo.webviewPath)
    }
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
          <IonModal isOpen={!!currentImage}  trigger="open-modal" canDismiss={canDismiss}>
              <IonHeader>
                  <IonToolbar>
                      <IonTitle>Image Viewer</IonTitle>
                      <IonButtons slot="end">
                          <IonButton onClick={() => setCurrentImage(undefined)}>Close</IonButton>
                      </IonButtons>
                  </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">
                  <img src={currentImage} alt="" className="modal-image"/>

              </IonContent>
          </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default GalleryComponent;
