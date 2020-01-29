import axios from 'axios';

class Blog {
    constructor(site_config) {
        this.config = site_config;
        
    }

    getView(view_name) {
        return new Promise((resolve, reject) => {
            const path = this.config.endpoints.view;
            const endpoint = this.config.constructRoute(path, [view_name]);
            axios(endpoint, { withCredentials: true })
            .then(result => resolve(result))
            .catch(err => reject(err));
         });
    }
}