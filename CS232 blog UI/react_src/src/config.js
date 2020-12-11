class ServerConstants {
    constructor() {
       this.mode = "DEBUG";
    }
 }
 
 class SharedConfig{
    constructor(){
       this.root_endpoint = "http://localhost:5000";
 
       this.buildEndpoints = this.buildEndpoints.bind(this);
       this.buildEndpoints();
    }
 
    constructRoute(path, params)
    {
       let next_arg = 0; 
 
       // while there is still an unreplaced {parameter} in path
       let regex_find = path.search(/{([^}]*)}/);  
       while(path.search(/{([^}]*)}/) > -1)
       {
          // replace whatever's in {} with the next passed argument
          path = path.replace(/{([^}]*)}/, params[next_arg]);
          next_arg++; 
       }
       return path; 
    }
 
    buildEndpoints(){
       const root_endpoint = this.root_endpoint;
       this.endpoints = {
          root: root_endpoint,
          view: root_endpoint + '/{:view}'
       };
    }
 }
 
 class DebugConfig extends SharedConfig {
    constructor() {
       super();
    }
 }
 
 class ReleaseConfig extends SharedConfig {
    constructor() {
       super();
    }
 }
 
 class ConfigManager {
 
    static getConfig() {
       const constants = new ServerConstants();
       if(constants.mode === "DEBUG"){
          return new DebugConfig();
       }
       else{
          return new ReleaseConfig();
       }
    }
 }
 
 export { ConfigManager };
 export default ConfigManager;