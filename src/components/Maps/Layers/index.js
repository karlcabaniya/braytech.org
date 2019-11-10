import React from 'react';
import cx from 'classnames';

import { ImageOverlay } from 'react-leaflet';

import Spinner from '../../../components/UI/Spinner';
import maps from '../../../data/lowlines/maps/destinations';

import './styles.css';

const destinations = {
  tower: {
    loading: true,
    error: false,
    layers: []
  },
  edz: {
    loading: true,
    error: false,
    layers: []
  },
  'the-moon': {
    loading: true,
    error: false,
    layers: []
  },
  'new-pacific-arcology': {
    loading: true,
    error: false,
    layers: []
  },
  'arcadian-valley': {
    loading: true,
    error: false,
    layers: []
  },
  'echo-mesa': {
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
}

class Layers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: false,
      destinations
    };
  }

  componentDidMount() {
    this.mounted = true;

    this.prepareLayers(this.props.id);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(pP, pS) {
    if (pS.loading && !this.state.loading) {
      this.props.ready();
    }
  }

  loadLayers = async destination => {
    try {
      const layers = await Promise.all(
        maps[destination].map.layers.filter(layer => layer.type !== 'background').map(async layer => {
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

      if (this.mounted)
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
      if (this.mounted)
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
      // await this.loadLayers(this.props.id);

      // if (this.mounted) {
      //   this.setState({ loading: false });
      //   this.props.softReady();
      // };

      await Promise.all(
        Object.keys(this.state.destinations)
          .filter(key => this.state.destinations[key].loading)
          .map(async key => {
            await this.loadLayers(key);
          })
      );

      if (this.mounted) {
        this.setState({ loading: false });
        // this.props.ready();
      }

      console.log('done');
    } catch (e) {
      console.log(e);

      if (this.mounted) this.setState({ loading: false, error: true });
    }
  };

  render() {
    if (this.state.loading || this.state.error) {
      return null;
    } else {
      const map = maps[this.props.id].map;

      console.log(map, this.state.destinations[this.props.id])

      const viewWidth = 1920;
      const viewHeight = 1080;
  
      const mapXOffset = (map.width - viewWidth) / 2;
      const mapYOffset = -(map.height - viewHeight) / 2;
  
      const bounds = [[0, 0], [map.height, map.width]];

      return this.state.destinations[this.props.id].layers
        .filter(layer => layer.type === 'map')
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
        });
    }
  }
}

class BackgroundLayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: false,
      destinations
    };
  }

  componentDidMount() {
    this.mounted = true;

    this.prepareLayers(this.props.id);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  loadLayers = async destination => {
    try {
      const d = {};

      let layers = await Promise.all(
        maps[destination].map.layers.filter(layer => layer.type === 'background').map(async layer => {
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

      // console.log(layers);

      if (this.mounted)
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
      if (this.mounted)
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
      await this.loadLayers(this.props.id)

      if (this.mounted) {
        this.setState({ loading: false });
      }

      console.log('background layer done');
    } catch (e) {
      console.log(e);
      this.setState({ loading: false, error: true });
    }
  };

  render() {
    if (!this.state.loading && !this.state.error) {
      const layers = this.state.destinations[this.props.id].layers.filter(layer => layer.type === 'background');

      return (
        <div className='leaflet-pane leaflet-background-pane'>
          {layers.map(layer => <img key={layer.id} alt={layer.id} src={layer.image} className={cx('layer-background', `layer-${layer.id}`, { 'interaction-none': true })} />)}
        </div>
      )
    } else {
      return null;
    }
  }
}

export { Layers, BackgroundLayer };

export default Layers;
