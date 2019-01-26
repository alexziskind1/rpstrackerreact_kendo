import React from "react";
import { PtTask } from "../../../../core/models/domain";
import { EMPTY_STRING } from "../../../../core/helpers";
import { BehaviorSubject } from "rxjs";
import { PtTaskUpdate } from "../../../../shared/models/dto/pt-task-update";
import { PtNewTask } from "../../../../shared/models/dto/pt-new-task";

interface PtItemTasksComponentProps {
    tasks$: BehaviorSubject<PtTask[]>;
    addNewTask: (newTask: PtNewTask) => void;
    updateTask: (taskUpdate: PtTaskUpdate) => void;
}

interface PtItemTasksComponentState {
    newTaskTitle: string;
    tasks: PtTask[];
}

export class PtItemTasksComponent extends React.Component<PtItemTasksComponentProps, PtItemTasksComponentState> {

    private lastUpdatedTitle = EMPTY_STRING;

    constructor(props: PtItemTasksComponentProps) {
        super(props);
        this.state = {
            newTaskTitle: EMPTY_STRING,
            tasks: []
        };
    }

    public componentDidMount() {
        this.props.tasks$.subscribe((tasks: PtTask[]) => {
            this.setState({
                tasks: tasks
            });
        });
    }

    public onNewTaskTitleChanged(e: any) {
        this.setState({
            newTaskTitle: e.target.value
        });
    }

    public onAddTapped() {
        const newTitle = this.state.newTaskTitle.trim();
        if (newTitle.length === 0) {
            return;
        }
        const newTask: PtNewTask = {
            title: newTitle,
            completed: false
        };
        this.props.addNewTask(newTask);

        this.setState({
            newTaskTitle: EMPTY_STRING
        });
    }

    public toggleTapped(task: PtTask) {
        const taskUpdate: PtTaskUpdate = {
            task: task,
            toggle: true
        };
        this.props.updateTask(taskUpdate);
    }


    public taskTitleChange(task: PtTask, event: any) {
        if (task.title === event.target.value) {
            return;
        }
        this.lastUpdatedTitle = event.target.value;
    }

    public onTaskFocused(task: PtTask) {
        this.lastUpdatedTitle = task.title ? task.title : EMPTY_STRING;
    }

    public onTaskBlurred(task: PtTask) {
        if (task.title === this.lastUpdatedTitle) {
            return;
        }
        const taskUpdate: PtTaskUpdate = {
            task: task,
            toggle: false,
            newTitle: this.lastUpdatedTitle
        };

        this.lastUpdatedTitle = EMPTY_STRING;
        this.props.updateTask(taskUpdate);
    }

    public taskDelete(task: PtTask) {
        const taskUpdate: PtTaskUpdate = {
            task: task,
            toggle: false,
            delete: true
        };
        this.props.updateTask(taskUpdate);
    }

    public render() {
        return (
            <form>

                <div className="form-row align-items-center">
                    <div className="col-sm-6">
                        <input defaultValue={this.state.newTaskTitle} onChange={(e) => this.onNewTaskTitleChanged(e)} placeholder="Enter new task..." className="form-control pt-text-task-add"
                            name="newTask" />
                    </div>
                    <button type="button" onClick={() => this.onAddTapped()} className="btn btn-primary" disabled={!this.state.newTaskTitle}>Add</button>
                </div>

                <hr />

                {
                    this.state.tasks.map(task => {
                        return (
                            <div key={task.id} className="input-group mb-3 col-sm-6">
                                <div className="input-group-prepend">
                                    <div className="input-group-text">
                                        <input type="checkbox" checked={task.completed} onChange={() => this.toggleTapped(task)} aria-label="Checkbox for following text input"
                                            name={'checked' + task.id} />
                                    </div>
                                </div>
                                <input defaultValue={task.title} onChange={(e) => this.taskTitleChange(task, e)} onFocus={() => this.onTaskFocused(task)} onBlur={() => this.onTaskBlurred(task)}
                                    type="text" className="form-control" aria-label="Text input with checkbox" name={'tasktitle' + task.id} />

                                <div className="input-group-append">
                                    <button className="btn btn-danger" type="button" onClick={() => this.taskDelete(task)}>Delete</button>
                                </div>
                            </div>
                        );
                    })
                }

            </form>
        );
    }
}
