import {IonContent, IonHeader, IonPage, IonThumbnail, IonTitle, IonToolbar} from '@ionic/react';
import './GalleryComponent.css';
import React, {useEffect} from "react";
import {useExportedGallery, UserPhoto} from "../components/usePhotoGallery";

const GalleryComponent = ({gallery, loadSaved}: {gallery:UserPhoto[], loadSaved:Function}): JSX.Element => {

    useEffect(() => {
        void loadSaved()
    }, []);
    // @ts-ignore
    const openImage = (photo) => {

    }
    return (
    <IonPage placeholder={undefined}>
      <IonHeader placeholder={undefined}>
        <IonToolbar placeholder={undefined}>
          <IonTitle placeholder={undefined}>Image Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen placeholder={undefined}>
          <div className="image-gallery">
              {
                  gallery.map((photo, index) =>
                      <div key={index} className={"thumbnail-image-outer"}>
                          <img src={photo.webviewPath} onClick={()=>openImage(photo)} alt="" className="thumbnail-image"/>
                      </div>
                  )
              }
          </div>
      </IonContent>
    </IonPage>
  );
};

export default GalleryComponent;
