import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';

const Tab1: React.FC = () => {
  return (
    <IonPage placeholder={undefined}>
      <IonHeader placeholder={undefined}>
        <IonToolbar placeholder={undefined}>
          <IonTitle placeholder={undefined}>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen placeholder={undefined}>
        <IonHeader collapse="condense" placeholder={undefined}>
          <IonToolbar placeholder={undefined}>
            <IonTitle size="large" placeholder={undefined}>Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Tab 1 page" />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
