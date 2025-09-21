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

        "titleBar": "&h=appbar#home",


        "menu_area_root": "&u=menuArea#root",


        "home": "&m=home",

        "braille": "&m=braille",

        "ascii": "&m=ascii",

        "ASCII": "&m=ASCII",

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
    "titleBar" = class extends EstrePageHandler {
        $titleHolder;

        onBring(handle) {
            this.$titleHolder = handle.$host.find(".titleHolder");
        }

        onReload(handle) {
            this.loadData();

            return t;
        }

        loadData() {
            console.log("Load title data: ", this.provider.actionHandler.filename);
            const data = this.provider.actionHandler.filename ?? "(파일 이름 불명)";
            this.$titleHolder.text(data);
        }
    };


    "menu_area_root" = class extends EstrePageHandler {
        $recentHolder;
        recentHolder;

        $versionHolder;

        onBring(handle) {
            this.$recentHolder = handle.$host.find("ul.recent");
            this.recentHolder = this.$recentHolder[0];

            this.$versionHolder = handle.$host.find(".versions");
        }

        onShow(handle) {
            this.releaseRecent();
            this.updateVersion();
        }

        onReload(handle) {
            this.releaseRecent();
            this.updateVersion();

            return t;
        }

        releaseRecent() {
            const recent = ECLS.get("recentFiles", []);

            if (recent.length < 1) this.recentHolder.melt({ message: "최근 불러온 파일 없음" }, "frozenPlaceholder");
            else {
                this.$recentHolder.empty();
                for (const fileinfo of recent) this.recentHolder.worm(fileinfo);

                this.$recentHolder.find(c.c + li + c.c + btn).click(e => {
                    e.preventDefault();

                    const filename = e.currentTarget.dataset.filename;
                    this.provider.actionHandler.loadRecent(filename);
                    estreUi.closeMainMenu();

                    return false;
                });
            }
        }

        async updateVersion() {
            const version = await this.provider.actionManager.swHandler?.getVersion();
            this.$versionHolder.attr("data-trail", version?.let(it => "v" + it) ?? "(인스턴트 실행 중)");
        }
    };


    "home" = class extends EstrePageHandler {};

    "braille" = class extends EstrePageHandler {
        $contentHolder;

        onBring(handle) {
            this.$contentHolder = handle.$host.find(".content_holder");
        }

        onOpen(handle) {
            this.loadData();
        }

        onReload(handle) {
            this.loadData();

            return t;
        }

        loadData() {
            console.log("Load braille data: ", this.provider.actionHandler.filename);
            const data = this.provider.actionHandler.dataBraille;
            const fragment = this.provider.actionHandler.loadContentPaged(data);
            this.$contentHolder.empty().append(fragment);
        }
    };

    "ascii" = class extends EstrePageHandler {
        $contentHolder;

        onBring(handle) {
            this.$contentHolder = handle.$host.find(".content_holder");
        }

        onReload(handle) {
            this.loadData();

            return t;
        }

        onOpen(handle) {
            this.loadData();
        }

        loadData() {
            console.log("Load ascii data: ", this.provider.actionHandler.filename);
            const data = this.provider.actionHandler.dataAscii;
            const fragment = this.provider.actionHandler.loadContentPaged(data, t);
            this.$contentHolder.empty().append(fragment);
        }
    };

    "ASCII" = class extends EstrePageHandler {
        $contentHolder;

        onBring(handle) {
            this.$contentHolder = handle.$host.find(".content_holder");
        }

        onOpen(handle) {
            this.loadData();
        }

        onReload(handle) {
            this.loadData();

            return t;
        }

        loadData() {
            console.log("Load ASCII data: ", this.provider.actionHandler.filename);
            const data = this.provider.actionHandler.dataASCII;
            const fragment = this.provider.actionHandler.loadContentPaged(data, t);
            this.$contentHolder.empty().append(fragment);
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
    #swUpdateBeforeAsk = f; // PWA update method selection (true: method 1, false: method 2)

    #pageManager = null;
    get pageManager() { return this.#pageManager; }
    #sessionManager = null;
    get sessionManager() { return this.#sessionManager; }
    #actionHandler = null;
    get actionHandler() { return this.#actionHandler; }

    get isApp() { return window.app != n; }


    $fileLoader;
    fileLoader;

    draggableHandler;

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

        this.beginApp();
    }

    async onInstallingNewServiceWorker(worker) {
        const swHandler = this.swHandler;

        if (this.#swUpdateBeforeAsk) {
            // vv Method 1: Install new service worker immediately and prompt user to restart app when activated new service worker
            if (!swHandler.isInitialSetup) {
                this.controller?.let(it => this.clearCache(it));
                note("새 버전의 앱이 확인되어 설치중입니다...");
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
                title: "앱의 새 버전이 있어요",
                message: "앱의 새 버전의 업데이트가 대기중입니다<br />지금 새 버전으로 적용 할까요?<br /><span class=\"font_sr12\">* 새 버전은 앱을 닫은 후 재시작할 때 자동으로 적용됩니다<br />** 새 버전이 적용되지 않으면 일부 기능이 제대로 작동하지 않을 수 있습니다</span>",
                positive: "지금 적용(앱 재시작)",
                negative: "나중에",
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
                title: "앱 재시작이 필요합니다",
                message: "앱의 새 버전이 준비되었습니다<br />적용하려면 앱을 재시작해야 합니다<br />지금 재시작할까요?<br /><span class=\"font_sr12\">* 새 버전은 앱을 닫은 후 재시작할 때 자동으로 적용됩니다<br />** 새 버전이 적용되지 않으면 일부 기능이 제대로 작동하지 않을 수 있습니다<br />새 버전이 설치되면 모든 앱 창이 다시 로드됩니다</span>",
                positive: "지금 적용",
                negative: "나중에",
                callbackPositive: _ => {
                    swHandler.clientsClaim(worker);
                    location.reload();
                },
            });
        } else {
            // vv Method 2: Wait activate until user accepts to install new service worker and apply immediately when activated new service worker
            if (!swHandler.isInitialSetup) {
                try {
                    swHandler.clientsClaim(worker);
                } catch (e) {
                    console.error(e);
                }
                location.reload();
            }
        }
    }

    onWaitingAnotherClientToClose(worker) {
        estreToastAlert({
            title: "다른 창의 작업을 저장하세요",
            message: "앱의 새 버전이 로드되었습니다<br />이 팝업을 닫으면 이전 버전의 앱 창이 다시 로드됩니다<br />작업을 저장하고 확인을 눌러 모든 창에서 새 버전의 앱을 적용하세요",
            positive: "확인",
            callbackDissmiss: _ => {
                this.swHandler.clientsClaim(worker);
                setTimeout(_ => {
                    if (worker != this.swHandler.controller) location.reload();
                    else note("앱의 새 버전이 적용되었습니다");
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

        estreUi.menuSections.menuArea.containers.root?.handler.updateVersion();
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
                const title = "중요 업데이트 알림";
                const messagePreset = "앱의 새 버전이 |storeName|에 있습니다<br />업데이트를 진행해주세요<br /><span class=\"font_sr12\">* 새 버전으로 업데이트하지 않으면 일부 기능이 제대로 작동하지 않을 수 있습니다</span>";
                const storeName = isAndroid ? "Play Store" : "App Store";
                const message = messagePreset.replace("|storeName|", storeName);
                const positive = "스토어로 이동";
                const negative = "나중에";
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
        else if (worker == n) note("앱이 준비 상태가 아닌 것 같아요");
        else if (!(await this.checkPostNewNativeAppVersion())) note("현재 앱이 최신 버전입니다");
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

    beginApp() {
        this.$fileLoader = $("#fileLoader");
        this.fileLoader = this.$fileLoader[0];
        this.actionHandler.onBeginApp(this.$fileLoader, this.fileLoader);

        this.$fileLoader.change(e => {
            console.log("Load file by file input");
            const files = e.target.files;
            if (files.length > 0) {
                this.actionHandler.loadFile(files[0]);
                this.$fileLoader.val("");
            }
        });


        this.draggableHandler = new EstreDraggableHandler($(document.documentElement), "both", f);

        $(doc.b).on("drop", e => {
            e.preventDefault();

            console.log("Load file by drag & drop");
            const files = e.originalEvent.dataTransfer?.files;
            if (files?.length > 0) {
                this.actionHandler.loadFile(files[0]);
            }

            return f;
        });
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


    $fileLoader;
    fileLoader;

    fileReader;

    file;
    filename;
    dataOrigin;
    dataBraille;
    dataAscii;
    dataASCII;
    

    constructor (sessionManager) {
        this.#sessionManager = sessionManager;
    }

    init(pageManager, actionManager) {
        this.#pageManager = pageManager;
        this.#actionManager = actionManager;

        return this;
    }


    onBeginApp($fileLoader, fileLoader) {
        this.$fileLoader = $fileLoader;
        this.fileLoader = fileLoader;

        this.fileReader = new FileReader();
        this.fileReader.onload = e => this.onLoadFile(e);
    }

    openFile() {
        this.fileLoader.click();
    }

    loadFile(file) {
        this.file = file;
        this.filename = file.name;
        this.dataOrigin = null;
        this.dataBraille = null;
        this.dataAscii = null;
        this.dataASCII = null;

        console.log("Begin load file: ", this.filename);

        this.fileReader.readAsText(this.file);
    }

    onLoadFile(e) {
        const content = e.target.result;
        this.dataOrigin = content;

        this.dataBraille = caseFreeASCIIBrailleToUnicode(this.dataOrigin);
        this.dataAscii = this.dataOrigin.toLowerCase();
        this.dataASCII = this.dataOrigin.toUpperCase();

        const recent = ECLS.get("recentFiles", []);
        const exist = recent.find(it => it.filename == this.filename);
        if (exist) recent.remove(exist);
        recent.unshift({ filename: this.filename, size: this.file.size, timestamp: dt.t });
        while (recent.length > 20) recent.pop();
        ECLS.set("recentFiles", recent);
        ECLS.set("file=" + this.filename, this.dataOrigin);

        console.log("Loaded file: ", this.filename);
        
        estreUi.appbar.containers.home.reload();
        estreUi.mainSections.braille.reload();
        estreUi.mainSections.ascii.reload();
        estreUi.mainSections.ASCII.reload();
        estreUi.menuSections.menuArea.containers.root?.handler.releaseRecent();

        this.pageManager.bringPage("braille");
    }

    loadRecent(filename) {
        const content = ECLS.get("file=" + filename, n);
        if (content != n) {
            this.filename = filename;
            this.dataOrigin = content;
            this.dataBraille = caseFreeASCIIBrailleToUnicode(this.dataOrigin);
            this.dataAscii = this.dataOrigin.toLowerCase();
            this.dataASCII = this.dataOrigin.toUpperCase();

            const recent = ECLS.get("recentFiles", []);
            const exist = recent.splice(recent.findIndex(it => it.filename == this.filename), 1)[0];
            recent.unshift(exist);
            ECLS.set("recentFiles", recent);

            console.log("Loaded recent file: ", this.filename);
            
            estreUi.appbar.containers.home.reload();
            estreUi.mainSections.braille.reload();
            estreUi.mainSections.ascii.reload();
            estreUi.mainSections.ASCII.reload();
            estreUi.menuSections.menuArea.containers.root?.handler.releaseRecent();

            this.pageManager.bringPage("braille");
        } else {
            note("해당 파일 데이터가 유실되었습니다<br />파일 열기로 직접 열어주세요");

            const recent = ECLS.get("recentFiles", []);
            const exist = recent.find(it => it.filename == filename);
            if (exist) recent.remove(exist);
            ECLS.set("recentFiles", recent);
            estreUi.menuSections.menuArea.containers.root?.handler.releaseRecent();
        }
    }


    loadContentPaged(source, isAscii = f) {
        if (isAscii) source = source.replace(/ /g, " ");
        const pages = source.split("\f");
        if (pages[pages.length - 1].trim().length < 1) pages.pop();
        const fragment = document.createDocumentFragment();
        const totalIndex = pages.length;
        for (const [index, page] of pages.entire) {
            const elem = document.createElement(ol);
            elem.classList.add("page");
            elem.dataset.lead = (parseInt(index) + 1) + "/" + totalIndex;
            
            const lines = page.split("\n");
            if (lines[lines.length - 1].trim().length < 1) lines.pop();
            const lastLineIndex = lines.length - 1;
            for (const [no, line] of lines.entire) {
                const lineElem = document.createElement(li);
                lineElem.dataset.lineNo = (parseInt(no) + 1) + "\u00A0";
                lineElem.dataset.trail = no == lastLineIndex ? "␌" : "⏎";
                lineElem.textContent = line;
                elem.appendChild(lineElem);
            }

            fragment.appendChild(elem);
        }
        return fragment;
    }
}




// // Local/Session Storage key constants
// const ESTRE_UI_APP_SESSION_BLOCK = "ESTRE_UI_APP_SESSION_BLOCK";


// // Authed API communication manager example
// const APP_API_SERVER = "https://my.own.api.server/api";

// const PATH_LOGIN = "/login";

// const PATH_SEND_NOTHING = "/takeNothing";


// class AppApiUrl {
//     static get login() { return APP_API_SERVER + PATH_LOGIN; }
//     static get sendNothing() { return APP_API_SERVER + PATH_SEND_NOTHING; }
// }


// class AppSessionManager {

//     // class property


//     // static methods


//    // constants
//    hostId = "AppSessionManager";

//     get #emptyUser() {
//         return {};
//     }
//     get #emptySession() {
//         return {};
//     }
    

//     // instnace property
//     #storageHandler = null;
//     get storageHandler() { return this.#storageHandler; }

//     #apiUrlCollection = null;
//     get apiUrlCollection() { return this.#apiUrlCollection; }

//     #onPrepare = null;
//     #onCheckedAuth = null;
//     #onReady = null;

//     #user = this.#emptyUser;

//     #session = this.#emptySession;


//     #callbackSetUser = null;


//     // geter setter
//     get #authToken() {
//         return this.#session.loginToken;
//     }


//     #setUser(infoSet) {
//         this.#user = infoSet;

//         this.#callbackSetUser(this.userName);
//     }

//     get userName() { return this.#user.name; }



//     constructor(apiUrlCollection, storageHandler, callbackSetUser = (userName) => {}) {
//         this.#apiUrlCollection = apiUrlCollection;
//         this.#storageHandler = storageHandler;
//         this.#callbackSetUser = callbackSetUser;
//     }

    
//     init(onPrepare, onCheckedAuth, onReady) {
//         if (this != appSessionManager) return new Error("Can not duplicate session manager");

//         this.#onPrepare = onPrepare;
//         this.#onCheckedAuth = onCheckedAuth;
//         this.#onReady = onReady;

//         this.#checkUpSession();
//     }

//     async #checkUpSession() {
//         let block = this.storageHandler.getString(ESTRE_UI_APP_SESSION_BLOCK);

//         if (block != null && block != "") {
//             this.#extractBlock(block);

//             let token = this.#authToken;
//             //console.log(token);

//             this.#bringOnPrepare(true);

//             if (token != null && token.length > 0) {
//                 this.#bringOnCheckedAuth(true);
//                 this.#bringOnReady(true);
//             } else {
//                 this.#bringOnCheckedAuth(false);
//                 this.#bringOnReady(true);
//             };
            
//         } else {
            
//             this.#bringOnPrepare(false);

//             this.#onCheckedAuth = null;

//             this.#bringOnReady(true);
//         }

//     }

//     #bringOnPrepare(isTokenExist) {
//         this.#onPrepare(isTokenExist);
//         this.#onPrepare = null;
//     }

//     #bringOnCheckedAuth(isOnAuth) {
//         this.#onCheckedAuth(isOnAuth);
//         this.#onCheckedAuth = null;
//     }

//     #bringOnReady(isStraight) {
//         this.#onReady(isStraight);
//         this.#onReady = null;
//     }

//     #clearSession() {
//         this.#user = this.#emptyUser;
//         this.#session = this.#emptySession;
//         this.storageHandler.setString(ESTRE_UI_APP_SESSION_BLOCK);
//     }

//     #extractBlock(block) {
//         let set = Jcodd.parse(atob(block));
//         this.#session = set.session;
//         this.#user = set.user;
//     }

//     #solidBlock() {
//         return btoa(Jcodd.coddify({ session: this.#session, user: this.#user }));
//     }

//     #fetchApiPost(url, data, callbackSuccess = (data) => {}, callbackFailure = (data) => {}, fetchKind = "communication") {
//         return this.#fetchApiWithBody(url, data, callbackSuccess, callbackFailure, "POST", fetchKind);
//     }

//     #fetchApiPatch(url, data, callbackSuccess = (data) => {}, callbackFailure = (data) => {}, fetchKind = "communication") {
//         return this.#fetchApiWithBody(url, data, callbackSuccess, callbackFailure, "PATCH", fetchKind);
//     }

//     #fetchApiPut(url, data, callbackSuccess = (data) => {}, callbackFailure = (data) => {}, fetchKind = "communication") {
//         return this.#fetchApiWithBody(url, data, callbackSuccess, callbackFailure, "PUT", fetchKind);
//     }

//     #fetchApiWithBody(url, data, callbackSuccess = (data) => {}, callbackFailure = (data) => {}, request = "POST", fetchKind = "communication") {

//         let headers = new Headers();
//         headers.append("Content-Type", "application/json");
//         if (location.href.indexOf("http://") > -1) {
//             headers.append("Access-Control-Request-Private-Network", "true");
//         }
        
//         let content = data;
//         let body = JSON.stringify(content);
//         console.log("request: [" + request + "] " + url + "\n" + body);

//         let fetchWid = EstreAsyncManager.beginWork("[" + request + "]" + url, this.hostId);
//         fetch (url, {
//             method: request,
//             headers: headers,
//             body: body
//         }).then((response) => {
//             if (response.ok) {
//                 try {
//                     return response.json();
//                 } catch (ex) {
//                     console.log(ex.name + "\n" + ex.message);
//                     console.log(response);
//                     EstreAsyncManager.endOfWork(fetchWid);
//                     //retry
//                     console.log(fetchKind + " Failure : Server issue");
//                     callbackFailure({ error: "JSON parse failure", response: response });
//                     return response;
//                 }
//             } else {
//                 console.log(response);
//                 EstreAsyncManager.endOfWork(fetchWid);
//                 //retry
//                 console.log(fetchKind + " Failure : Server error");
//                 callbackFailure({ error: "Response is not Ok", response: response });
//                 return response;
//             }
//         }).then((resp) => {
//             if (resp != null) {
//                 if (resp instanceof Response) return;
//                 console.log(resp);
                
//                 if (resp?.resultOk != null) {

//                     if (resp.resultOk) {
//                         callbackSuccess(resp);
//                     } else {
//                         switch (resp.resultCode) {
//                             case 1:
//                                 //process each resultCode cases
//                                 break;
//                         }
//                         console.log(fetchKind + " Failure : (" + resp.resultCode + ")\n" + resp.resultMessage);
//                         callbackFailure(resp);
//                     }
//                 } else {
//                     console.log(fetchKind + " Failure : Null resultOk");
//                     callbackFailure({ error: "no result", response: response });
//                 }
//             } else {
//                 console.log(fetchKind + " Failure : Null response");
//                 callbackFailure({ error: "How null is response object", response: response });
//             }
//             EstreAsyncManager.endOfWork(fetchWid);
//         }).catch (error => {
//             console.log(error);
//             //console.log(ex.name + "\n" + ex.message);

//             // to do implement retry
//             callbackFailure({ error: "Error on fetch [" + request + "] " + url + "\n" + error, errorOrigin: error });
//             EstreAsyncManager.endOfWork(fetchWid);
//         });
//     }

//     #fetchApiAuthedPost(url, data, callbackSuccess = (data) => {}, callbackFailure = (data) => {}, fetchKind = "communication") {
//         this.#fetchApiAuthedWithBody(url, data, callbackSuccess, callbackFailure, "POST", fetchKind);
//     }

//     #fetchApiAuthedPatch(url, data, callbackSuccess = (data) => {}, callbackFailure = (data) => {}, fetchKind = "communication") {
//         this.#fetchApiAuthedWithBody(url, data, callbackSuccess, callbackFailure, "PATCH", fetchKind);
//     }

//     #fetchApiAuthedPut(url, data, callbackSuccess = (data) => {}, callbackFailure = (data) => {}, fetchKind = "communication") {
//         this.#fetchApiAuthedWithBody(url, data, callbackSuccess, callbackFailure, "PUT", fetchKind);
//     }

//     #fetchApiAuthedWithBody(url, data, callbackSuccess = (data) => {}, callbackFailure = (data) => {}, request = "POST", fetchKind = "communication") {
//         if (this.#session.loginToken != null && this.#session.loginToken != "") {
//             if (data == null) data = {};
//             data.loginToken = this.#session.loginToken;
//             this.#fetchApiWithBody(url, data, callbackSuccess, callbackFailure, request, fetchKind);
//         } else callbackFailure({ error: "Login token not exist" });
//     }


//     signIn(id, pw, callbackSuccess = (data) => {}, callbackFailure = (data) => {}) {
//         let data = { LoginID: id, LoginPW: pw };

//         this.#fetchApiPost(this.apiUrlCollection.login, data, (data) => {
            
//             if (data.resultOk) {
//                 this.#session.loginToken = data.loginToken;

//                 this.#setUser({ name: data.userName });

//                 let block = this.#solidBlock();
//                 //console.log("session block: " + block);

//                 this.storageHandler.setString(ESTRE_UI_APP_SESSION_BLOCK, block);
                
//                 callbackSuccess(data);
//             } else {
//                 console.log("Sign in Failure : (" + head.resultCode + ")\n" + head.ResultMessage);
//                 callbackFailure(data);
//             }
//         }, (data) => {
//             alert("Sign in Failure : " + (data.error != null ? data.error : "(" + data.resultOk + ")\n" + data.ResultMessage));
//             callbackFailure(data);
//         }, "Sign in");
//     }

//     signOut(callbackSuccess = (data) => {}, callbackFailure = (data) => {}) {
//         this.#clearSession();
//         callbackSuccess({});
//         location.reload(); 
//     }

//     sendNothing(nothing, callbackSuccess = (data) => {}, callbackFailure = (data) => {}) {
//         this.#fetchApiAuthedPost(this.apiUrlCollection.sendNothing, { nothing }, callbackSuccess, callbackFailure);
//     }
// }


// // setup instances
// const appSessionManager = new AppSessionManager(AppApiUrl, ELS, (userName) => {
//     EstreHandle.activeHandle[uis.appUserHandle]?.forEach(handle => {
//         handle.releaseInfo();//<= Call release user info
//     });
// });

const appActionHandler = new AppActionHandler();//appSessionManager);

const appPageManager = new AppPageManager(appActionHandler);

const appActionManager = new AppActionManager(appPageManager, u, appActionHandler);//appPageManager, appSessionManager, appActionHandler);


// // custom handle callbacks
// AppUserHandle.setOn(() => {
//     const waiter = wait();
//     appSessionManager.signOut((data) => {
//         go(waiter);
//     }, (data) => {
//         go(waiter);
//     });
// }, (handle) => {//<= Callback release user info
//     handle.$bound.find(cls + "user_name").text(appSessionManager.userName);
// });


// Own application and EstreUI initializing
$(document).ready((e) => {

    //<= to do implement my own initializing

    //something do while intializes on splash page
    appPageManager.init(AppPagesProvider.pages, new AppPagesProvider(appPageManager, appActionManager, appActionHandler.init(appPageManager, appActionManager)));//, appSessionManager));
    //initialize scheduleDateSet with own data handler
    // scheduleDataSet.init(myOwnDataHandler);
    //initialize Estre UI after checked user session
    // estreUi.init();

    // //Initialize my own API session manager related initialize EstreUI
    // appSessionManager.init((isTokenExist) => {
    //     //something do while intializes on splash page
    //     appPageManager.init(AppPagesProvider.pages, new AppPagesProvider(appPageManager, appActionHandler));
    //     //initialize scheduleDateSet with own data handler
    //     // scheduleDataSet.init(myOwnDataHandler);
    //     //initialize Estre UI after checked user session
    //     estreUi.init();
    
        estreUi.init(false);

        appActionManager.init(serviceWorkerHandler);

        postAsyncQueue(async _ => {
            if (await appActionManager.onReadyEstreUi()) return;

            //notification finished loading my own app to Estre UI
            setTimeout(() => estreUi.checkOnReady(), 0);
        });
    
    //     //ready to begin page if han not login token
    //     if (!isTokenExist) appPageManager.bringPage("login");
    // }, (isOnAuth) => {
    //     //bitfurcation user auth when checked only has login token
    //     if (!isOnAuth) appPageManager.bringPage("login");
    //     else appPageManager.bringPage("home");
    // }, async (isStraight) => {
    //     if (await appActionManager.onReadyEstreUi()) return;

    //     //notification finished loading my own app to Estre UI
    //     if (isStraight) setTimeout(() => estreUi.checkOnReady(), 0);
    //     else estreUi.checkOnReady();
    // });


})
