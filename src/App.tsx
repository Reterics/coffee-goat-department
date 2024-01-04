import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {images, square, triangle} from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import ImageEditorComponent from './pages/ImageEditorComponent';
import GalleryComponent from './pages/GalleryComponent';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {useExportedGallery} from "./components/usePhotoGallery";

setupIonicReact();

const App: React.FC = () => {
  const {gallery, loadSaved, exportImage} = useExportedGallery();

  return (
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route path="/home">
                <Tab1/>
              </Route>
              <Route path="/editor">
                <ImageEditorComponent galleryReload={loadSaved} exportImage={exportImage}/>
              </Route>
              <Route path="/gallery">
                <GalleryComponent gallery={gallery} loadSaved={loadSaved}/>
              </Route>
              <Route exact path="/">
                <Redirect to="/tab1"/>
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="tab1" href="/home">
                <IonIcon icon={triangle}/>
                <IonLabel>Home</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab2" href="/editor">
                <IonIcon icon={images}/>
                <IonLabel>Editor</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab3" href="/gallery">
                <IonIcon icon={square}/>
                <IonLabel>Gallery</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
  );
};

export default App;
