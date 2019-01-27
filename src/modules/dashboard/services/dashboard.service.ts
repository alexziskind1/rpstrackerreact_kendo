import { DashboardRepository, DashboardFilter, FilteredIssues } from '../repositories/dashboard.repository';
import { TypeCounts, PriorityCounts, StatusCounts } from '../models';

export class DashboardService {

    constructor(
        private repo: DashboardRepository
    ) { }

    public getStatusCounts(filter: DashboardFilter): Promise<StatusCounts> {
        return this.repo.getStatusCounts(filter);
    }

    public getPriorityCounts(filter: DashboardFilter): Promise<PriorityCounts> {
        return this.repo.getPriorityCounts(filter);
    }

    public getTypeCounts(filter: DashboardFilter): Promise<TypeCounts> {
        return this.repo.getTypeCounts(filter);
    }

    public getFilteredIssues(filter: DashboardFilter): Promise<FilteredIssues> {
        return this.repo.getFilteredIssues(filter);
    }
}
