import React from "react";
import { PtComment, PtUser } from "../../../../core/models/domain";
import { EMPTY_STRING } from "../../../../core/helpers";
import { BehaviorSubject } from "rxjs";
import { PtNewComment } from "../../../../shared/models/dto/pt-new-comment";

import './pt-item-chitchat.css';

interface PtItemChitchatComponentProps {
    comments$: BehaviorSubject<PtComment[]>;
    currentUser: PtUser;
    addNewComment: (newComment: PtNewComment) => void;
}

interface PtItemChitchatComponentState {
    newCommentText: string;
    comments: PtComment[];
}

export class PtItemChitchatComponent extends React.Component<PtItemChitchatComponentProps, PtItemChitchatComponentState> {

    constructor(props: PtItemChitchatComponentProps) {
        super(props);
        this.state = {
            newCommentText: EMPTY_STRING,
            comments: []
        };
    }

    public componentDidMount() {
        this.props.comments$.subscribe((comments: PtComment[]) => {
            this.setState({
                comments: comments
            });
        });
    }

    public onNewCommentChanged(e: any) {
        this.setState({
            newCommentText: e.target.value
        });
    }

    public onAddTapped() {
        const newTitle = this.state.newCommentText.trim();
        if (newTitle.length === 0) {
            return;
        }
        const newComment: PtNewComment = {
            title: newTitle
        };
        this.props.addNewComment(newComment);

        this.setState({
            newCommentText: EMPTY_STRING
        });
    }

    public render() {
        return (
            <React.Fragment>
                <form>
                    <div className="form-row align-items-center">

                        <img src={this.props.currentUser.avatar} className="mr-3 li-avatar rounded" />

                        <div className="col-sm-6">
                            <textarea defaultValue={this.state.newCommentText} onChange={(e) => this.onNewCommentChanged(e)} placeholder="Enter new comment..." className="form-control pt-text-comment-add"
                                name="newComment"></textarea>
                        </div>
                        <button type="button" onClick={() => this.onAddTapped()} className="btn btn-primary" disabled={!this.state.newCommentText}>Add</button>
                    </div>
                </form >

                <hr />

                <ul className="list-unstyled">
                    {
                        this.state.comments.map(comment => {
                            return (
                                <li key={comment.id} className="media chitchat-item">
                                    <img src={comment.user!.avatar} className="mr-3 li-avatar rounded" />
                                    <div className="media-body">
                                        <h6 className="mt-0 mb-1"><span>{comment.user!.fullName}</span><span className="li-date">{comment.dateCreated}</span></h6>

                                        <span className="chitchat-text ">{comment.title}</span>

                                    </div>
                                </li>
                            );
                        })
                    }
                </ul>
            </React.Fragment >
        );
    }
}
