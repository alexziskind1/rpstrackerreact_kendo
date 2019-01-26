import { Store } from '../../../core/state/app-store';
import { BacklogRepository } from '../repositories/backlog.repository';

import { PtItem, PtUser, PtTask, PtComment } from '../../../core/models/domain';

import { PriorityEnum, StatusEnum } from '../../../core/models/domain/enums';
import { getUserAvatarUrl } from '../../../core/helpers/user-avatar-helper';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CONFIG } from '../../../config';
import { PresetType } from '../../../core/models/domain/types';
import { datesForTask, datesForPtItem } from '../../../core/helpers/date-utils';
import { PtNewItem } from '../../../shared/models/dto/pt-new-item';
import { PtNewTask } from '../../../shared/models/dto/pt-new-task';
import { PtNewComment } from '../../../shared/models/dto/pt-new-comment';


export const tempCurrentUser = {
    avatar: getUserAvatarUrl(CONFIG.apiEndpoint, 21),
    dateCreated: new Date(),
    dateModified: new Date(),
    fullName: 'Alex Ziskind',
    id: 21
};


export class BacklogService {


    private get currentPreset() {
        return this.store.value.selectedPreset;
    }

    private get currentUserId() {
        if (this.store.value.currentUser) {
            return this.store.value.currentUser.id;
        } else {
            return undefined;
        }
    }


    constructor(
        private repo: BacklogRepository,
        private store: Store
    ) {
        this.store.value.currentUser = tempCurrentUser;
    }

    public getItems(preset: PresetType): Promise<PtItem[]> {
        return this.repo.getPtItems(preset, this.currentUserId)
            .then((ptItems: PtItem[]) => {

                ptItems.forEach(i => {
                    datesForPtItem(i);
                    this.setUserAvatarUrl(i.assignee);
                    i.comments.forEach(c => this.setUserAvatarUrl(c.user));
                });
                return ptItems;
            });
    }

    /*
    public getItemFromCacheOrServer(id: number) {
        // const selectedItem = _.find(this.store.value.backlogItems, i => i.id === id);
        const selectedItem = this.store.value.backlogItems.find(i => i.id === id);
        if (selectedItem) {

            this.store.set('currentSelectedItem', selectedItem);

        } else {
            this.getPtItem(id);
        }
    }
*/


    public getPtItem(id: number): Promise<PtItem> {
        return this.repo.getPtItem(id)
            .then((ptItem: PtItem) => {
                datesForPtItem(ptItem);
                this.setUserAvatarUrl(ptItem.assignee);
                ptItem.comments.forEach(c => this.setUserAvatarUrl(c.user));
                ptItem.tasks.forEach(t => datesForTask(t));
                return ptItem;
            });
    }


    public addNewPtItem(newItem: PtNewItem, assignee: PtUser): Promise<PtItem> {
        const item: PtItem = {
            id: 0,
            title: newItem.title,
            description: newItem.description,
            type: newItem.typeStr,
            estimate: 0,
            priority: PriorityEnum.Medium,
            status: StatusEnum.Open,
            assignee: assignee,
            tasks: [],
            comments: [],
            dateCreated: new Date(),
            dateModified: new Date()
        };
        return new Promise<PtItem>((resolve, reject) => {
            this.repo.insertPtItem(item)
                .then((nextItem: PtItem) => {
                    datesForPtItem(nextItem);
                    this.setUserAvatar(nextItem.assignee);

                    nextItem.tasks.forEach(t => datesForTask(t));
                    resolve(nextItem);
                });
        });
    }


    public updatePtItem(item: PtItem): Promise<PtItem> {
        return this.repo.updatePtItem(item);
    }

    /*

    public deletePtItem(item: PtItem) {
        this.repo.deletePtItem(item.id,
            () => {

                const updatedItems = this.store.value.backlogItems.filter((i) => {
                    return i.id !== item.id;
                });
                this.store.set('backlogItems', updatedItems);

            }
        );
    }
*/

    public addNewPtTask(newTask: PtNewTask, currentItem: PtItem): Promise<PtTask> {
        const task: PtTask = {
            id: 0,
            title: newTask.title,
            completed: false,
            dateCreated: new Date(),
            dateModified: new Date(),
            dateStart: newTask.dateStart ? newTask.dateStart : undefined,
            dateEnd: newTask.dateEnd ? newTask.dateEnd : undefined
        };
        return new Promise<PtTask>((resolve, reject) => {
            this.repo.insertPtTask(
                task,
                currentItem.id)
                .then((nextTask: PtTask) => {
                    datesForTask(nextTask);
                    resolve(nextTask);
                }
                );
        });
    }


    public updatePtTask(currentItem: PtItem, task: PtTask, toggle: boolean, newTitle?: string): Promise<PtTask> {
        const taskToUpdate: PtTask = {
            id: task.id,
            title: newTitle ? newTitle : task.title,
            completed: toggle ? !task.completed : task.completed,
            dateCreated: task.dateCreated,
            dateModified: new Date(),
            dateStart: task.dateStart ? task.dateStart : undefined,
            dateEnd: task.dateEnd ? task.dateEnd : undefined
        };
        return new Promise<PtTask>((resolve, reject) => {
            this.repo.updatePtTask(
                taskToUpdate,
                currentItem.id)
                .then((updatedTask: PtTask) => {
                    datesForTask(updatedTask);
                    resolve(updatedTask);
                }
                );
        });
    }

    public deletePtTask(currentItem: PtItem, task: PtTask): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.repo.deletePtTask(task, currentItem.id)
                .then((ok: boolean) => {
                    const updatedTasks = currentItem.tasks.filter(t => {
                        if (t.id !== task.id) {
                            return t;
                        }
                    });
                    currentItem.tasks = updatedTasks;
                    resolve(ok);
                }
                );
        });
    }

    public addNewPtComment(newComment: PtNewComment, currentItem: PtItem): Promise<PtComment> {
        const comment: PtComment = {
            id: 0,
            title: newComment.title,
            user: this.store.value.currentUser,
            dateCreated: new Date(),
            dateModified: new Date()
        };
        return new Promise<PtComment>((resolve, reject) => {
            this.repo.insertPtComment(
                comment,
                currentItem.id
            )
                .then((nextComment: PtComment) => {
                    resolve(nextComment);
                }
                );
        });
    }

    private setUserAvatarUrl(user: PtUser | undefined) {
        if (user) {
            user.avatar = `${CONFIG.apiEndpoint}/photo/${user.id}`;
        }
    }

    private setUserAvatar(user: PtUser) {
        user.avatar = getUserAvatarUrl(CONFIG.apiEndpoint, user.id);
    }

}
