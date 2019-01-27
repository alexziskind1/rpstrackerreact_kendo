import { StatusCounts, PriorityCounts, TypeCounts } from '../models';
import { CONFIG } from '../../../config';
import { PtItem } from '../../../core/models/domain';


export interface DashboardFilter {
    userId?: number;
    dateStart?: Date;
    dateEnd?: Date;
}

export interface ItemsForMonth {
    closed: PtItem[];
    open: PtItem[];
}

export interface FilteredIssues {
    categories: Date[];
    items: ItemsForMonth[];
}

export class DashboardRepository {
    constructor() { }

    private getFilterParamString(filter: DashboardFilter): string {
        const params = [
            filter.userId ? `userId=${filter.userId}` : '',
            filter.dateStart ? `dateStart=${filter.dateStart.toDateString()}` : '',
            filter.dateEnd ? `dateEnd=${filter.dateEnd.toDateString()}` : ''
        ];
        const paramStr = params.join('&');
        return paramStr;
    }
    private getStatusCountsUrl(paramStr: string): string {
        return `${CONFIG.apiEndpoint}/stats/statuscounts?${paramStr}`;
    }

    private getPriorityCountsUrl(paramStr: string): string {
        return `${CONFIG.apiEndpoint}/stats/prioritycounts?${paramStr}`;
    }

    private getTypeCountsUrl(paramStr: string): string {
        return `${CONFIG.apiEndpoint}/stats/prioritycounts?${paramStr}`;
    }

    private getFilteredIssuesUrl(paramStr: string): string {
        return `${CONFIG.apiEndpoint}/stats/filteredissues?${paramStr}`;
    }

    public getStatusCounts(filter: DashboardFilter): Promise<StatusCounts> {
        return fetch(this.getStatusCountsUrl(this.getFilterParamString(filter)))
            .then(response => response.json());
    }

    public getPriorityCounts(filter: DashboardFilter): Promise<PriorityCounts> {
        return fetch(this.getPriorityCountsUrl(this.getFilterParamString(filter)))
            .then(response => response.json());
    }

    public getTypeCounts(filter: DashboardFilter): Promise<TypeCounts> {
        return fetch(this.getTypeCountsUrl(this.getFilterParamString(filter)))
            .then(response => response.json());
    }

    public getFilteredIssues(filter: DashboardFilter): Promise<FilteredIssues> {
        return fetch(this.getFilteredIssuesUrl(this.getFilterParamString(filter)))
            .then(response => response.json());
    }
}
