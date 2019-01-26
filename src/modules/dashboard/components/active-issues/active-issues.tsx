import React from "react";
import { StatusCounts } from "../../models";
import './active-issues.css';

interface WelcomeProps {
    statusCounts: StatusCounts
}

export const ActiveIssuesComponent: React.SFC<WelcomeProps> = (props) => {

    if (!props.statusCounts) {
        return (
            <div className="card">
                <h3 className="card-header">Active Issues</h3>
                <div className="card-block">
                </div>
            </div >
        );
    }

    return (
        <div className="card">
            <h3 className="card-header">Active Issues</h3>
            <div className="card-block">

                <div className="row">

                    <div className="col-12 col-lg-6 col-xl pb-4 active-issues">
                        <span className="comp-label">
                            <strong>{props.statusCounts.activeItemsCount}</strong>
                            <small>Active issues</small>
                        </span>
                    </div>

                    <div className="col-12 col-lg-6 col-xl pb-4 text-success closed-issues">
                        <span className="comp-label">
                            <strong>{props.statusCounts.closedItemsCount}</strong>
                            <small>Closed issues</small>
                        </span>
                    </div>

                    <div className="col-12 col-lg-6 col-xl pb-4 text-danger open-issues">
                        <span className="comp-label">
                            <strong>{props.statusCounts.openItemsCount}</strong>
                            <small>Open issues</small>
                        </span>
                    </div>

                    <div className="col-12 col-lg-6 col-xl pb-4 close-rate">
                        <span className="comp-label">
                            <strong>{Intl.NumberFormat('en-US', { maximumSignificantDigits: 4 }).format(props.statusCounts.closeRate)}%</strong>
                            <small>Close rate</small>
                        </span>
                        <p className="m-0 small text-uppercase text-muted">
                            Highest:
                            100%
                            on Oct 11, 2018
                </p>
                        <p className="m-0 small text-uppercase text-muted">
                            Lowest:
                            20%
                            on Oct 9, 2018
                </p>

                    </div>

                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <h3>All issues</h3>

                    </div>
                </div>

            </div>
        </div >
    );
};
