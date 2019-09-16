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
      zoom: 0,
      destination: this.props.id || 'echo-mesa',
      destinations: {
        'tower': {
          loading: true,
          error: false,
          layers: []
        },
        'edz': {
          loading: true,
          error: false,
          layers: []
        },
        'new-pacific-arcology': {
          loading: true,
          error: false,
          layers: []
        },
        'echo-mesa': {
          loading: true,
          error: false,
          layers: []
        },
        'arcadian-valley': {
          loading: true,
          error: false,
          layers: []
        },
        'fields-of-glass': {
          loading: true,
          error: false,
          layers: []
        },
        'hellas-basin': {
          loading: true,
          error: false,
          layers: []
        },
        'tangled-shore': {
          loading: true,
          error: false,
          layers: []
        },
        'dreaming-city': {
          loading: true,
          error: false,
          layers: []
        }
      },
      checklists: [],
      ui: {
        destinations: true
      }
    };
  }

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

  generateChecklists = (destination = 'echo-mesa') => {
    const lists = [checklists[1697465175](), checklists[3142056444](), checklists[4178338182](), checklists[2360931290](), checklists[365218222](), checklists[2955980198]()].map(list => {
      const adjusted = {
        ...list,
        tooltipTable: 'DestinyChecklistDefinition',
        items: list.items
          .filter(i => i.destinationHash === maps[destination].destination.hash)
          .map(i => {
            return {
              ...i,
              tooltipHash: i.checklistHash
            };
          })
      };

      if (list.checklistId === 4178338182) {
        adjusted.checklistIcon = 'destiny-adventure2';
        adjusted.tooltipTable = 'DestinyActivityDefinition';
        adjusted.items = adjusted.items.map(i => {
          return {
            ...i,
            tooltipHash: i.activityHash
          };
        });
      }

      return adjusted;
    });

    console.log(lists);

    this.setState({
      checklists: lists
    });
  };

  loadLayers = async destination => {
    try {
      const d = {};

      let layers = await Promise.all(
        maps[destination].map.layers.map(async layer => {
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

      d.layers = layers;

      console.log(layers);

      this.setState(p => {
        return {
          destinations: {
            ...p.destinations,
            [destination]: {
              loading: false,
              error: false,
              layers
            }
          }
        };
      });
    } catch (e) {
      console.log(e);
      this.setState(p => {
        return {
          destinations: {
            ...p.destinations,
            [destination]: {
              loading: false,
              error: true,
              layers: []
            }
          }
        };
      });
    }
  };

  prepareLayers = async destination => {
    try {

      await this.loadLayers(this.state.destination);

      this.setState({ loading: false });

      await Promise.all(
        Object.keys(this.state.destinations).filter(key => this.state.destinations[key].loading).map(async key => {
          await this.loadLayers(key);
        })
      );

      console.log('done')
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
    const { id = this.state.destination } = this.props;

    if (href.includes(id)) {
      this.setState(p => {
        if (p.ui.destinations) {
          return {
            ...p,
            ui: {
              ...p.ui,
              destinations: false
            }
          };
        } else {
          return {
            ...p,
            ui: {
              ...p.ui,
              destinations: true
            }
          };
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
        };
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
      const { id: destinationId = 'echo-mesa' } = this.props;
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
            {this.state.destinations[destination] &&
              this.state.destinations[destination].layers
                .filter(layer => layer.type === 'background')
                .map(layer => {
                  return <img key={layer.id} alt={layer.id} src={layer.image} className={cx('layer-background', `layer-${layer.id}`, { 'interaction-none': true })} />;
                })}
          </div>
          <Map center={center} zoom={this.state.zoom} minZoom='-3' maxZoom='1' maxBounds={bounds} crs={L.CRS.Simple} attributionControl={false} zoomControl={false} onViewportChanged={this.setZoom} onLayerAdd={this.handler_layerAdd} onMoveEnd={this.handler_moveEnd} onZoomEnd={this.handler_zoomEnd}>
            {this.state.destinations[destination] &&
              this.state.destinations[destination].layers
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

                  const definitionDestination = maps[destination].destination.hash && manifest.DestinyDestinationDefinition[maps[destination].destination.hash];
                  const definitionBubble = bubble.hash && definitionDestination && definitionDestination.bubbles && definitionDestination.bubbles.find(b => b.hash === bubble.hash);

                  let name = bubble.name;
                  if (definitionBubble && definitionBubble.displayProperties.name && definitionBubble.displayProperties.name !== '') {
                    name = definitionBubble.displayProperties.name;
                  }

                  const icon = marker.text(['interaction-none', bubble.type], name);

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

                const icon = marker.icon({ hash: node.tooltipHash, table: checklist.tooltipTable }, [node.completed ? 'completed' : '', `checklistId-${checklist.checklistId}`], checklist.checklistIcon);
                // const icon = marker.text(['debug'], `${checklist.name}: ${node.name}`);

                return <Marker key={node.checklistHash} position={[offsetY, offsetX]} icon={icon} />;
              });
            })}
          </Map>
          <div className={cx('control', 'destinations', { visible: this.state.ui.destinations })}>
            <ul className='list'>
              {Object.keys(this.state.destinations).map(key => {
                const destination = maps[key].destination;

                let name = destination.hash && manifest.DestinyDestinationDefinition[destination.hash] && manifest.DestinyDestinationDefinition[destination.hash].displayProperties.name;
                if (destination.collectibleHash) {
                  name = manifest.DestinyCollectibleDefinition[destination.collectibleHash].displayProperties.name;
                } else if (destination.activityHash) {
                  name = manifest.DestinyActivityDefinition[destination.activityHash].displayProperties.name
                }

                return (
                  <li key={destination.id} className={cx('linked', { active: destination.id === destinationId, loading: this.state.destinations[destination.id].loading })}>
                    <div className='text'>
                      <div className='name'>{name}</div>
                      <div className='loading'>{this.state.destinations[destination.id].loading ? <Spinner mini /> : null}</div>
                    </div>
                    <Link to={`/maps/${destination.id}`} onClick={this.handler_toggleDestinationsList}></Link>
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
