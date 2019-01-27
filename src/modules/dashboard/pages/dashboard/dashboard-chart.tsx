import React from "react";

import {
    Chart,
    ChartSeries,
    ChartSeriesItem,
    ChartCategoryAxis,
    ChartCategoryAxisItem,
    ChartTitle,
    ChartLegend,
    ChartSeriesDefaults
} from '@progress/kendo-react-charts';
import 'hammerjs';
import { FilteredIssues } from "../../repositories/dashboard.repository";


interface DashboardChartProps {
    issuesAll: FilteredIssues
    //categories: any[];
    //itemsOpenByMonth: any[];
    //itemsClosedByMonth: any[];
}

interface DashboardChartState {
    categories: Date[];
    itemsOpenByMonth: number[];
    itemsClosedByMonth: number[];
}

export class DashboardChart extends React.Component<DashboardChartProps, DashboardChartState> {

    constructor(props: DashboardChartProps) {
        super(props);
        this.state = {
            categories: [],
            itemsOpenByMonth: [],
            itemsClosedByMonth: []
        };
    }

    public componentDidUpdate(prevProps: DashboardChartProps, prevState: DashboardChartState) {
        const cats = this.props.issuesAll.categories.map(c => new Date(c));

        const itemsOpenByMonth: number[] = [];
        const itemsClosedByMonth: number[] = [];

        this.props.issuesAll.items.forEach((item, index) => {
            itemsOpenByMonth.push(item.open.length);
            itemsClosedByMonth.push(item.closed.length);
        });

        if (prevState.categories.length !== cats.length ||
            prevState.itemsOpenByMonth.length !== itemsOpenByMonth.length ||
            prevState.itemsClosedByMonth.length !== itemsClosedByMonth.length) {
            this.setState({
                categories: cats,
                itemsOpenByMonth: itemsOpenByMonth,
                itemsClosedByMonth: itemsClosedByMonth
            });
        }
    }

    public render() {
        if (this.state.categories.length < 1) {
            return null;
        }
        return (
            <Chart>
                <ChartTitle text="Active Issues" />

                <ChartSeriesDefaults type="column" stack={true} gap={0.06} />

                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={this.state.categories} baseUnit="months" majorGridLines={{ visible: false }} labels={{ rotation: 'auto', margin: { top: 20 } }}></ChartCategoryAxisItem>
                </ChartCategoryAxis>

                <ChartSeries>
                    <ChartSeriesItem data={this.state.itemsOpenByMonth} opacity={0.7} color="#CC3458" />

                    <ChartSeriesItem data={this.state.itemsClosedByMonth} opacity={0.7} color="#35C473" />
                </ChartSeries>
            </Chart>
        );
    }

}
