import React, { Component } from "react";

export default class Joke extends Component {
    render() {
        return (
            <div className="Joke">
                <div className="Joke-buttons">
                    <i
                        onClick={this.props.upvote}
                        className="fas fa-arrow-up"
                    ></i>
                    <span>{this.props.votes}</span>
                    <i
                        onClick={this.props.downvote}
                        className="fas fa-arrow-down"
                    ></i>
                </div>
                <div className="Joke-text">{this.props.text}</div>
            </div>
        );
    }
}
