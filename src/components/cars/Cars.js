import React, { Component } from 'react';
import fuel from '../../media/svg/fuel.svg';
import ac from '../../media/svg/ac.svg';
import tool from '../../media/svg/tool.svg';
import close from '../../media/svg/close.svg';
import mark from '../../media/img/pin.png';
import './Cars.css';

import GoogleMapReact from 'google-map-react';

// Components
import Button from '../button/button';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class Cars extends Component {
    static defaultProps = {
        center: {lat: 59.95, lng: 30.33},
        zoom: 11
    };
    constructor(props) {
        super(props);

        this.state = {
            isActive: false,
            showMap: false,
        }

        this.lockDoor = this.lockDoor.bind(this);
        this.unlockDoor = this.unlockDoor.bind(this);
        this.blink = this.blink.bind(this);
        this.engageImmobilizer = this.engageImmobilizer.bind(this);
        this.disengageImmobilizer = this.disengageImmobilizer.bind(this);
        this.showMap = this.showMap.bind(this);
    }

  render() {
    const { list, active } = this.props;
    const { carStatus: { doors, immobilizerEngaged: imob, geo, fuelLevel } } = this.props;
    const { isActive, showMap, lockDoorLoading } = this.state;

    console.log('doors', doors);
    return (
      <div className="Cars">
        {
            list.map((car, idx) => (
              <div key={ idx } className={['Car', isActive && 'active'].join(' ')}>
                <div className="Car-info-wrapper">
                  <div className="Car-info">
                    <div className="Car-info-box">
                        <img className="Car-info-icon" src={ fuel } alt="" />
                        <div className="car-label">
                          { fuelLevel } <span className="car-label-a">%</span>
                        </div>
                    </div>
                    <div className="Car-info-box">
                        <img className="Car-info-icon" src={ tool } alt="" />
                        <div className="car-label">
                          { car.checkUp } <span className="car-label-a">km</span>
                        </div>
                    </div>
                    <div className="Car-info-box">
                        <img className="Car-info-icon" src={ ac } alt="" />
                        <div className="car-label">
                          { car.ac }º <span className="car-label-a">C</span>
                        </div>
                    </div>
                    <div className="Car-buttons">
                        <Button handleClick={ this.blink } text="Blink" />
                        <Button active={ imob } handleClick={ imob ? this.disengageImmobilizer : this.engageImmobilizer } text={ `${imob ? 'Disengage' : 'Engage'} immobilizer` } />
                        { doors &&
                            <Button isLoading={ lockDoorLoading } active={ !doors.locked } handleClick={ doors.locked ? this.unlockDoor : this.lockDoor } text={ `Doors: ${ doors.locked ? ' open' : 'close' }` } />
                        }
                        {
                            !!geo &&
                                <Button active={ showMap }handleClick={ this.showMap } text="Where am I?" />
                        }
                    </div>
                  </div>
                    <button className="Car-img" onClick={ this.handleOnClickOpen }>
                        <img src={`../../${ car.img }`} alt={ car.model } />
                    </button>
                </div>

                {
                    !!geo && showMap &&
                    <div className="map-wrapper">
                        <div style={ { height: '200px', visibility: showMap ? 'visible' : 'hidden' } }>
                            <GoogleMapReact
                                defaultCenter={{ lat: geo.latitude, lng: geo.longitude }}
                                defaultZoom={16}
                              >
                                <AnyReactComponent
                                  lat={geo.latitude}
                                  lng={geo.longitude}
                                  text={<img src={ mark } alt={ car.model } />}
                                />
                              </GoogleMapReact>
                          </div>
                    </div>
                }


                <button className="close" onClick={ this.handleOnClickClose }>
                  <img src={ close } alt="" />
                </button>
              </div>
            ))
        }
      </div>
    );
  }

  handleOnClickOpen = () => {
      if (!this.state.isActive) {
          this.setState({
              isActive: true,
          })
      }
  }

  handleOnClickClose = () => {
      if (this.state.isActive) {
          this.setState({
              isActive: false,
          })
      }
  }

  blink() {
      this.props.update('blink');
  }

  lockDoor() {
    console.log('lockDoor', this.props.carStatus.doors);
      this.setState({
          lockDoorLoading: true,
      });
      this.props.update('doors/lock').then(() => this.setState({
          lockDoorLoading: false,
      }));
  }

  engageImmobilizer() {
      this.props.update('immobilizer/engage');
  }

  disengageImmobilizer() {
      this.props.update('immobilizer/disengage');
  }

  unlockDoor() {
    console.log('unlockDoor', this.props.carStatus.doors);
      this.setState({
          lockDoorLoading: true,
      });
      this.props.update('doors/unlock').then(() => this.setState({
          lockDoorLoading: false,
      }));
  }

  showMap = () => {
      this.setState({
          showMap: true,
      })
  }
}

export default Cars;
