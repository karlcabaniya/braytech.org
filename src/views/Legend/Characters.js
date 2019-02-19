import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';
import Moment from 'react-moment';
import orderBy from 'lodash/orderBy';

import manifest from '../../utils/manifest';
import * as utils from '../../utils/destinyUtils';
import ObservedImage from '../../components/ObservedImage';

class Characters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { t, member } = this.props;
    const characters = member.data.profile.characters.data;
    const characterEquipment = member.data.profile.characterEquipment.data;
    const itemComponents = member.data.profile.itemComponents;

    const characterStamps = character => (
      <>
        <span className={cx('stamp', 'light', { max: character.light === 650 })}>{character.light}</span>
        <span className={cx('stamp', 'level')}>{character.baseCharacterLevel}</span>
        <span className={cx('stamp', 'class', utils.classTypeToString(character.classType).toLowerCase())}>{utils.classTypeToString(character.classType)}</span>
      </>
    );

    const paths = [

      // warlock

      {
        perkHash: 3020461809,
        slug: 'voidwalker_cataclysm',
        name: 'Attunment of Chaos',
        element: 'void',
        art: '01A3-0000120D'
      },
      {
        perkHash: 3247948194,
        slug: 'voidwalker_warp',
        name: 'Attunment of Fission',
        element: 'void',
        art: '01E3-000015A5'
      },
      {
        perkHash: 3403104354,
        slug: 'voidwalker_vortex',
        name: 'Attunment of Hunger',
        element: 'void',
        art: '01A3-0000120D'
      },
      {
        perkHash: 4143124338,
        slug: 'dawnblade_sky',
        name: 'Attunment of Sky',
        element: 'solar',
        art: '01A3-000011F1'
      },
      {
        perkHash: 1267155257,
        slug: 'dawnblade_well',
        name: 'Attunment of Grace',
        element: 'solar',
        art: '01E3-000015A2'
      },
      {
        perkHash: 4143124339,
        slug: 'dawnblade_flame',
        name: 'Attunment of Flame',
        element: 'solar',
        art: '01A3-000011F1'
      },
      {
        perkHash: 3972661583,             // chain lightning not found in manifest???
        slug: 'stormcaller_blink',
        name: 'Attunment of Conduction',
        element: 'arc',
        art: '01A3-000011A1'
      },
      {
        perkHash: 3368836162,
        slug: 'stormcaller_control',
        name: 'Attunment of Control',
        element: 'arc',
        art: '01E3-000015A1'
      },
      {
        perkHash: 941715127,
        slug: 'stormcaller_soul',
        name: 'Attunment of the Elements',
        element: 'arc',
        art: '01A3-000011A1'
      },

      // titan

      {
        perkHash: 1455271600,
        slug: 'sentinel_bubbleboi',
        name: 'Code of the Protector',
        element: 'void',
        art: '01A3-00001179'
      },
      {
        perkHash: 3455331284,
        slug: 'sentinel_bannershield',
        name: 'Code of the Commander',
        element: 'void',
        art: '01E3-0000159F'
      },
      {
        perkHash: 3467226737,           // shield bash 404.
        slug: 'sentinel_secondshield',
        name: 'Code of the Aggressor',
        element: 'void',
        art: '01A3-00001179'
      },
      {
        perkHash: 3845160153,           // hammer strike 404
        slug: 'sunbreaker_hammerstrike',
        name: 'Code of the Fire-Forged',
        element: 'solar',
        art: '01A3-0000116E'
      },
      {
        perkHash: 2401205106,
        slug: 'sunbreaker_maul',
        name: 'Code of the Devastator',
        element: 'solar',
        art: '01E3-0000159D'
      },
      {
        perkHash: 461974996,            // mortar blast 404
        slug: 'sunbreaker_sunspot',
        name: 'Code of the Siegebreaker',
        element: 'solar',
        art: '01A3-0000116E'
      },
      {
        perkHash: 4039448488,           // seismic strike
        slug: 'striker_seismicstrike',
        name: 'Code of the Earthshaker',
        element: 'arc',
        art: '01A3-0000112B'
      },
      {
        perkHash: 3326771373,
        slug: 'striker_thundercrash',
        name: 'Code of the Missile',
        element: 'arc',
        art: '01E3-00001598'
      },
      {
        perkHash: 2711909101,           // frontal assault
        slug: 'striker_trample',
        name: 'Code of the Juggernaut',
        element: 'arc',
        art: '01A3-0000112B'
      },

      // hunter

      {
        perkHash: 423378447,            // snare bomb
        slug: 'stalker_vanish',
        name: 'Way of the Trapper',
        element: 'void',
        art: '01A3-00001107'
      },
      {
        perkHash: 4099200371,
        slug: 'stalker_blades',
        name: 'Way of the Wraith',
        element: 'void',
        art: '01E3-00001596'
      },
      {
        perkHash: 3566763565,             // vanish in smoke
        slug: 'stalker_seismicstrike',
        name: 'Way of the Pathfinder',
        element: 'void',
        art: '01A3-00001107'
      },
      {
        perkHash: 3078584143,           // explosive knife
        slug: 'gunslinger_deadshot',
        name: 'Way of the Outlaw',
        element: 'solar',
        art: '01A3-000010F8'
      },
      {
        perkHash: 2041340886,
        slug: 'gunslinger_barrage',
        name: 'Way of a Thousand Cuts',
        element: 'solar',
        art: '01E3-00001595'
      },
      {
        perkHash: 593507152,
        slug: 'gunslinger_infinigun',
        name: 'Way of the Sharpshooter',
        element: 'solar',
        art: '01A3-000010F8'
      },
      {
        perkHash: 3310898262,           // combination blow
        slug: 'arcstrider_warrior',
        name: 'Way of the Warrior',
        element: 'arc',
        art: '01A3-000010B4'
      },
      {
        perkHash: 3310898269,
        slug: 'arcstrider_warrior',
        name: 'Way of the Current',
        element: 'arc',
        art: '01E3-00001593'
      },
      {
        perkHash: 1302127158,            // disorientating blow
        slug: 'arcstrider_wind',
        name: 'Way of the Wind',
        element: 'arc',
        art: '01A3-000010B4'
      },
      {
        perkHash: 7,
        slug: 'unknown',
        name: 'Unknown',
        element: '',
        art: ''
      }
    ];

    let chars = [];
    characters.forEach(character => {
      // console.log(character);

      let equipment = characterEquipment[character.characterId].items;
      equipment = equipment.map(item => ({
        ...manifest.DestinyInventoryItemDefinition[item.itemHash],
        ...item,
        itemComponents: {
          perks: itemComponents.perks.data[item.itemInstanceId] ? itemComponents.perks.data[item.itemInstanceId].perks : null,
          objectives: itemComponents.objectives.data[item.itemInstanceId] ? itemComponents.objectives.data[item.itemInstanceId].objectives : null
        }
      }));

      let subclass = equipment.find(item => item.inventory.bucketTypeHash === 3284755031);
      // console.log(subclass)
      let path = paths.find(attunement => {
        let match = subclass.itemComponents.perks.filter(perk => perk.isActive).find(perk => {
          return paths.find(attunement => attunement.perkHash === perk.perkHash);
        });
        if (match) {
          return attunement.perkHash === match.perkHash
        }
        else {
          return attunement.perkHash === 7
        }
      });

      // console.log(path);

      chars.push({
        element: (
          <div key={character.characterId} className='character'>
            <div className={cx('bg', path.element)}>
              <div className={cx('insignia', utils.classTypeToString(character.classType).toLowerCase())} />
              <div className='art'>
                <ObservedImage className='image' src={`/static/images/extracts/subclass-art/${path.art}.png`} />
                <div className='name'>
                  <div className='top' />
                  <div className='text'>{path.name}</div>
                  <div className='bottom' />
                </div>
              </div>
            </div>
            <div className='datum'>
              <div className='d'>
                <div className='v l'>{character.light}</div>
                <div className='n'>{t('power')}</div>
              </div>
              <div className='d'>
                <div className='v'>{utils.classTypeToString(character.classType)}</div>
                <div className='n'>{t('class')}</div>
              </div>
              <div className='d'>
                <div className='v'>{utils.raceTypeToString(character.raceType)} {utils.genderTypeToString(character.genderType)}</div>
                <div className='n'>{t('born')}</div>
              </div>
              <div className='d'>
                <div className='v'>{Math.floor(parseInt(character.minutesPlayedTotal) / 1440)}</div>
                <div className='n'>{Math.floor(parseInt(character.minutesPlayedTotal) / 1440) === 1 ? t('day played') : t('days played')}</div>
              </div>
            </div>
          </div>
        )
      });

    });



    // let chars = [];

    // characters.forEach(character => {
    //   chars.push({
    //     element: (
    //       <li key={character.characterId}>
    //         <div className='c'>
    //           {characterStamps(character)}
    //         </div>
    //         <div className='s t'>
    //           <div className='n'>Time played</div>
    //           <div className='v'>
    //             {Math.floor(parseInt(character.minutesPlayedTotal) / 1440) < 2 ? (
    //               <>
    //                 {Math.floor(parseInt(character.minutesPlayedTotal) / 1440)} {t('day')}
    //               </>
    //             ) : (
    //               <>
    //                 {Math.floor(parseInt(character.minutesPlayedTotal) / 1440)} {t('days')}
    //               </>
    //             )}
    //           </div>
    //         </div>
    //         <div className='s l'>
    //           <div className='n'>Last played</div>
    //           <div className='v'>
    //             <Moment fromNow>{character.dateLastPlayed}</Moment>
    //           </div>
    //         </div>
    //       </li>
    //     )
    //   });
    // });

    // return (
    //   <ul>
    //     {chars.map(c => c.element)}
    //   </ul>
    // );

    return chars.map(c => c.element);
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Characters);
