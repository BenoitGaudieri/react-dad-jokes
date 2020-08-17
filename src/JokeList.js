import React, { Component } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import Joke from "./Joke";
import "./JokeList.css";

const API_URL = "https://icanhazdadjoke.com/";

export default class JokeList extends Component {
    static defaultProps = {
        numJokesToGet: 10,
    };

    constructor(props) {
        super(props);
        this.state = {
            jokes: [],
        };
    }

    async componentDidMount() {
        let jokes = [];
        while (jokes.length < this.props.numJokesToGet) {
            let res = await axios.get(API_URL, {
                headers: { Accept: "application/json" },
            });
            jokes.push({ id: uuid(), text: res.data.joke, votes: 0 });
        }
        this.setState({ jokes: jokes });
    }

    handleVote(id, delta) {
        this.setState((st) => ({
            jokes: st.jokes.map((j) =>
                // check if the joke id matches the one selected and changes its vote.
                j.id === id ? { ...j, votes: j.votes + delta } : j
            ),
        }));
    }

    render() {
        const jokes = this.state.jokes.map((j) => (
            <Joke
                upvote={() => this.handleVote(j.id, 1)}
                downvote={() => this.handleVote(j.id, -1)}
                id={j.id}
                key={j.id}
                text={j.text}
                votes={j.votes}
            />
        ));
        return (
            <div className="JokeList">
                <div className="JokeList-sidebar">
                    <h1 className="JokeList-title">
                        <span>Dad</span> Jokes
                    </h1>
                    <img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" />
                    <button className="JokeList-getmore">New Jokes</button>
                </div>
                <div className="JokeList-jokes">{jokes}</div>
            </div>
        );
    }
}
