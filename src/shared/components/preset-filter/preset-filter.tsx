import React, { ReactNode } from "react";
import { PresetType } from "../../../core/models/domain/types";


interface AppPresetFilterProps {
    selectedPreset: PresetType;
    onSelectPresetTap: (preset: PresetType) => void;
}

export class AppPresetFilter extends React.PureComponent<AppPresetFilterProps, any> {

    constructor(props: AppPresetFilterProps) {
        super(props);
    }

    public render() {
        return (
            <div className="btn-group mr-2">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={(e) => this.props.onSelectPresetTap('my')}>My Items</button>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={(e) => this.props.onSelectPresetTap('open')} > Open Items</button >
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={(e) => this.props.onSelectPresetTap('closed')} > Done Items</button >
            </div >
        );
    }
};
