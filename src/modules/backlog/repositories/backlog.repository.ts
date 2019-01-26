import { PtTask, PtItem, PtComment } from '../../../core/models/domain';
import { CONFIG } from '../../../config';
import { PresetType } from '../../../core/models/domain/types';


export class BacklogRepository {

    private getFilteredBacklogUrl(currentPreset: PresetType, currentUserId?: number) {
        switch (currentPreset) {
            case 'my':
                if (currentUserId) {
                    return `${CONFIG.apiEndpoint}/myItems?userId=${currentUserId}`;
                } else {
                    return `${CONFIG.apiEndpoint}/backlog`;
                }
            case 'open':
                return `${CONFIG.apiEndpoint}/openItems`;
            case 'closed':
                return `${CONFIG.apiEndpoint}/closedItems`;
            default:
                return `${CONFIG.apiEndpoint}/backlog`;
        }
    }

    private getPtItemUrl(itemId: number) {
        return `${CONFIG.apiEndpoint}/item/${itemId}`;
    }

    private postPtItemUrl() {
        return `${CONFIG.apiEndpoint}/item`;
    }

    private putPtItemUrl(itemId: number) {
        return `${CONFIG.apiEndpoint}/item/${itemId}`;
    }

    private deletePtItemUrl(itemId: number) {
        return `${CONFIG.apiEndpoint}/item/${itemId}`;
    }

    private postPtTaskUrl() {
        return `${CONFIG.apiEndpoint}/task`;
    }

    private putPtTaskUrl(taskId: number) {
        return `${CONFIG.apiEndpoint}/task/${taskId}`;
    }

    private deletePtTaskUrl(itemId: number, taskId: number) {
        return `${CONFIG.apiEndpoint}/task/${itemId}/${taskId}`;
    }

    private postPtCommentUrl() {
        return `${CONFIG.apiEndpoint}/comment`;
    }

    private deletePtCommentUrl(commentId: number) {
        return `${CONFIG.apiEndpoint}/comment/${commentId}`;
    }

    public getPtItems(
        currentPreset: PresetType,
        currentUserId: number | undefined
    ): Promise<PtItem[]> {
        return fetch(this.getFilteredBacklogUrl(currentPreset, currentUserId))
            .then((response: Response) => response.json());
    }


    public getPtItem(
        ptItemId: number,
    ): Promise<PtItem> {
        return fetch(this.getPtItemUrl(ptItemId))
            .then((response: Response) => response.json());
    }

    public insertPtItem(
        item: PtItem
    ): Promise<PtItem> {
        return fetch(this.postPtItemUrl(),
            {
                method: 'POST',
                body: JSON.stringify({ item: item }),
                headers: this.getJSONHeader()
            })
            .then((response: Response) => response.json());
    }

    public updatePtItem(
        item: PtItem,
    ): Promise<PtItem> {
        return fetch(this.putPtItemUrl(item.id),
            {
                method: 'PUT',
                body: JSON.stringify({ item: item }),
                headers: this.getJSONHeader()
            })
            .then((response: Response) => response.json());
    }

    /*
    public deletePtItem(
        itemId: number,
        successHandler: () => void
    ) {
        this.http.delete(
            this.deletePtItemUrl(itemId)
        )
            .subscribe(successHandler);
    }
 */

    public insertPtTask(
        task: PtTask,
        ptItemId: number
    ): Promise<PtTask> {
        return fetch(this.postPtTaskUrl(), {
            method: 'POST',
            body: JSON.stringify({ task: task, itemId: ptItemId }),
            headers: this.getJSONHeader()
        })
            .then(response => response.json());
    }

    public updatePtTask(
        task: PtTask,
        ptItemId: number
    ): Promise<PtTask> {
        return fetch(this.putPtTaskUrl(task.id), {
            method: 'PUT',
            body: JSON.stringify({ task: task, itemId: ptItemId }),
            headers: this.getJSONHeader()
        })
            .then(response => response.json());
    }

    public deletePtTask(
        task: PtTask,
        ptItemId: number
    ): Promise<boolean> {
        return fetch(this.deletePtTaskUrl(ptItemId, task.id), {
            method: 'POST'
        })
            .then(response => response.json());
    }


    public insertPtComment(
        comment: PtComment,
        ptItemId: number
    ): Promise<PtComment> {
        return fetch(this.postPtCommentUrl(), {
            method: 'POST',
            body: JSON.stringify({ comment: comment, itemId: ptItemId }),
            headers: this.getJSONHeader()
        })
            .then(response => response.json());
    }


    /*
       public deletePtComment(
           ptCommentId: number,
           successHandler: () => void
       ) {
           this.http.delete(this.deletePtCommentUrl(ptCommentId))
               .subscribe(successHandler);
       }
       */

    private getJSONHeader() {
        return new Headers({
            'Content-Type': 'application/json'
        })
    }
}
