import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map, ImageOverlay, Marker } from 'react-leaflet';

import manifest from '../../utils/manifest';
import maps from '../../data/lowlines/maps';

import ChecklistFactory from '../../views/Checklists/ChecklistFactory';

import * as marker from './markers';

import './styles.css';

class Maps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layers: []
    };    
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    const { t, member } = this.props;

    this.checklistFactory = new ChecklistFactory(t, member.data.profile, member.characterId, false);

    this.process();
  }

  componentDidUpdate(pP) {
    const { t, member } = this.props;

    if (pP.member.data.updated !== member.data.updated) {
      this.checklistFactory = new ChecklistFactory(t, member.data.profile, member.characterId, false);
    }
  }

  process = async () => {

    let layers = maps['io'].map.layers;

    layers = await Promise.all(
      layers.map(async layer => {
        return await fetch(layer.image)
          .then(r => {
            return r.blob();
          })
          .then(blob => {
            const objectURL = URL.createObjectURL(blob);

            layer.image = objectURL;
            return layer;
          })
          .catch(e => {
            console.log(e);
          });
      })
    );

    layers = await Promise.all(
      layers.map(async layer => {
        if (layer.color) {
          const image = document.createElement('img');
          image.src = layer.image;

          await new Promise(resolve => {
            image.onload = e => resolve();
          });

          const canvas = document.createElement('canvas');
          canvas.width = layer.width;
          canvas.height = layer.height;
          const context = canvas.getContext('2d');

          context.fillStyle = layer.color;
          context.fillRect(0, 0, layer.width, layer.height);

          context.globalCompositeOperation = 'destination-atop';
          context.drawImage(image, 0, 0, layer.width, layer.height);

          layer.image = canvas.toDataURL();

          return layer;
        } else {
          return layer;
        }
      })
    );

    console.log(layers);

    this.setState({ layers });
  };

  render() {
    const mapWidth = maps['io'].map.width;
    const mapHeight = maps['io'].map.height;

    const viewWidth = 1920;
    const viewHeight = 1080;

    const mapXOffset = (mapWidth - viewWidth) / 2;
    const mapYOffset = -(mapHeight - viewHeight) / 2;

    const bounds = [[0, 0], [mapHeight, mapWidth]];

    console.log(maps);

    return (
      <div className='map'>
        <div className='leaflet-pane leaflet-background-pane'>
          {this.state.layers
            .filter(layer => layer.type === 'background')
            .map(layer => {
              return <img key={layer.id} alt={layer.id} src={layer.image} className={cx('layer-background', `layer-${layer.id}`, { 'layer-interaction-none': true })} />;
            })}
        </div>
        <Map center={[mapHeight / 2, mapWidth / 2]} zoom='0' minZoom='-3' maxZoom='1' maxBounds={bounds} crs={L.CRS.Simple} attributionControl={false}>
          {this.state.layers
            .filter(layer => layer.type !== 'background')
            .map(layer => {
              const layerScale = 1;
              const layerX = layer.x ? layer.x : 0;
              const layerY = layer.y ? -layer.y : 0;
              const layerWidth = layer.width * layerScale;
              const layerHeight = layer.height * layerScale;

              let offsetX = (mapWidth - layerWidth) / 2;
              let offsetY = (mapHeight - layerHeight) / 2;

              offsetX += -offsetX + layerX + mapXOffset;
              offsetY += offsetY + layerY + mapYOffset;

              const bounds = [[offsetY, offsetX], [layerHeight + offsetY, layerWidth + offsetX]];

              return <ImageOverlay key={layer.id} url={layer.image} bounds={bounds} />;
            })}
          {maps['io'].map.bubbles.map(bubble => bubble.nodes.filter(node => node.type === 'title').map((node, i) => {
            const markerOffsetX = mapXOffset+viewWidth/2;
            const markerOffsetY = mapYOffset+mapHeight+-viewHeight/2;

            const offsetX = markerOffsetX+(node.x ? node.x : 0);
            const offsetY = markerOffsetY + (node.y ? node.y : 0);
            
            const icon = marker.text([bubble.type], bubble.name);
            
            return <Marker key={i} position={[offsetY, offsetX]} icon={icon} />
          }))}
          {this.checklistFactory && this.checklistFactory.ghostScans({ data: true }).checklist.items.filter(i => i.destinationHash === maps['io'].destination.hash).map(node => {
            const markerOffsetX = mapXOffset+viewWidth/2;
            const markerOffsetY = mapYOffset+mapHeight+-viewHeight/2;

            const offsetX = markerOffsetX+(node.map.x ? node.map.x : 0);
            const offsetY = markerOffsetY+(node.map.y ? node.map.y : 0);

            const icon = marker.icon([node.completed ? 'completed' : ''], 'destiny-ghost');
            
            return <Marker key={node.itemHash} position={[offsetY, offsetX]} icon={icon} />
          })}
        </Map>
      </div>
    );
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
