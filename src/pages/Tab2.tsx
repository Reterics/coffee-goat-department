import {
    IonCol,
    IonContent,
    IonFab,
    IonFabButton,
    IonGrid,
    IonHeader, IonIcon,
    IonImg,
    IonPage,
    IonRow,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';
import {usePhotoGallery, UserPhoto} from "../components/usePhotoGallery";
import {useEffect, useState} from "react";
import { camera } from 'ionicons/icons';

const Tab2: React.FC = () => {
    const {takePhoto,loadSaved,photos }  = usePhotoGallery();
    const [photoToDelete, setPhotoToDelete] = useState<UserPhoto>();
    useEffect(() => {
        loadSaved();
    }, []);
  // @ts-ignore
    // @ts-ignore
    return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
          <IonGrid>
              <IonRow>
                  {
                      photos.map((photo, index) =>
                      <IonCol key={index} size="6">
                          <IonImg src={photo.webviewPath} />
                      </IonCol>
                  ) }
              </IonRow>
          </IonGrid>
          <IonFab vertical={"bottom"} horizontal={"center"} slot={"fixed"}>
            <IonFabButton onClick={()=> takePhoto()}>
                <IonIcon icon={camera}> </IonIcon>
            </IonFabButton>
          </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
