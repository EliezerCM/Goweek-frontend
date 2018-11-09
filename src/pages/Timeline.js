import React, { Component } from 'react'
import api from '../services/api'
import socket from 'socket.io-client'

import twitterLogo from '../twitter.svg'
import './Timeline.css'

import Tweet from '../components/Tweet'

export default class Login extends Component {

    state = {
        tweets: [],
        newTweet: ''
    }

    async componentDidMount(){

        this.subscribetoEvents()

        const response = await api.get('tweets')

        this.setState({ tweets: response.data })
    }

    subscribetoEvents = () => {
        const io = socket('https://afternoon-anchorage-15995.herokuapp.com')

        io.on('tweet', data => {
            this.setState({ tweets: [data, ...this.state.tweets] })
        })
        io.on('like', async data => {
            const response = await api.get('tweets')

            this.setState({ tweets: response.data })
        })
    }

    handleNewTweet = async e => {
        if(e.keyCode !== 13) return

        const content = this.state.newTweet
        const author = localStorage.getItem('@GoTwitter:username')

        await api.post('tweets', { content, author })

        this.setState({ newTweet: '' })
    }

    handleInputChange = e => {
        this.setState({ newTweet: e.target.value })
    }

    render() {
        return (
            <div className='timeline-wrapper'>
                <img height={24} src={twitterLogo} alt='GoTwitter' />

                <form>
                    <textarea 
                        value={this.state.newTweet}
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleNewTweet} 
                        placeholder='O que esta acontecendo?' 
                    />
                </form>

                <ul className='tweet-list'>
                { this.state.tweets.map(tweet => (
                    <Tweet key={tweet._id} tweet={tweet}/>
                ))}
                </ul>
            </div>

        )
    }
}