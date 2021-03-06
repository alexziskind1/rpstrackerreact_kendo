import React from "react";

import { Button, ButtonGroup } from '@progress/kendo-react-buttons';
import { ComboBox, ComboBoxChangeEvent } from '@progress/kendo-react-dropdowns';

import { DashboardFilter, DashboardRepository, FilteredIssues } from "../../repositories/dashboard.repository";
import { formatDateEnUs } from "../../../../core/helpers/date-utils";
import { ActiveIssuesComponent } from "../../components/active-issues/active-issues";
import { DashboardService } from "../../services/dashboard.service";
import { StatusCounts } from "../../models";
import { PtUser } from "../../../../core/models/domain";
import { Store } from "../../../../core/state/app-store";
import { Observable } from "rxjs";
import { PtUserService } from "../../../../core/services/pt-user-service";
import { DashboardChart } from "./dashboard-chart";

interface DateRange {
    dateStart: Date;
    dateEnd: Date;
}

interface DashboardPageState {
    statusCounts: StatusCounts;
    filter: DashboardFilter;
    users: PtUser[];
    issuesAll: FilteredIssues;
}

export class DashboardPage extends React.Component<any, DashboardPageState> {

    private store: Store = new Store();
    private dashboardRepo: DashboardRepository = new DashboardRepository();
    private dashboardService: DashboardService = new DashboardService(this.dashboardRepo);
    private ptUserService: PtUserService = new PtUserService(this.store);

    public users$: Observable<PtUser[]> = this.store.select<PtUser[]>('users');

    constructor(props: any) {
        super(props);
        this.state = {
            statusCounts: {
                activeItemsCount: 0,
                closeRate: 0,
                closedItemsCount: 0,
                openItemsCount: 0
            },
            filter: {},
            users: [],
            issuesAll: {
                categories: [],
                items: []
            }
        };
    }

    public componentDidMount() {
        this.users$.subscribe(users => {
            this.setState({
                users: users
            });
        });
        this.refresh();
    }

    public componentDidUpdate(prevProps: any, prevState: DashboardPageState) {
        if (this.state.filter.userId !== prevState.filter.userId ||
            this.state.filter.dateStart !== prevState.filter.dateStart ||
            this.state.filter.dateEnd !== prevState.filter.dateEnd) {
            this.refresh();
        }
    }

    private onMonthRangeTap(months: number) {
        const range = this.getDateRange(months);
        this.setState({
            filter: {
                userId: this.state.filter.userId,
                dateEnd: range.dateEnd,
                dateStart: range.dateStart
            }
        });
    }

    private getDateRange(months: number): DateRange {
        const now = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - months);
        return {
            dateStart: start,
            dateEnd: now
        };
    }

    private refresh() {

        Promise.all<StatusCounts, FilteredIssues>([
            this.dashboardService.getStatusCounts(this.state.filter),
            this.dashboardService.getFilteredIssues(this.state.filter)
        ]
        ).then(results => {
            this.setState({
                statusCounts: results[0],
                issuesAll: results[1]
            });
        });
    }

    public userFilterOpen() {
        this.ptUserService.fetchUsers();
    }

    private filterItemRender(li: any, itemProps: any) {
        const userItem = itemProps.dataItem as PtUser;
        const renderedRow = (
            <div className="row" style={{ marginLeft: 5 }}>
                <img className="li-avatar rounded mx-auto d-block" src={userItem.avatar} />
                <span style={{ marginLeft: 5 }}>{userItem.fullName}</span>
            </div>
        );
        return React.cloneElement(li, li.props, renderedRow);
    }

    public userFilterValueChange(e: ComboBoxChangeEvent) {
        const user = e.target.value;
        if (user) {
            this.setState({
                filter: { ...this.state.filter, userId: user.id }
            });
        } else {
            this.setState({
                filter: { ...this.state.filter, userId: undefined }
            });
        }
    }

    public render() {
        return (
            <div className="dashboard">

                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">

                    <div className="col-md order-md-first text-center text-md-left">
                        <h2>
                            <span className="small text-uppercase text-muted d-block">Statistics</span>
                            {
                                (this.state.filter.dateStart && this.state.filter.dateEnd) && (
                                    <span>  {formatDateEnUs(this.state.filter.dateStart)} - {formatDateEnUs(this.state.filter.dateEnd)}</span>
                                )
                            }
                        </h2>
                    </div>

                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="btn-group mr-2">

                            <ComboBox data={this.state.users} itemRender={this.filterItemRender} textField="fullName"
                                dataItemKey="id" onOpen={() => this.userFilterOpen()} onChange={(e) => this.userFilterValueChange(e)} style={{ width: 250 }} />

                            <ButtonGroup>
                                <Button type="button" look="flat" icon="calendar" onClick={(e) => this.onMonthRangeTap(3)}>3 Months</Button>
                                <Button type="button" look="flat" icon="calendar" onClick={(e) => this.onMonthRangeTap(6)}>6 Months</Button>
                                <Button type="button" look="flat" icon="calendar" onClick={(e) => this.onMonthRangeTap(12)}>1 Year</Button>
                            </ButtonGroup>

                        </div >

                    </div >
                </div >


                <div className="card">
                    <h3 className="card-header">Active Issues</h3>
                    <div className="card-block">

                        <ActiveIssuesComponent statusCounts={this.state.statusCounts} />

                        <div className="row">
                            <div className="col-sm-12">
                                <h3>All issues</h3>

                                <DashboardChart issuesAll={this.state.issuesAll} />

                            </div>
                        </div>
                    </div>
                </div >

            </div >
        );
    }
}
