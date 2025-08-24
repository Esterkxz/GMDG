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
    #actionHandler = null;
    get actionHandler() { return this.#actionHandler; }


    constructor(pageManager, actionHandler) {
        this.#pageManager = pageManager;
        this.#actionHandler = actionHandler;
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
    

    // instnace property
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



// Implement example of my own action handler
class AppActionHandler {

    hostId = "AppActionManager";

    #sessionManager = null;
    get sessionManager() { return this.#sessionManager; }

    constructor (sessionManager) {
        this.#sessionManager = sessionManager;
    }


    openFile() {
        
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


//     // constants
//     hostId = "AppSessionManager";

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
    appPageManager.init(AppPagesProvider.pages, new AppPagesProvider(appPageManager, appActionHandler));
    //initialize scheduleDateSet with own data handler
    // scheduleDataSet.init(myOwnDataHandler);
    //initialize Estre UI after checked user session
    estreUi.init();

    // //Initialize my own API session manager related initialize EstreUI
    // appSessionManager.init((isTokenExist) => {
    //     //something do while intializes on splash page
    //     appPageManager.init(AppPagesProvider.pages, new AppPagesProvider(appPageManager, appActionHandler));
    //     //initialize scheduleDateSet with own data handler
    //     // scheduleDataSet.init(myOwnDataHandler);
    //     //initialize Estre UI after checked user session
    //     estreUi.init(false);
    
    //     //ready to begin page if han not login token
    //     if (!isTokenExist) appPageManager.bringPage("login");
    // }, (isOnAuth) => {
    //     //bitfurcation user auth when checked only has login token
    //     if (!isOnAuth) appPageManager.bringPage("login");
    //     else appPageManager.bringPage("home");
    // }, (isStraight) => {
    //     //notification finished loading my own app to Estre UI
    //     if (isStraight) setTimeout(() => estreUi.checkOnReady(), 0);
    //     else estreUi.checkOnReady();
    // });


})
