import {IonContent, IonHeader, IonPage, IonThumbnail, IonTitle, IonToolbar} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './GalleryComponent.css';
import React from "react";
import {usePhotoGallery} from "../components/usePhotoGallery";

const GalleryComponent: React.FC = () => {
    const {takePhoto, loadSaved, photos, pickPhotoFromGallery} = usePhotoGallery('gallery');

    // @ts-ignore
    const openImage = (photo) => {

    }
    return (
    <IonPage placeholder={undefined}>
      <IonHeader placeholder={undefined}>
        <IonToolbar placeholder={undefined}>
          <IonTitle placeholder={undefined}>Tab 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen placeholder={undefined}>
        <IonHeader collapse="condense" placeholder={undefined}>
          <IonToolbar placeholder={undefined}>
            <IonTitle size="large" placeholder={undefined}>Image Gallery</IonTitle>
          </IonToolbar>
        </IonHeader>
          <div className="image-gallery">
              {
                  photos.map((photo, index) =>
                      <div key={index} className={"imageThumbnailFlex"}>
                          <IonThumbnail placeholder={undefined}>
                              <img src={photo.webviewPath} onClick={()=>openImage(photo)} alt="" />
                          </IonThumbnail>

                      </div>
                  )
              }
          </div>
      </IonContent>
    </IonPage>
  );
};

export default GalleryComponent;
