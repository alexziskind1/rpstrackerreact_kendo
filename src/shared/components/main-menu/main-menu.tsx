import React from "react";
import { Link } from "react-router-dom";



export class MainMenu extends React.PureComponent<any, any> {

    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <a className="navbar-brand col-sm-3 col-md-2 mr-0">
                    <img src="/assets/img/rpslogo.png" className="logo" />
                </a>
                <nav className="my-2 my-md-0 mr-md-3">
                    <Link className="p-2 text-light" to="/dashboard">Dashboard</Link>
                    <Link className="p-2 text-light" to="/backlog">Backlog</Link>
                </nav>
            </div>
        );
    }
};
