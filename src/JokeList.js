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
            // parse the JSON with the jokes from localStorage or if it doesn't exist assign an empty array
            jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
            loading: false,
        };
        this.seenJokes = new Set(this.state.jokes.map((j) => j.text));
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        // if there are no jokes getJokes
        if (this.state.jokes.length === 0) {
            this.setState({ loading: true }, this.getJokes);
        }
    }

    async getJokes() {
        try {
            let jokes = [];
            while (jokes.length < this.props.numJokesToGet) {
                let res = await axios.get(API_URL, {
                    headers: { Accept: "application/json" },
                });
                let newJoke = res.data.joke;
                if (!this.seenJokes.has(newJoke)) {
                    jokes.push({ id: uuid(), text: newJoke, votes: 0 });
                    this.seenJokes.add(newJoke);
                }
            }
            this.setState(
                // set the state with the new jokes
                (st) => ({
                    // turn off the loading screen and show the new jokes array before the old array
                    loading: false,
                    jokes: [...jokes, ...st.jokes],
                }),
                // save the jokes in local storage
                () =>
                    window.localStorage.setItem(
                        "jokes",
                        JSON.stringify(this.state.jokes)
                    )
            );
        } catch (err) {
            alert("Error: ", err);
            this.setState({ loading: false });
        }
    }

    handleVote(id, delta) {
        this.setState(
            (st) => ({
                jokes: st.jokes.map((j) =>
                    // check if the joke id matches the one selected and changes its vote.
                    j.id === id ? { ...j, votes: j.votes + delta } : j
                ),
            }),
            () =>
                window.localStorage.setItem(
                    "jokes",
                    JSON.stringify(this.state.jokes)
                )
        );
    }

    handleClick() {
        // run get jokes only after loading is set true
        this.setState({ loading: true }, this.getJokes);
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
        if (this.state.loading) {
            return (
                <div className="JokeList-spinner">
                    <i className="far fa-8x fa-laugh fa-spin"></i>
                    <h1 className="JokeList-title">Loading...</h1>
                </div>
            );
        }
        return (
            <div className="JokeList">
                <div className="JokeList-sidebar">
                    <h1 className="JokeList-title">
                        <span>Dad</span> Jokes
                    </h1>
                    <img
                        src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
                        alt="smiley-button"
                    />
                    <button
                        onClick={this.handleClick}
                        className="JokeList-getmore"
                    >
                        New Jokes
                    </button>
                </div>
                <div className="JokeList-jokes">{jokes}</div>
            </div>
        );
    }
}
