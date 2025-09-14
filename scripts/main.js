// custom handles

// Custom handle implamentation
class AppUserHandle extends EstreHandle {

    // constants


    // statics
    static #onClickSignOutRef = () => {};
    static #onClickSignOut = this.#onClickSignOutRef;
    static #onReleaseInfoRef = (handle) => {};
    static #onReleaseInfo = this.#onReleaseInfoRef;

    static setOn(onClickSignOut = this.#onClickSignOutRef, onReleaseInfo = this.#onReleaseInfoRef) {
        if (!this.handleCommitted) {
            this.#onClickSignOut = onClickSignOut;
            this.#onReleaseInfo = onReleaseInfo;
        }
    }


    // open property

    
    // enclosed property


    // getter and setter



    constructor(element, host) {
        super(element, host);
    }

    release() {
        super.release();
    }

    init() {
        super.init();

        this.releaseInfo();

        this.setEvent();
    }

    setEvent() {
        let inst = this;

        this.$bound.find(cls + "sign_out").click(function(e) {
            e.preventDefault();

            AppUserHandle.#onClickSignOut();

            return false;
        });
    }

    releaseInfo() {
        AppUserHandle.#onReleaseInfo(this);
    }
}

// Register my own handle
EstreHandle.registerCustomHandle("appUserHandle", ".app_user_handle", AppUserHandle);




// Customize lifecycle actions for handles(component/container/article) on own pages
class AppPagesProvider {

    // Register my own external PID (page alias)
    static get pages() { return {
        //if writed html in sections in mains(#staticDoc and #instantDoc), can you show PIDs by command "pageManager.pages" on JS console

        //"own shorter id": "PID",

        "wait": "$i&b=wait",

        "home": "$s&m=home",

        "tab1": "$s&m=tab1",
        "tab1Next": "$i&m=tab1#root@tab1_next",

        "tab2": "$s&m=tab2",
        "tab2Next": "$i&m=paybill#root@tab2_next",
        
        "activity1": "$s&m=activity1",

        "activity2": "$i&m=activity2",

        "": "",
    }; }


    // properties
    #pageManager = null;
    get pageManager() { return this.#pageManager; }
    #actionManager = null;
    get actionManager() { return this.#actionManager; }
    #actionHandler = null;
    get actionHandler() { return this.#actionHandler; }
    #sessionManager = null;
    get sessionManager() { return this.#sessionManager; }


    constructor(pageManager, actionManager, actionHandler, sessionManager) {
        this.#pageManager = pageManager;
        this.#actionManager = actionManager;
        this.#actionHandler = actionHandler;
        this.#sessionManager = sessionManager;
    }

    
    //declare handler of pages

    //"own shorter id" = page handler implementation class from extends EstrePageHandler or empty class(function type constructor)
    "wait" = class extends EstrePageHandler {};

    "home" = class extends EstrePageHandler {};

    "tab1" = class extends EstrePageHandler {};
    "tab1Next" = class extends EstrePageHandler {};

    "attend_success" = class extends EstrePageHandler {};
    
    "tab2" = class extends EstrePageHandler {};
    "tab2Next" = class extends EstrePageHandler {
        onOpen(handle) {
        };
        
        onBack(handle) {
            return handle.close();
        }
    };

    "activity1" = class extends EstrePageHandler {
        onOpen(handle) {
            appActionHandler.somethingDoWhileAnything();
        }
        
        onBack(handle) {
            return handle.close();
        }
    };

    "activity2" = class extends EstrePageHandler {
        onOpen(handle) {
            this.myOwnFunction();
        }
        
        onBack(handle) {
            return handle.close();
        }

        myOwnFunction() {
            //do anything
        }
    };

}


// Implement example of my own custom page handler
class AppPageManager extends EstreUiCustomPageManager {

    // class property


    // static methods


    // constants
    

    // instance property
    #actionHandler = null;
    get actionHandler() { return this.#actionHandler; }

    constructor(actionHandler) {
        super();
        this.#actionHandler = actionHandler;
    }


    /**
     * * must be initialized estreUi before call 
     */
    init(extPidMap, pageHandlers) {

        return super.init(extPidMap, pageHandlers);
    }

}

// Implement example of my own custom action handler
class AppActionManager {

    // class property


    // static methods


    // constants


    // instance property
    #serviceWorkerHandler = null;
    get swHandler() { return this.#serviceWorkerHandler; }
    #swUpdateChecker = null;
    #swUpdateBeforeAsk = t; // PWA update method selection (true: method 1, false: method 2)

    #pageManager = null;
    get pageManager() { return this.#pageManager; }
    #sessionManager = null;
    get sessionManager() { return this.#sessionManager; }
    #actionHandler = null;
    get actionHandler() { return this.#actionHandler; }

    get isApp() { return window.app != n; }

    constructor(pageManager, sessionManager, actionHandler) {
        this.#pageManager = pageManager;
        this.#sessionManager = sessionManager;
        this.#actionHandler = actionHandler;
    }

    init(serviceWorkerHandler) {
        this.#serviceWorkerHandler = serviceWorkerHandler;

        this.initServiceWorker();
    }

    initServiceWorker() {
        const swHandler = this.swHandler;

        const waiting = swHandler.waiting;
        if (waiting != n) this.onWaitingNewServiceWorker(waiting);

        swHandler.setOnInstallingListener(worker => this.onInstallingNewServiceWorker(worker));
        swHandler.setOnWaitingListener(worker => this.onWaitingNewServiceWorker(worker));
        swHandler.setOnActivatedNewerListener(worker => this.onActivatedNewServiceWorker(worker));
        swHandler.setOnControllerChangeListener(event => this.onControllerChangedToNewServiceWorker(event));
    }

    async onReadyEstreUi() {
        const swHandler = this.swHandler;
        const installing = swHandler.installing;
        const waiting = swHandler.waiting;
        const activated = swHandler.activated;

        // Force press service worker stuck in still installing
        if (installing != n && installing.state == "installing") {
            navigator.serviceWorker.ready.then(reg => {
                const worker = reg?.active;
                console.log("Force activate installing service worker: ", worker);
            });
        }

        // Force activate waiting service worker
        if (waiting != n && waiting != swHandler.controller) {
            const controller = swHandler.controller;
            let handled = f;
            if (controller != n) { // not the first install
                handled = t;
                await swHandler.clearCache(controller);
                waiting.addEventListener("statechange", e => {
                    if (waiting.state == "activated") {
                        console.log("Apply activated service worker by reload: ", waiting);
                        location.reload();
                    }
                });
            }
            swHandler.skipWaiting(waiting);
            return handled;
        }

        // Force apply activated but not controlling service worker
        if (activated != n && activated != swHandler.controller) {
            const handled = await postPromise(resolve => {
                setTimeout(async _ => {
                    if (activated != swHandler.controller) {
                        if (swHandler.controller != n && (await swHandler.getApplicationCount()) < 2) {
                            window.location.reload();
                            resolve(t);
                            return;
                        }
                        this.onWaitingAnotherClientToClose(activated);
                        resolve(f);
                    } else resolve(f);
                }, 1000); // wait for a while to check apply to main controller
            });
            if (handled) return t;
        }

        if (swHandler.controller != n) this.setServiceWorkerControllerEvents();
    }

    async onInstallingNewServiceWorker(worker) {
        if (this.#swUpdateBeforeAsk) {
            // vv Method 1: Install new service worker immediately and prompt user to restart app when activated new service worker
            if (!swHandler.isInitialSetup) {
                this.controller?.let(it => this.clearCache(it));
                note("Now installing new version of app...");
            }
        }
    }

    async onWaitingNewServiceWorker(worker) {
        const swHandler = this.swHandler;

        if (this.#swUpdateBeforeAsk) {
            // vv Method 1: Install new service worker immediately and prompt user to restart app when activated new service worker
            if (!swHandler.isInitialSetup) {
                swHandler.skipWaiting(worker);
            }
        } else {
            // vv Method 2: Wait activate until user accepts to install new service worker and apply immediately when activated new service worker
            const isNewNative = await this.checkPostNewNativeAppVersion(worker);
            if (!isNewNative && !swHandler.isInitialSetup) estreToastConfirm({
                title: "New version of app is available",
                message: "A new version of the app is available<br />Would you like to update to the new version now?<br /><span class=\"font_sr12\">* The new version will be automatically applied when the app is restarted after closing<br />** Some functions may not work properly if the new version is not applied</span>",
                positive: "Update now",
                negative: "Later",
                callbackPositive: async _ => {
                    await swHandler.controller?.let(it => this.clearCache(it));
                    swHandler.skipWaiting(worker);
                },
            });
        }
    }

    async onActivatedNewServiceWorker(worker) {
        const swHandler = this.swHandler;

        if (this.#swUpdateBeforeAsk) {
            // vv Method 1: Install new service worker immediately and prompt user to restart app when activated new service worker
            const isNewNative = await this.checkPostNewNativeAppVersion(worker);
            if (!isNewNative && !swHandler.isInitialSetup) estreToastConfirm({
                title: "Request to restart app",
                message: "A new version of the app is ready<br />To apply it, the app needs to be restarted<br />Would you like to restart now?<br /><span class=\"font_sr12\">* The new version will be automatically applied when the app is restarted after closing<br />** Some functions may not work properly if the new version is not applied<br />When new version is installed to be reloaded every app window</span>",
                positive: "Apply now",
                negative: "Later",
                callbackPositive: _ => {
                    swHandler.clientsClaim(worker);
                    location.reload();
                },
            });
        } else {
            // vv Method 2: Wait activate until user accepts to install new service worker and apply immediately when activated new service worker
            if (!swHandler.isInitialSetup) {
                swHandler.clientsClaim(worker);
                location.reload();
            }
        }
    }

    onWaitingAnotherClientToClose(worker) {
        estreToastAlert({
            title: "Wait for other window save work",
            message: "New version of app is loaded<br />If you close this popup, to be reloaded a old version app windows<br />Please save your work and press OK to be applied new version of app in all windows",
            positive: "OK",
            callbackDissmiss: _ => {
                this.swHandler.clientsClaim(worker);
                setTimeout(_ => {
                    if (worker != this.swHandler.controller) location.reload();
                    else note("The new version of app is applied");
                }, 1000);
            },
        });
    }

    async onControllerChangedToNewServiceWorker(event) {
        const swHandler = this.swHandler;
        const version = await swHandler.getVersion();
        console.log("New service worker controller is ready: v" + version);
        this.setServiceWorkerControllerEvents();
    }

    setServiceWorkerControllerEvents() {
        const swHandler = this.swHandler;
        const controller = swHandler.controller;
        controller.addEventListener("statechange", e => {
            if (controller.state == "redundant") {
                console.log("Current service worker became redundant: ", controller);
                console.log("To be reloaded the app to apply new service worker");
                location.reload();
            }
        });

        this.#swUpdateChecker = setInterval(async _ => {
            await swHandler.update();
        }, 60 * 60 * 1000);
        // ^^ Customize interval time for check update of service worker
    }

    async checkPostNewNativeAppVersion(worker = this.swHandler.worker, userConfirmCallback = async isPositive => {}) {
        if (!this.isApp) return u;
        const swHandler = this.swHandler;
        const version = await swHandler.getVersion(worker);
        const [native, web] = version.split(hp);
        const currentNative = this.sessionManager.appVersion;
        
        console.log("Check service Worker version: " + version + "\n - native: " + native + "\n - web: ", web);
        
        let isNewNative = f;
        const [major, minor, patch] = currentNative.split(".").map(it => it[0] == t0 ? 0 : parseInt(it));
        const [newMajor, newMinor, newPatch] = native.split(".").map(it => parseInt(it));
    
        if (newMajor > major) isNewNative = t;
        else if (newMajor == major && newMinor > minor) isNewNative = t;
        else if (newMajor == major && newMinor == minor && newPatch > patch) isNewNative = t;

        if (isNewNative) {
            const isAccepted = await postPromise(resolve => {
                const title = "Notice of important update";
                const messagePreset = "A new version of the app is available in |storeName|<br />Please proceed with the update<br /><span class=\"font_sr12\">* Some functions may not work properly if the app is not updated to the latest version</span>";
                const storeName = isAndroid ? "Play Store" : "App Store";
                const message = messagePreset.replace("|storeName|", storeName);
                const positive = "Go to Store";
                const negative = "Later";
                let isPositive = u;
                estreToastConfirm({
                    title, message, positive, negative,
                    callbackPositive: async _ => {
                        isPositive = t;
                        if (worker != swHandler.controller && !this.#swUpdateBeforeAsk) {
                            await swHandler.controller?.let(it => this.clearCache(it));
                            swHandler.skipWaiting(worker);
                        }
                        window.app.request("openStoreForUpdate");
                        resolve(t);
                    },
                    callbackNegative: _ => {
                        isPositive = f;
                    },
                    callbackDissmiss: _ => {
                        if (!isPositive) {
                            if (tu(isPositive)) isPositive = n;
                            resolve(isPositive);
                        }
                    },
                });
            });
            await userConfirmCallback?.(isAccepted);
        }

        return isNewNative;
    }

    async checkUpdate() {
        const worker = await (this.swHandler ?? serviceWorkerHandler).update();
        if (worker) return worker;
        else if (worker == n) note("Application is not ready for service");
        else if (!(await this.checkPostNewNativeAppVersion())) note("The current app is up to date");
    }

    async clearCache() {
        if (this.isApp) await window.app.request("clearCache");
        if (this.swHandler.controller != n) await (this.swHandler ?? serviceWorkerHandler).clearCache();
    }

    async forceReload() {
        wait();
        await this.clearCache();
        location.reload();
    }

    async checkUpdateAndForceReload() {
        wait();
        await this.clearCache();
        await postPromise(async resolve => {
            const swHandler = this.swHandler ?? serviceWorkerHandler;
            try {
                const worker = await swHandler.update();
                if (worker) {
                    console.log("New service worker state: ", worker.state);
                    if (worker.state == "activated") resolve(worker);
                    else if (worker.state == "redundant") resolve();
                    else {
                        if (!this.#swUpdateBeforeAsk) swHandler.skipWaiting(worker);
                        worker.addEventListener("statechange", e => {
                            console.log("New service worker changed state: ", worker.state);
                            if (worker.state == "activated") {
                                swHandler.clientsClaim(worker);
                                resolve(worker);
                            } else if (worker.state == "redundant") resolve();
                        });
                    }
                }
                else resolve(worker);
            } catch (exc) {
                console.error(exc);
                resolve();
            }
        });
        location.reload();
    }
}



// Implement example of my own action handler
class AppActionHandler {

    hostId = "AppActionManager";

    #sessionManager = null;
    get sessionManager() { return this.#sessionManager; }
    #actionManager = null;
    get actionManager() { return this.#actionManager; }
    #pageManager = null;
    get pageManager() { return this.#pageManager; }

    constructor (sessionManager) {
        this.#sessionManager = sessionManager;
    }

    init(pageManager, actionManager) {
        this.#pageManager = pageManager;
        this.#actionManager = actionManager;

        return this;
    }


    somethingDoWhileAnything() {
        //show blinded loading indicator
        const waiter = wait();
        //register to async manager for monitor async work for prevent leak
        let currentWid = EstreAsyncManager.beginWork("[" + "work title" + "]" + "detail", this.hostId);

        //<= before process

        setTimeout(() => {// <= somthing did wile async action

            //<= after process

            //unregister from async manager
            EstreAsyncManager.endOfWork(currentWid);
            //hide blinded loading indicator
            go(waiter);
        }, 3000);
        //<= You must catch error case for do unregister from async manager and close loading indicator
    }
}




// Local/Session Storage key constants
const ESTRE_UI_APP_SESSION_BLOCK = "ESTRE_UI_APP_SESSION_BLOCK";


// Authed API communication manager example
const APP_API_SERVER = "https://my.own.api.server/api";

const PATH_LOGIN = "/login";

const PATH_SEND_NOTHING = "/takeNothing";


class AppApiUrl {
    static get login() { return APP_API_SERVER + PATH_LOGIN; }
    static get sendNothing() { return APP_API_SERVER + PATH_SEND_NOTHING; }
}


class AppSessionManager {

    // class property


    // static methods


    // constants
    hostId = "AppSessionManager";

    get #emptyUser() {
        return {};
    }
    get #emptySession() {
        return {};
    }
    

    // instnace property
    #storageHandler = null;
    get storageHandler() { return this.#storageHandler; }

    #apiUrlCollection = null;
    get apiUrlCollection() { return this.#apiUrlCollection; }

    #onPrepare = null;
    #onCheckedAuth = null;
    #onReady = null;

    #user = this.#emptyUser;

    #session = this.#emptySession;


    #callbackSetUser = null;


    // geter setter
    get #authToken() {
        return this.#session.loginToken;
    }


    #setUser(infoSet) {
        this.#user = infoSet;

        this.#callbackSetUser(this.userName);
    }

    get userName() { return this.#user.name; }



    constructor(apiUrlCollection, storageHandler, callbackSetUser = (userName) => {}) {
        this.#apiUrlCollection = apiUrlCollection;
        this.#storageHandler = storageHandler;
        this.#callbackSetUser = callbackSetUser;
    }

    
    init(onPrepare, onCheckedAuth, onReady) {
        if (this != appSessionManager) return new Error("Can not duplicate session manager");

        this.#onPrepare = onPrepare;
        this.#onCheckedAuth = onCheckedAuth;
        this.#onReady = onReady;

        this.#checkUpSession();
    }

    async #checkUpSession() {
        let block = this.storageHandler.getString(ESTRE_UI_APP_SESSION_BLOCK);

        if (block != null && block != "") {
            this.#extractBlock(block);

            let token = this.#authToken;
            //console.log(token);

            this.#bringOnPrepare(true);

            if (token != null && token.length > 0) {
                this.#bringOnCheckedAuth(true);
                this.#bringOnReady(true);
            } else {
                this.#bringOnCheckedAuth(false);
                this.#bringOnReady(true);
            };
            
        } else {
            
            this.#bringOnPrepare(false);

            this.#onCheckedAuth = null;

            this.#bringOnReady(true);
        }

    }

    #bringOnPrepare(isTokenExist) {
        this.#onPrepare(isTokenExist);
        this.#onPrepare = null;
    }

    #bringOnCheckedAuth(isOnAuth) {
        this.#onCheckedAuth(isOnAuth);
        this.#onCheckedAuth = null;
    }

    #bringOnReady(isStraight) {
        this.#onReady(isStraight);
        this.#onReady = null;
    }

    #clearSession() {
        this.#user = this.#emptyUser;
        this.#session = this.#emptySession;
        this.storageHandler.setString(ESTRE_UI_APP_SESSION_BLOCK);
    }

    #extractBlock(block) {
        let set = Jcodd.parse(atob(block));
        this.#session = set.session;
        this.#user = set.user;
    }

    #solidBlock() {
        return btoa(Jcodd.coddify({ session: this.#session, user: this.#user }));
    }

    #fetchApiPost(url, data, callbackSuccess = (data) => {}, callbackFailure = (data) => {}, fetchKind = "communication") {
        return this.#fetchApiWithBody(url, data, callbackSuccess, callbackFailure, "POST", fetchKind);
    }

    #fetchApiPatch(url, data, callbackSuccess = (data) => {}, callbackFailure = (data) => {}, fetchKind = "communication") {
        return this.#fetchApiWithBody(url, data, callbackSuccess, callbackFailure, "PATCH", fetchKind);
    }

    #fetchApiPut(url, data, callbackSuccess = (data) => {}, callbackFailure = (data) => {}, fetchKind = "communication") {
        return this.#fetchApiWithBody(url, data, callbackSuccess, callbackFailure, "PUT", fetchKind);
    }

    #fetchApiWithBody(url, data, callbackSuccess = (data) => {}, callbackFailure = (data) => {}, request = "POST", fetchKind = "communication") {

        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        if (location.href.indexOf("http://") > -1) {
            headers.append("Access-Control-Request-Private-Network", "true");
        }
        
        let content = data;
        let body = JSON.stringify(content);
        console.log("request: [" + request + "] " + url + "\n" + body);

        let fetchWid = EstreAsyncManager.beginWork("[" + request + "]" + url, this.hostId);
        fetch (url, {
            method: request,
            headers: headers,
            body: body
        }).then((response) => {
            if (response.ok) {
                try {
                    return response.json();
                } catch (ex) {
                    console.log(ex.name + "\n" + ex.message);
                    console.log(response);
                    EstreAsyncManager.endOfWork(fetchWid);
                    //retry
                    console.log(fetchKind + " Failure : Server issue");
                    callbackFailure({ error: "JSON parse failure", response: response });
                    return response;
                }
            } else {
                console.log(response);
                EstreAsyncManager.endOfWork(fetchWid);
                //retry
                console.log(fetchKind + " Failure : Server error");
                callbackFailure({ error: "Response is not Ok", response: response });
                return response;
            }
        }).then((resp) => {
            if (resp != null) {
                if (resp instanceof Response) return;
                console.log(resp);
                
                if (resp?.resultOk != null) {

                    if (resp.resultOk) {
                        callbackSuccess(resp);
                    } else {
                        switch (resp.resultCode) {
                            case 1:
                                //process each resultCode cases
                                break;
                        }
                        console.log(fetchKind + " Failure : (" + resp.resultCode + ")\n" + resp.resultMessage);
                        callbackFailure(resp);
                    }
                } else {
                    console.log(fetchKind + " Failure : Null resultOk");
                    callbackFailure({ error: "no result", response: response });
                }
            } else {
                console.log(fetchKind + " Failure : Null response");
                callbackFailure({ error: "How null is response object", response: response });
            }
            EstreAsyncManager.endOfWork(fetchWid);
        }).catch (error => {
            console.log(error);
            //console.log(ex.name + "\n" + ex.message);

            // to do implement retry
            callbackFailure({ error: "Error on fetch [" + request + "] " + url + "\n" + error, errorOrigin: error });
            EstreAsyncManager.endOfWork(fetchWid);
        });
    }

    #fetchApiAuthedPost(url, data, callbackSuccess = (data) => {}, callbackFailure = (data) => {}, fetchKind = "communication") {
        this.#fetchApiAuthedWithBody(url, data, callbackSuccess, callbackFailure, "POST", fetchKind);
    }

    #fetchApiAuthedPatch(url, data, callbackSuccess = (data) => {}, callbackFailure = (data) => {}, fetchKind = "communication") {
        this.#fetchApiAuthedWithBody(url, data, callbackSuccess, callbackFailure, "PATCH", fetchKind);
    }

    #fetchApiAuthedPut(url, data, callbackSuccess = (data) => {}, callbackFailure = (data) => {}, fetchKind = "communication") {
        this.#fetchApiAuthedWithBody(url, data, callbackSuccess, callbackFailure, "PUT", fetchKind);
    }

    #fetchApiAuthedWithBody(url, data, callbackSuccess = (data) => {}, callbackFailure = (data) => {}, request = "POST", fetchKind = "communication") {
        if (this.#session.loginToken != null && this.#session.loginToken != "") {
            if (data == null) data = {};
            data.loginToken = this.#session.loginToken;
            this.#fetchApiWithBody(url, data, callbackSuccess, callbackFailure, request, fetchKind);
        } else callbackFailure({ error: "Login token not exist" });
    }


    signIn(id, pw, callbackSuccess = (data) => {}, callbackFailure = (data) => {}) {
        let data = { LoginID: id, LoginPW: pw };

        this.#fetchApiPost(this.apiUrlCollection.login, data, (data) => {
            
            if (data.resultOk) {
                this.#session.loginToken = data.loginToken;

                this.#setUser({ name: data.userName });

                let block = this.#solidBlock();
                //console.log("session block: " + block);

                this.storageHandler.setString(ESTRE_UI_APP_SESSION_BLOCK, block);
                
                callbackSuccess(data);
            } else {
                console.log("Sign in Failure : (" + head.resultCode + ")\n" + head.ResultMessage);
                callbackFailure(data);
            }
        }, (data) => {
            alert("Sign in Failure : " + (data.error != null ? data.error : "(" + data.resultOk + ")\n" + data.ResultMessage));
            callbackFailure(data);
        }, "Sign in");
    }

    signOut(callbackSuccess = (data) => {}, callbackFailure = (data) => {}) {
        this.#clearSession();
        callbackSuccess({});
        location.reload(); 
    }

    sendNothing(nothing, callbackSuccess = (data) => {}, callbackFailure = (data) => {}) {
        this.#fetchApiAuthedPost(this.apiUrlCollection.sendNothing, { nothing }, callbackSuccess, callbackFailure);
    }
}


// setup instances
const appSessionManager = new AppSessionManager(AppApiUrl, ELS, (userName) => {
    EstreHandle.activeHandle[uis.appUserHandle]?.forEach(handle => {
        handle.releaseInfo();//<= Call release user info
    });
});

const appActionHandler = new AppActionHandler(appSessionManager);

const appPageManager = new AppPageManager(appActionHandler);

const appActionManager = new AppActionManager(appPageManager, appSessionManager, appActionHandler);


// custom handle callbacks
AppUserHandle.setOn(() => {
    const waiter = wait();
    appSessionManager.signOut((data) => {
        go(waiter);
    }, (data) => {
        go(waiter);
    });
}, (handle) => {//<= Callback release user info
    handle.$bound.find(cls + "user_name").text(appSessionManager.userName);
});


// Own application and EstreUI initializing
$(document).ready((e) => {

    //<= to do implement my own initializing


    //Initialize my own API session manager related initialize EstreUI
    appSessionManager.init((isTokenExist) => {
        //something do while intializes on splash page
        appPageManager.init(AppPagesProvider.pages, new AppPagesProvider(appPageManager, appActionManager, appActionHandler.init(appPageManager, appActionManager), appSessionManager));
        //initialize scheduleDateSet with own data handler
        // scheduleDataSet.init(myOwnDataHandler);
        //initialize Estre UI after checked user session
        estreUi.init(false);

        appActionManager.init(serviceWorkerHandler);
    
        //ready to begin page if han not login token
        if (!isTokenExist) appPageManager.bringPage("login");
    }, (isOnAuth) => {
        //bitfurcation user auth when checked only has login token
        if (!isOnAuth) appPageManager.bringPage("login");
        else appPageManager.bringPage("home");
    }, async (isStraight) => {
        if (await appActionManager.onReadyEstreUi()) return;

        //notification finished loading my own app to Estre UI
        if (isStraight) setTimeout(() => estreUi.checkOnReady(), 0);
        else estreUi.checkOnReady();
    });


})
