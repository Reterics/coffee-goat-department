//import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';

import {Capacitor, Plugins} from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { Directory, Filesystem } from '@capacitor/filesystem';
import {useState} from "react";
import {CameraResultType, CameraSource, Photo} from "@capacitor/camera";
import {isPlatform} from "@ionic/react";
import StorageManager from "./storageManager";

const { Camera  } = Plugins;

export interface UserPhoto{
    filepath:string;
    webviewPath?:string;
}

const PHOTO_STORAGE = 'photos';
export async function base64FromPath(path: string): Promise<string> {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject('method did not return a string');
            }
        };
        reader.readAsDataURL(blob);
    });
}

export function usePhotoGallery() {
    const [photos, setPhotos] = useState<UserPhoto[]>([]);
    let storageManager = new StorageManager('__coffee_goat_dp');

    const readBlobAsBase64 = (blob: Blob): Promise<string|null> => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function() {
                const result = reader.result;
                if (typeof result === 'string' || result === null) {
                    resolve(result);
                } else {
                    const enc = new TextDecoder("utf-8");
                    resolve(enc.decode(result));
                }
            };
            reader.onerror = () => {
                resolve(null);
            };
        });
    }
    const base64FileData = async (photo: Photo): Promise<string|null> => {
        let base64Data: string|null;
        // "hybrid" will detect Cordova or Capacitor;
        if (isPlatform('hybrid')) {
            const file = await Filesystem.readFile({
                path: photo.path!,
            });
            if (file.data instanceof Blob) {
                base64Data = await readBlobAsBase64(file.data);
            } else {
                base64Data = file.data;
            }
        } else {
            base64Data = await base64FromPath(photo.webPath!);
        }
        return base64Data;
    };

    const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto|null> => {
        const base64Data = await base64FileData(photo);
        if (!base64Data) {
            return null;
        }
        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data,
        });

        if (isPlatform('hybrid')) {
            // Display the new image by rewriting the 'file://' path to HTTP
            // Details: https://ionicframework.com/docs/building/webview#file-protocol
            return {
                filepath: savedFile.uri,
                webviewPath: Capacitor.convertFileSrc(savedFile.uri),
            };
        } else {
            // Use webPath to display the new image instead of base64 since it's
            // already loaded into memory
            return {
                filepath: fileName,
                webviewPath: photo.webPath,
            };
        }
    };

    const pickPhotoFromGallery = async () => {
        const result = await Camera.pickImages({
            quality: 100,
        });
        const newPhotos:UserPhoto[] = [];

        for (let i = 0; i < result.photos.length; i++){
            const photo = result.photos[i];
            // photo.webviewPath = photo.webPath;
            const fileName = new Date().getTime() + '.jpeg';
            const savedFileImage = await savePicture(photo, fileName);
            if (savedFileImage) {
                newPhotos.push(savedFileImage);
            }
        }
        photos.forEach(photo => {
            newPhotos.push(photo);
        });
        setPhotos(newPhotos);
        await storageManager.saveLocally(PHOTO_STORAGE, newPhotos);
        storageManager.saveLoadedKeyWithDelay();
    }


    const takePhoto = async () => {
        const photo = await Camera.getPhoto({
            quality: 100,
            // allowEditing: true,
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera
        });
        const fileName = new Date().getTime() + '.jpeg';
        const savedFileImage = await savePicture(photo, fileName);
        if (savedFileImage) {
            const newPhotos = [savedFileImage, ...photos];
            setPhotos(newPhotos);
            storageManager.saveLocally(PHOTO_STORAGE, newPhotos);
            storageManager.saveLoadedKeyWithDelay();
        }
    };

    const loadSaved = async () => {
        await storageManager.initStorage();
        const photosInPreferences = (await storageManager.get(PHOTO_STORAGE) || []) as UserPhoto[]; // Preferences.get({ key: PHOTO_STORAGE });

        //const photosInPreferences = (value ? JSON.parse(value) : []) as UserPhoto[];
        // If running on the web...
        if (!isPlatform('hybrid')) {
            for (let photo of photosInPreferences) {
                try {
                    const file = await Filesystem.readFile({
                        path: photo.filepath,
                        directory: Directory.Data
                    });
                    // Web platform only: Load the photo as base64 data
                    photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
                } catch (e) {
                    console.error(e);
                }

            }
        }
        setPhotos(photosInPreferences);
    };

    const deletePhoto = async (photo: UserPhoto) => {
        // Remove this photo from the Photos reference data array
        const newPhotos = photos.filter((p) => p.filepath !== photo.filepath);

        // Update photos array cache by overwriting the existing photo array
        await Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });

        // delete photo file from filesystem
        const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
        await Filesystem.deleteFile({
            path: filename,
            directory: Directory.Data,
        });
        setPhotos(newPhotos);
    };

    return{
        photos,
        takePhoto,
        savePicture,
        loadSaved,
        deletePhoto,
        pickPhotoFromGallery
    };
}


export function useExportedGallery() {
    const [gallery, setGallery] = useState<UserPhoto[]>([]);
    let storageManager = new StorageManager('gallery');


    const saveBase64Picture = async (dataUri: string, fileName: string): Promise<UserPhoto|null> => {
        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: dataUri,
            directory: Directory.Data,
        });

        if (isPlatform('hybrid')) {
            // Display the new image by rewriting the 'file://' path to HTTP
            // Details: https://ionicframework.com/docs/building/webview#file-protocol
            return {
                filepath: savedFile.uri,
                webviewPath: Capacitor.convertFileSrc(savedFile.uri),
            };
        } else {
            // Use webPath to display the new image instead of base64 since it's
            // already loaded into memory
            return {
                filepath: fileName,
                webviewPath: dataUri,
            };
        }
    };

    const exportImage = async (canvas: HTMLCanvasElement, name?: string) => {
        const fileName = new Date().getTime() + '.png';
        const dataUri = canvas.toDataURL()
        const savedFileImage = await saveBase64Picture(dataUri, fileName);
        if (savedFileImage) {
            const newPhotos = [savedFileImage, ...gallery];
            setGallery(newPhotos);
            storageManager.saveLocally(PHOTO_STORAGE, newPhotos);
            storageManager.saveLoadedKeyWithDelay();
        }
    }

    const loadSaved = async () => {
        await storageManager.initStorage();
        const photosInPreferences = (await storageManager.get(PHOTO_STORAGE) || []) as UserPhoto[]; // Preferences.get({ key: PHOTO_STORAGE });

        //const photosInPreferences = (value ? JSON.parse(value) : []) as UserPhoto[];
        // If running on the web...
        if (!isPlatform('hybrid')) {
            for (let photo of photosInPreferences) {
                try {
                    const file = await Filesystem.readFile({
                        path: photo.filepath,
                        directory: Directory.Data
                    });
                    // Web platform only: Load the photo as base64 data
                    photo.webviewPath = `data:image/png;base64,${file.data}`;
                } catch (e) {
                    console.error(e);
                }

            }
        }
        setGallery(photosInPreferences);
    };

    return{
        gallery,
        loadSaved,
        exportImage
    };
}

