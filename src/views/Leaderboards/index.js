import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import Moment from 'react-moment';
import cx from 'classnames';



import './styles.css';

class Leaderboards extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() {
    window.scrollTo(0, 0);

    console.log(await this.voluspa())
  }

  voluspa = async (offset = 0, sort = 'triumphScore') => {
    const request = await fetch(`https://voluspa-a.braytech.org/?offset=${offset}&sort=${sort}`).then(r => r.json());

    if (!request.Response) {
      console.log('fetch error');
    }

    return request.Response;
  }

  render() {


    return (
      <div className='view' id='leaderboards'>
        
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    theme: state.theme
  };
}

export default compose(connect(mapStateToProps))(Leaderboards);
