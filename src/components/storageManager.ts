import {Drivers, Storage} from "@ionic/storage";

class StorageManager {
    private storage: Storage;
    private isLoaded: Boolean;
    private storageContainer: any;
    private timeout: NodeJS.Timeout | undefined;

    constructor() {
        this.storage = new Storage({
            name: '__coffee_goat_dp',
            driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
        });
        this.isLoaded = false;
        this.storageContainer = {};
    }

    public async initStorage () {
        await this.storage.create();
        this.isLoaded = true;
    }

    public getAllLoaded () {
        return Object.assign({}, this.storageContainer);
    }

    public async saveLoadedKey (key:string) {
        const value = this.storageContainer[key];
        if (!this.isLoaded) {
            console.log('Init Storage');
            await this.initStorage();
        }
        if (value && typeof value === "object") {
            // await this.storage.set(key, JSON.stringify(value));
            await this.storage.set(key, value);
        } else {
            await this.storage.set(key, value);
        }
    }

    public saveLoadedKeyWithDelay (seconds:number = 2) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(async () => {
            await this.saveAllLoaded();
        }, seconds * 1000);
    }

    public async saveAllLoaded () {
        const keys = Object.keys(this.storageContainer);
        for (let i = 0; i < keys.length; i++){
            const key = keys[i];
            console.log('Save: ', key)
            await this.saveLoadedKey(key);
        }
    }

    public async get(key:string) {
        if (Object.keys(this.storageContainer).includes(key)) {
            return this.storageContainer[key];
        }
        if (!this.isLoaded) {
            await this.initStorage();
        }
        this.storageContainer[key] = await this.storage.get(key);
        if (typeof this.storageContainer[key] === 'string' && (this.storageContainer[key].startsWith('[') ||
            this.storageContainer[key].startsWith('{'))) {
            try {
                this.storageContainer[key] = JSON.parse(this.storageContainer[key]);
            }catch (e) {

            }
        }
        return this.storageContainer[key];
    }

    public saveLocally(key:string, value:any) {
        this.storageContainer[key] = value;
    }

    public async saveAndSync(key:string, value:any) {
        this.saveLocally(key, value);
        await this.saveLoadedKey(key);
    }
}


export default StorageManager;
