import { PriorityEnum } from "../../core/models/domain/enums";

export function getIndicatorClass(priority: PriorityEnum): string {
    switch (priority) {
        case PriorityEnum.Critical:
            return 'priority-critical';
        case PriorityEnum.High:
            return 'priority-high';
        case PriorityEnum.Medium:
            return 'priority-medium';
        case PriorityEnum.Low:
            return 'priority-low';
        default:
            return '';
    }
}
