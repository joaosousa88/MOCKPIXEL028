import React, { Component } from 'react';
import client from './utils/client';
import Welcome from './components/welcome/Welcome';
import Cars from './components/cars/Cars';
import logo from './media/svg/logo.svg';
import img from './media/img/amg.png';
import './App.css';

const cars = [{
  model: 'AMG',
  fuel: '302',
  ac: '22',
  checkUp: '9000',
  img: img,
}]

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            carStatus: {},
            showMap: false,
            active: false,
        }

        this.getStatus = this.getStatus.bind(this);
        this.update = this.update.bind(this);

    }

    componentWillMount() {
        this.getStatus();
    }

    getStatus() {
        client.get('/car/status')
        .then((response) => {
            return this.setState({
                carStatus: response.data,
            })
        })
        .catch(function (error) {
            // console.log(error);
        });
    }

    render() {
        const { carStatus: { doors, immobilizerEngaged: imob, geo }, showMap, active } = this.state;
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                </header>
                <Welcome name="Philipp Schiemer" />
                <Cars carStatus={ this.state.carStatus } update={ this.update } list={ cars }/>
            </div>
        );
    }

    update(url) {
        return client.get(`car/${url}`)
        .then((response) => {
            setTimeout(() => this.getStatus(), 3000);
        });
    }
}

export default App;
