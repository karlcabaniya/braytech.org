import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map, ImageOverlay, Marker } from 'react-leaflet';

import manifest from '../../utils/manifest';

import ChecklistFactory from '../Checklists/ChecklistFactory';

import './styles.css';

class Maps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layers: []
    };

    const { t, member } = this.props;

    this.checklistFactory = new ChecklistFactory(t, member.data.profile, member.characterId, false);
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.process();
  }

  process = async () => {
    let layers = [
      {
        id: 'background-upper',
        type: 'background',
        x: -120,
        y: -179,
        width: 2160,
        height: 1080,
        image: '/static/images/extracts/maps/01a3-000003DA_1.png',
        color: '#538e9f'
      },
      {
        id: 'background-lower',
        type: 'background',
        x: -120,
        y: 179,
        width: 2160,
        height: 1080,
        image: '/static/images/extracts/maps/01a3-000003D9_1.png',
        color: '#71c44e'
      },
      {
        id: 'map',
        x: -100,
        y: -200,
        width: 1845,
        height: 1535,
        image: '/static/images/extracts/maps/io_01a3-00000926.png',
        opacity: 0.6
      }
      // {
      //   id: 'template',
      //   x: 0,
      //   y: 0,
      //   width: 1920,
      //   height: 1080,
      //   image: 'template.png'
      // }
    ];

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
            image.src = image.src;
          });

          const canvas = document.createElement('canvas');
          canvas.width = layer.width;
          canvas.height = layer.height;
          const context = canvas.getContext('2d');

          const buffer_canvas = document.createElement('canvas');
          buffer_canvas.width = layer.width;
          buffer_canvas.height = layer.height;
          const buffer_context = buffer_canvas.getContext('2d');

          buffer_context.fillStyle = layer.color;
          buffer_context.fillRect(0, 0, layer.width, layer.height);

          buffer_context.globalCompositeOperation = 'destination-atop';
          buffer_context.drawImage(image, 0, 0, layer.width, layer.height);

          layer.image = buffer_canvas.toDataURL();

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
    const mapWidth = 2200;
    const mapHeight = 2200;

    const viewWidth = 1920;
    const viewHeight = 1080;

    const mapXOffset = (mapWidth - viewWidth) / 2;
    const mapYOffset = -(mapHeight - viewHeight) / 2;

    const bounds = [[0, 0], [mapHeight, mapWidth]];

    const icon = L.icon({
      iconUrl: `data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath fill='white' d='M754 538h270v34l-434 452h-124l-466-452v-34h302l226 228zM302 486h-302v-38l466-448h124l434 448v38h-270l-226-228zM645.993 511.923q0 49.027-34.9 83.927t-83.096 34.9-83.096-34.9-34.9-83.927 34.9-83.096 83.096-34.070 83.096 34.070 34.9 83.096z'%3E%3C/path%3E%3C/svg%3E%0A`,
      iconSize: [24, 24],
      className: 'ghost-scan'
    })

    return (
      <div className='view' id='maps'>
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
            {this.checklistFactory.ghostScans({ data: true }).checklist.items.filter(i => i.destinationHash === 2218917881).map(node => {
              const markerOffsetX = mapXOffset+viewWidth/2;
              const markerOffsetY = mapYOffset+mapHeight+-viewHeight/2;

              const offsetX = markerOffsetX+(node.map.x ? node.map.x : 0);
              const offsetY = markerOffsetY+(node.map.y ? node.map.y : 0);
              
              return <Marker key={node.itemHash} position={[offsetY, offsetX]} icon={icon} />
            })}
          </Map>
        </div>
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
