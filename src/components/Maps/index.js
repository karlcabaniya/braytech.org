import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';
import cx from 'classnames';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map, ImageOverlay, Marker } from 'react-leaflet';

import manifest from '../../utils/manifest';
import maps from '../../data/lowlines/maps';
import Spinner from '../../components/UI/Spinner';
import checklists from '../../utils/checklists';

import * as marker from './markers';

import './styles.css';

class Maps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: false,
      destination: this.props.id || 'new-pacific-arcology',
      zoom: 0,
      layers: {},
      checklists: [],
      ui: {
        destinations: false
      }
    };
  }

  destinations = [
    {
      id: 'tower',
      activity: 1502633527
    },
    {
      id: 'edz',
      destination: 1199524104
    },
    {
      id: 'new-pacific-arcology',
      destination: 2388758973
    },
    {
      id: 'echo-mesa',
      destination: 2218917881
    },
    {
      id: 'arcadian-valley',
      destination: 126924919
    },
    {
      id: 'mercury',
      destination: 1993421442
    },
    {
      id: 'hellas-basin',
      destination: 308080871
    },
    {
      id: 'tangled-shore',
      destination: 359854275
    },
    {
      id: 'dreaming-city',
      destination: 2779202173
    }
  ];

  componentDidMount() {
    window.scrollTo(0, 0);

    this.prepareLayers(this.state.destination);
    this.generateChecklists(this.state.destination);
  }

  componentDidUpdate(pP, pS) {
    const { t, member, id } = this.props;

    if (pP.member.data.updated !== member.data.updated) {
      this.generateChecklists(this.state.destination);
    }

    if (pP.id !== id) {
      this.setState({ destination: id });
      this.generateChecklists(id);
    }

    if (pS.ui !== this.state.ui || pS.checklists !== this.state.checklists) {
      this.props.rebindTooltips();
    }
  }

  generateChecklists = destination => {
    const { t, member } = this.props;


    const lists = [
      checklists[1697465175](),
      checklists[3142056444](),
      checklists[4178338182](),
      checklists[2360931290](),
      checklists[365218222](),
      checklists[2955980198]()
    ].map(list => {
      const adjusted = {
        ...list,
        items: list.items.filter(i => i.destinationHash === maps[destination].destination.hash)
      };



      return adjusted;
    });

    console.log(lists);

    this.setState({
      checklists: lists
    });
  };

  prepareLayers = async destination => {
    try {
      const layers = {};

      await Promise.all(
        Object.entries(maps).map(async ([key, value]) => {
          let l = value.map.layers;

          l = await Promise.all(
            l.map(async layer => {
              if (layer.nodes) {
                await Promise.all(
                  layer.nodes.map(async layer => {
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

                return layer;
              } else {
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
              }
            })
          );

          l = await Promise.all(
            l.map(async layer => {
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

          layers[key] = l;
        })
      );

      // console.log(layers);

      this.setState({ loading: false, layers });
    } catch (e) {
      console.log(e);
      this.setState({ loading: false, error: true });
    }
  };

  setZoom = viewport => {
    this.setState({ zoom: viewport.zoom });
  };

  handler_toggleDestinationsList = e => {
    const href = e.target.href;
    const { id } = this.props;

    if (href.includes(id)) {
      this.setState(p => {
        if (p.ui.destinations) {
          return {
            ...p,
            ui: {
              ...p.ui,
              destinations: false
            }
          }
        } else {
          return {
            ...p,
            ui: {
              ...p.ui,
              destinations: true
            }
          }
        }
      });
    } else {
      this.setState(p => {
        return {
            ...p,
            ui: {
              ...p.ui,
              destinations: false
            }
          }
      });
    }
  };

  handler_layerAdd = debounce(e => {
    this.props.rebindTooltips();
  }, 200);

  handler_moveEnd = e => {
    this.props.rebindTooltips();
  };

  handler_zoomEnd = e => {
    this.props.rebindTooltips();
  };

  render() {
    if (this.state.loading) {
      return (
        <div className='map-omega loading'>
          <Spinner />
        </div>
      );
    } else if (this.state.error) {
      return <div className='map-omega loading'>error lol</div>;
    } else {
      const { id: destinationId = 'new-pacific-arcology' } = this.props;
      const destination = this.state.destination;

      const map = maps[destination].map;

      const viewWidth = 1920;
      const viewHeight = 1080;

      const mapXOffset = (map.width - viewWidth) / 2;
      const mapYOffset = -(map.height - viewHeight) / 2;

      const bounds = [[0, 0], [map.height, map.width]];

      const centerYOffset = -(map.center && map.center.y) || 0;
      const centerXOffset = (map.center && map.center.x) || 0;

      const center = [map.height / 2 + centerYOffset, map.width / 2 + centerXOffset];

      return (
        <div className={cx('map-omega', `zoom-${this.state.zoom}`)}>
          <div className='leaflet-pane leaflet-background-pane'>
            {this.state.layers[destination] &&
              this.state.layers[destination]
                .filter(layer => layer.type === 'background')
                .map(layer => {
                  return <img key={layer.id} alt={layer.id} src={layer.image} className={cx('layer-background', `layer-${layer.id}`, { 'interaction-none': true })} />;
                })}
          </div>
          <Map center={center} zoom={this.state.zoom} minZoom='-3' maxZoom='1' maxBounds={bounds} crs={L.CRS.Simple} attributionControl={false} zoomControl={false} onViewportChanged={this.setZoom} onLayerAdd={this.handler_layerAdd} onMoveEnd={this.handler_moveEnd} onZoomEnd={this.handler_zoomEnd}>
            {this.state.layers[destination] &&
              this.state.layers[destination]
                .filter(layer => layer.type !== 'background')
                .map(layer => {
                  const layerX = layer.x ? layer.x : 0;
                  const layerY = layer.y ? -layer.y : 0;
                  const layerWidth = layer.width * 1;
                  const layerHeight = layer.height * 1;

                  let offsetX = (map.width - layerWidth) / 2;
                  let offsetY = (map.height - layerHeight) / 2;

                  offsetX += -offsetX + layerX + mapXOffset;
                  offsetY += offsetY + layerY + mapYOffset;

                  const bounds = [[offsetY, offsetX], [layerHeight + offsetY, layerWidth + offsetX]];

                  if (layer.nodes) {
                    return layer.nodes.map(node => {
                      const nodeX = node.x ? node.x : 0;
                      const nodeY = node.y ? node.y : 0;

                      const nodeWidth = node.width * 1;
                      const nodeHeight = node.height * 1;

                      const nodeOffsetY = offsetY + (layerHeight - nodeHeight) / 2 + nodeY;
                      const nodeOffsetX = offsetX + (layerWidth - nodeWidth) / 2 + nodeX;

                      const bounds = [[nodeOffsetY, nodeOffsetX], [nodeHeight + nodeOffsetY, nodeWidth + nodeOffsetX]];

                      return <ImageOverlay key={node.id} url={node.image} bounds={bounds} opacity={node.opacity || 1} />;
                    });
                  } else {
                    return <ImageOverlay key={layer.id} url={layer.image} bounds={bounds} opacity={layer.opacity || 1} />;
                  }
                })}
            {maps[destination].map.bubbles.map(bubble =>
              bubble.nodes
                .filter(node => node.type === 'title')
                .map((node, i) => {
                  const markerOffsetX = mapXOffset + viewWidth / 2;
                  const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;

                  const offsetX = markerOffsetX + (node.x ? node.x : 0);
                  const offsetY = markerOffsetY + (node.y ? node.y : 0);

                  const icon = marker.text(['interaction-none', bubble.type], bubble.name);

                  return <Marker key={i} position={[offsetY, offsetX]} icon={icon} />;
                })
            )}
            {this.state.checklists.map(checklist => {
              return checklist.items.map(node => {
                const markerOffsetX = mapXOffset + viewWidth / 2;
                const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;

                const offsetX = markerOffsetX + (node.map.x ? node.map.x : 0);
                const offsetY = markerOffsetY + (node.map.y ? node.map.y : 0);

                // const text = checklist.checklistId === 3142056444 ? node.formatted.name : false;

                const icon = marker.icon({ hash: node.checklistHash, table: 'DestinyChecklistDefinition' }, [node.completed ? 'completed' : ''], checklist.checklistIcon);
                // const icon = marker.text(['debug'], `${checklist.name}: ${node.name}`);

                return <Marker key={node.checklistHash} position={[offsetY, offsetX]} icon={icon} />;
              });
            })}
          </Map>
          <div className={cx('control', 'destinations', { visible: this.state.ui.destinations })}>
            <ul className='list'>
              {this.destinations.map(d => {
                const name = d.destination && manifest.DestinyDestinationDefinition[d.destination] ? manifest.DestinyDestinationDefinition[d.destination].displayProperties.name : d.activity && manifest.DestinyActivityDefinition[d.activity] ? manifest.DestinyActivityDefinition[d.activity].displayProperties.name : '';

                return (
                  <li key={d.id} className={cx('linked', { active: d.id === destinationId })}>
                    <div className='text'>{name}</div>
                    <Link to={`/maps/${d.id}`} onClick={this.handler_toggleDestinationsList}></Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    }
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
