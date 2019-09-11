import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map, ImageOverlay, Marker, Popup } from 'react-leaflet';

import manifest from '../../utils/manifest';
import ObservedImage from '../../components/ObservedImage';


import ChecklistFactory from '../Checklists/ChecklistFactory';

import './styles.css';

class Maps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    const { t, member } = this.props;

    this.checklistFactory = new ChecklistFactory(t, member.data.profile, member.characterId, false);
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    console.log(this.checklistFactory.corruptedEggs({ requested: [1101252162, 1101252163, 1101252168, 1101252169, 1101252171, 1101252172, 1101252173, 1101252174, 1101252175], data: true }))
  }

  render() {
    const mapWidth = 2200;
    const mapHeight = 2200;
    
    var viewWidth = 1920;
	  var viewHeight = 1080;

    var mapXOffset = (mapWidth-viewWidth)/2;
    var mapYOffset = -(mapHeight - viewHeight) / 2;
    
    var bounds = [[0, 0], [mapHeight, mapWidth]];

    const layer = {
      width: 1845,
      height: 1535,
      x: -100,
      y: -200,
      opacity: 0.6
    }

    var layerScale = 1;
    var layerX = layer.x ? layer.x : 0;
    var layerY = layer.y ? -layer.y : 0;
    var layerWidth = layer.width*layerScale;
    var layerHeight = layer.height*layerScale;

    var offsetX = (mapWidth-layerWidth)/2;
    var offsetY = (mapHeight-layerHeight)/2;

    offsetX += -offsetX+layerX+mapXOffset;
    offsetY += offsetY+layerY+mapYOffset;

    var layerBounds = [[offsetY, offsetX], [layerHeight + offsetY, layerWidth + offsetX]];
    
    console.log(layerWidth, layerHeight, layerBounds)

    return (
      <div className='view' id='maps'>
        <Map center={[mapHeight / 2, mapWidth / 2]} zoom='0' minZoom='-1' maxZoom='1' maxBounds={bounds} crs={L.CRS.Simple} attributionControl={false}>
          <ImageOverlay
            url="/static/images/extracts/maps/io_01a3-00000926.png"
            bounds={layerBounds}
            className='lol'
          />
        </Map>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    collectibles: state.collectibles
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(Maps);
