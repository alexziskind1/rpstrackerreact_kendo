import { CONFIG } from "../../config";
import { Store } from "../state/app-store";
import { PtUser } from "../models/domain";

export class PtUserService {
    private getUsersUrl(nameFilter?: string): string {
        let url = `${CONFIG.apiEndpoint}/users`;
        if (nameFilter) {
            url = url + '?name=' + nameFilter;
        }
        return url;
    }

    constructor(
        private store: Store
    ) { }

    public fetchUsers() {
        fetch(this.getUsersUrl())
            .then(response => response.json())
            .then((data: PtUser[]) => {
                data.forEach(u => {
                    u.avatar = `${CONFIG.apiEndpoint}/photo/${u.id}`;
                });
                this.store.set('users', data);
            });
    }
}
