import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
// import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import './IconAttributions.css';

/**
 *
 * IconAttributions JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const IconAttributions = (props) => {
  return (
    <React.Fragment>
      <div className='attributions-container'>
        <Row noGutters className='icon-attributions-header'>
          <h3>Icon Attributions</h3>
        </Row>
        <Row noGutters className='icon-attributions-header'>
          <h6>
          All icons sourced from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
          </h6>
        </Row>
        <Row noGutters className='attributions-scrollbar-row'>
          <Scrollbars>
            <p>
              <span>
                <img
                  src={'shield.png'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'hammer.png'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'SPEARMAN_ICON.svg'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'BOWMAN_ICON.svg'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'SWORDSMAN_ICON.svg'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'PISTOLIER_ICON.svg'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'HUGE_SNAKE_ICON.svg'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'COLOSSAL_SCALED_SNAKE_ICON.svg'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'TOXIC_HATCHLING_ICON.svg'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'health.svg'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'damage.svg'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'armor.svg'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'active_block.svg'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'poison_debuff.svg'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'research.svg'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'unit_count.svg'}
                  alt=""
                  className='tiny-icon-image'/> made by <a href="https://www.freepik.com" title="Freepik">Freepik</a>
              </span>
            </p>
            <p>
              <span>
                <img
                  src={'OVERSIZED_ANT_ICON.svg'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'HUMAN_ARMY.svg'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'INSECT_ARMY.svg'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'ASTEROID.svg'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'SETTLER.svg'}
                  alt=""
                  className='tiny-icon-image'/> made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a>
              </span>
            </p>
            <p>
              <span>
                <img
                  src={'GIANT_BEETLE_ICON.svg'}
                  alt=""
                  className='tiny-icon-image'/> <img
                  src={'VENOMOUS_SPITTER_ICON.svg'}
                  alt=""
                  className='tiny-icon-image'/>  made by <a href="https://www.flaticon.com/authors/eucalyp" title="Eucalyp">Eucalyp</a>
              </span>
            </p>
            <p>
              <span>
                <img
                  src={'tower.png'}
                  alt=""
                  className='tiny-icon-image'/>  made by <a href="https://www.flaticon.com/authors/good-ware" title="Good Ware">Good Ware</a>
              </span>
            </p>
            <p>
              <span>
                <img
                  src={'timer.png'}
                  alt=""
                  className='tiny-icon-image'/>  made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a>
              </span>
            </p>
            <p>
              <span>
                <img
                  src={'growth.svg'}
                  alt=""
                  className='tiny-icon-image'/>  made by <a href="https://www.flaticon.com/authors/icongeek26" title="Icongeek26">Icongeek26</a>
              </span>
            </p>
            <p>
              <span>
                <img
                  src={'GUEST_AVATAR.svg'}
                  alt=""
                  className='tiny-icon-image'/>  made by <a href="https://creativemarket.com/Becris" title="Becris">Becris</a>
              </span>
            </p>
          </Scrollbars>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default IconAttributions;