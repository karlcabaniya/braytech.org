import React from 'react';
import cx from 'classnames';
import orderBy from 'lodash/orderBy';

import ObservedImage from '../components/ObservedImage';
import manifest from './manifest';

const interpolate = (investmentValue, displayInterpolation) => {
  const interpolation = [...displayInterpolation].sort((a, b) => a.value - b.value);

  const upperBound = interpolation.find(point => point.value >= investmentValue);
  const lowerBound = [...interpolation].reverse().find(point => point.value <= investmentValue);

  if (!upperBound && !lowerBound) {
    console.log('Invalid displayInterpolation');
  }

  if (!upperBound || !lowerBound) {
    if (upperBound) {
      return upperBound.weight;
    } else if (lowerBound) {
      return lowerBound.weight;
    } else {
      console.log('Invalid displayInterpolation');
    }
  }

  const range = upperBound.value - lowerBound.value;
  const factor = range > 0 ? (investmentValue - lowerBound.value) / 100 : 1;

  const displayValue = lowerBound.weight + (upperBound.weight - lowerBound.weight) * factor;
  return Math.round(displayValue);
};

export const getSockets = (item, traitsOnly = false, mods = true, initialOnly = false, randomizedPlugItems = false, socketExclusions = [], uiStyleTooltips = false, showHiddenStats = false) => {

  let statGroup = item.stats ? manifest.DestinyStatGroupDefinition[item.stats.statGroupHash] : false;

  let statModifiers = [];

  let socketsOutput = [];
  let masterwork = false;

  if (item.sockets) {
    let socketEntries = item.sockets.socketEntries;

    if (item.itemComponents && item.itemComponents.sockets) {
      mods = true;
      Object.keys(socketEntries).forEach(key => {
        socketEntries[key].singleInitialItemHash = item.itemComponents.sockets[key].plugHash || 0;
        socketEntries[key].reusablePlugItems = item.itemComponents.sockets[key].reusablePlugs || [];
        socketEntries[key].plugObjectives = item.itemComponents.sockets[key].plugObjectives;
        if (socketEntries[key].reusablePlugItems.length === 0 && socketEntries[key].singleInitialItemHash !== 0) {
          socketEntries[key].reusablePlugItems.push({
            plugItemHash: socketEntries[key].singleInitialItemHash
          });
        }
        // sometimes items don't include their initial plug in their plugItems array. this seems to be true for year 1 masterworks
        if (socketEntries[key].singleInitialItemHash && !socketEntries[key].reusablePlugItems.find(plug => socketEntries[key].singleInitialItemHash === plug.plugItemHash)) {
          socketEntries[key].reusablePlugItems.push({
            plugItemHash: socketEntries[key].singleInitialItemHash
          });
        }
      });
    }

    Object.keys(socketEntries).forEach(key => {
      let socket = socketEntries[key];

      let categoryHash = item.sockets.socketCategories.find(category => category.socketIndexes.includes(parseInt(key, 10))) ? item.sockets.socketCategories.find(category => category.socketIndexes.includes(parseInt(key, 10))).socketCategoryHash : false;

      let modCategoryHash = [3379164649, 590099826, 2685412949, 4243480345, 590099826];

      let plugItems = randomizedPlugItems ? socket.reusablePlugItems.concat(socket.randomizedPlugItems).filter((p, i, self) =>
        i === self.findIndex((t) => (
          t.plugItemHash === p.plugItemHash
        ))
      ) : socket.reusablePlugItems;

      // plugItems.forEach(p => {
      //   let plug = manifest.DestinyInventoryItemDefinition[p.plugItemHash];

      //   if (plug.hash === socket.singleInitialItemHash) {
      //     console.log(plug)
      //     plug.investmentStats.forEach(modifier => {
      //       let index = statModifiers.findIndex(stat => stat.statHash === modifier.statTypeHash);
      //       if (index > -1) {
      //         statModifiers[index].value = statModifiers[index].value + modifier.value;
      //         statModifiers[index].mod = modCategoryHash.includes(categoryHash) ? statModifiers[index].mod + modifier.value : statModifiers[index].mod
      //       } else {
      //         statModifiers.push({
      //           statHash: modifier.statTypeHash,
      //           value: modifier.value,
      //           mod: modCategoryHash.includes(categoryHash) ? modifier.value : 0
      //         });
      //       }
      //     });
      //   }
      // });

      let plugActive = manifest.DestinyInventoryItemDefinition[socket.singleInitialItemHash];

      if (plugActive && plugActive.investmentStats) {

        if (plugActive.plug && plugActive.plug.uiPlugLabel === 'masterwork') {
          masterwork = true;
        }

        plugActive.investmentStats.forEach(modifier => {
          let index = statModifiers.findIndex(stat => stat.statHash === modifier.statTypeHash);
          if (index > -1) {
            statModifiers[index].value = statModifiers[index].value + modifier.value;
            statModifiers[index].mod = modCategoryHash.includes(categoryHash) ? statModifiers[index].mod + modifier.value : statModifiers[index].mod
          } else {
            statModifiers.push({
              statHash: modifier.statTypeHash,
              value: modifier.value,
              mod: modCategoryHash.includes(categoryHash) ? modifier.value : 0
            });
          }
        });

      }

      if (socketExclusions.includes(socket.singleInitialItemHash) || (!mods && modCategoryHash.includes(categoryHash))) {
        return;
      }

      let socketPlugs = [];

      plugItems.forEach(p => {
        let plug = manifest.DestinyInventoryItemDefinition[p.plugItemHash];

        if (traitsOnly && !plug.itemCategoryHashes.includes(3708671066)) {
          console.log(item)
          return;
        }
        if (initialOnly && plug.hash !== socket.singleInitialItemHash) {
          return;
        }

        socketPlugs.push({
          active: plug.hash === socket.singleInitialItemHash,
          definition: plug,
          element: (
            <div key={plug.hash} className={cx('plug', 'tooltip', { 'is-intrinsic': plug.itemCategoryHashes && plug.itemCategoryHashes.includes(2237038328), 'is-active': plug.hash === socket.singleInitialItemHash })} data-itemhash={plug.hash} data-tooltiptype={ uiStyleTooltips ? 'ui' : '' }>
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${plug.displayProperties.icon ? plug.displayProperties.icon : `/img/misc/missing_icon_d2.png`}`} />
              <div className='text'>
                <div className='name'>{plug.displayProperties.name ? plug.displayProperties.name : `Unknown`}</div>
                <div className='description'>{plug.itemTypeDisplayName}</div>
              </div>
            </div>
          )
        });
      });

      let singleInitialItem = false;
      if (socket.singleInitialItemHash !== 0) {
        let plug = manifest.DestinyInventoryItemDefinition[socket.singleInitialItemHash];
        singleInitialItem = {
          definition: plug,
          element: (
            <div key={plug.hash} className={cx('plug', 'tooltip', { 'is-intrinsic': plug.itemCategoryHashes.includes(2237038328), 'is-active': plug.hash === socket.singleInitialItemHash })} data-itemhash={plug.hash} data-tooltiptype={ uiStyleTooltips ? 'ui' : '' }>
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${plug.displayProperties.icon}`} />
              <div className='text'>
                <div className='name'>{plug.displayProperties.name}</div>
                <div className='description'>{plug.itemTypeDisplayName}</div>
              </div>
            </div>
          )
        };
      }

      if (socket.singleInitialItemHash !== 0 && !socketPlugs.find(plug => plug.definition.hash === socket.singleInitialItemHash)) {
        socketPlugs.unshift(singleInitialItem);
      }

      if (!singleInitialItem && socketPlugs.length === 0) {
        return;
      }

      if (singleInitialItem && traitsOnly && !singleInitialItem.definition.itemCategoryHashes.includes(3708671066)) {
        console.log('wtf is this');
        return;
      }

      socketsOutput.push({
        categoryHash,
        socketTypeHash: socket.socketTypeHash,
        singleInitialItem,
        plugs: socketPlugs
      });
    });
  }

  console.log(socketsOutput, statModifiers)

  let statsOutput = [];

  if (item.itemType === 3) {
    statGroup.scaledStats.forEach(stat => {
      let statModifier = statModifiers.find(modifier => modifier.statHash === stat.statHash);
      let statDef = manifest.DestinyStatDefinition[stat.statHash];

      if (Object.keys(item.stats.stats).includes(stat.statHash.toString())) {
        let modifier = statModifier ? statModifier.value : 0;

        let instanceStat = item.itemComponents && item.itemComponents.stats ? Object.values(item.itemComponents.stats).find(s => s.statHash === stat.statHash) : false;

        let investmentStat = item.investmentStats.find(investment => investment.statTypeHash === stat.statHash);
        let scaledStats = statGroup.scaledStats.find(scale => scale.statHash === stat.statHash);

        let interpolatatedModifier = scaledStats && investmentStat ? interpolate(investmentStat.value + modifier, scaledStats.displayInterpolation) : modifier;

        let value = interpolatatedModifier;
        if (stat.hash === 3871231066) {
          value = value < 1 ? 1 : value;
        }

        let modValue = statModifier ? statModifier.mod : 0;
        
        value = instanceStat ? instanceStat.value : value;
        value = modValue > 0 ? value - modValue : value;

        statsOutput.push({
          displayAsNumeric: stat.displayAsNumeric,
          statHash: stat.statHash,
          element: (
            <div key={stat.statHash} className='stat'>
              <div className='name'>{statDef.displayProperties.name}</div>
              <div className={cx('value', { bar: !stat.displayAsNumeric, int: stat.displayAsNumeric, masterwork: modValue > 0 })}>
                {!stat.displayAsNumeric ? (
                  <>
                    <div className='bar' data-value={value} style={{ width: `${value}%` }} />
                    {modValue > 0 ? <div className='tip' style={{ width: `${modValue}%` }} /> : null}
                  </>
                ) : (
                  value
                )}
              </div>
            </div>
          )
        });
      }
    });

    if (showHiddenStats) {
      Object.values(item.stats.stats).forEach(stat => {
        if (!statsOutput.find(s => s.statHash === stat.statHash)) {
  
          let statDef = manifest.DestinyStatDefinition[stat.statHash];
  
          let value;
  
          // let instanceStat = item.itemComponents && item.itemComponents.stats ? Object.values(item.itemComponents.stats).find(s => s.statHash === stat.statHash) : false;
  
          let investmentStat = item.investmentStats.find(investment => investment.statTypeHash === stat.statHash);
  
          value = investmentStat ? investmentStat.value : 0;
  
          if (value < 1) {
            return;
          }
  
          statsOutput.push({
            statHash: stat.statHash,
            displayAsNumeric: false,
            element: (
              <div key={stat.statHash} className='stat'>
                <div className='name'>{statDef.displayProperties.name}</div>
                <div className={cx('value', { bar: true })}>
                  <div className='bar' data-value={value} style={{ width: `${value}%` }} />
                </div>
              </div>
            )
          });
        }
      });
    }
  }
  if (item.itemType === 2) {
    statGroup.scaledStats.forEach(stat => {
      let statModifier = statModifiers.find(modifier => modifier.statHash === stat.statHash);
      let statDef = manifest.DestinyStatDefinition[stat.statHash];

      let modifier = statModifier ? statModifier.value : 0;

      let investmentStat = item.investmentStats.find(investment => investment.statTypeHash === stat.statHash);
      let scaledStats = statGroup.scaledStats.find(scale => scale.statHash === stat.statHash);

      let value = Math.min((investmentStat ? investmentStat.value : 0) + modifier, scaledStats.maximumValue);

      statsOutput.push({
        element: (
          <div key={stat.statHash} className='stat'>
            <div className='name'>{statDef.displayProperties.name}</div>
            <div className={cx('value', { bar: !stat.displayAsNumeric, int: stat.displayAsNumeric })}>{!stat.displayAsNumeric ? <div className='bar' data-value={value} style={{ width: `${(value / 3) * 100}%` }} /> : value}</div>
          </div>
        )
      });
    });
  }

  // push numeric stats to the bottom
  statsOutput = orderBy(statsOutput, [stat => stat.displayAsNumeric], ['asc']);

  // push mods to the bottom
  socketsOutput = orderBy(socketsOutput, [socket => socket.categoryHash], ['desc']);

  return {
    stats: statsOutput,
    sockets: socketsOutput,
    masterwork
  };
};

export const getOrnaments = hash => {
  let item = manifest.DestinyInventoryItemDefinition[hash];

  let ornaments = [];

  let defaultOrnamentHash = [1959648454, 2931483505];
  if (item.sockets) {
    Object.keys(item.sockets.socketEntries).forEach(key => {
      if (defaultOrnamentHash.includes(item.sockets.socketEntries[key].singleInitialItemHash)) {
        item.sockets.socketEntries[key].reusablePlugItems
          .filter(plug => !defaultOrnamentHash.includes(plug.plugItemHash))
          .forEach(plug => {
            let def = manifest.DestinyInventoryItemDefinition[plug.plugItemHash];
            ornaments.push({
              element: (
                <div key={def.hash} className={cx('plug', 'tooltip')} data-itemhash={def.hash}>
                  <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${def.displayProperties.icon}`} />
                  <div className='text'>
                    <div className='name'>{def.displayProperties.name}</div>
                    <div className='description'>Ornament</div>
                  </div>
                </div>
              )
            });
          });
      }
    });
  }

  return ornaments;
};
