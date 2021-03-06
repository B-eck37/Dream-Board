import React, { Component } from "react";
import Header from "../header/Header";
import axios from "axios";
import "../styles/Home.css";
import Masonry from "react-masonry-component";
import Grid from "react-grid-layout";
import { connect } from "react-redux";
import {login} from '../../ducks/reducer';


class Home extends Component {
  constructor() {
    super();
    this.state = {
      contents: [],
      messages: [],
      text: "",
      quote: "",
      grid: false
    };
    this.handleGrid = this.handleGrid.bind(this);
    this.backToMason = this.backToMason.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showQuote = this.showQuote.bind(this);
    this.hideQuote = this.hideQuote.bind(this);
  }

  componentDidMount() {
    axios.get('/user-data').then(response => {
      const user = response.data
      this.props.login(response.data)
      axios.get(`/myimages/${user.id}`).then(response => {
        axios.get("/home").then(response => {
          let res = response.data.ListBucketResult.Contents;
          this.setState({
            contents: res
          });
        })
      });
    }).catch(() => {
      this.props.history.push('/loggedout')
    });
  }
  showQuote(){
    axios.get('/homes').then(response => {
      let q = response.data.contents.quotes[0].quote;
      this.setState({
        quote: q
      })
    })
  }
  hideQuote(){
    this.setState({
      quote: ''
    })
  }
  handleChange(event) {
    this.setState({ text: event.target.value });
  }

  handleGrid() {
    this.setState({
      grid: true
    });
  }

  backToMason() {
    this.setState({
      grid: false
    });
  }

  render() {
    return (
      <div className='home-component'>
        <Header />
        <div className="home-background">
            <div className='buttons'>
              <button className='home-btn' onClick={this.showQuote}>Quote of the Day</button>
              {this.state.quote ? <button className='home-btn' onClick={this.hideQuote}>Hide Quote</button> : null}
            </div>
            <button className='home-btn' onClick={this.handleGrid}>
              Click Here for Drag and Drop
            </button>
            <button className='home-btn' onClick={this.backToMason}>Reset</button>
            {this.state.quote ? 
              <div className='quote'>
              {this.state.quote}
              </div>
               : null}
        </div>
            <div className="tile-background">
            {this.state.grid ? (
              <Grid className='t'>
                {this.state.contents.map((elem, i) => {
                  return (
                    <div key={i} className="tiles">
                      <img
                        key="c"
                        src={`https://s3-us-west-1.amazonaws.com/seize-the-dream/${
                          elem.Key
                        }`}
                        alt="display"
                        className="home-image"
                        data-grid={{ x: 4, y: 0, w: 1, h: 2 }}
                        onClick={this.imageClick}
                      />
                    </div>
                  );
                })}
              </Grid>
            ) : (
              <Masonry className='t' columnwidth={300}>
                {this.state.contents.map((elem, i) => {
                  // {console.log('element', elem)}
                  return (
                    <div key={i} className="tiles">
                      <img
                        key="c"
                        src={`https://s3-us-west-1.amazonaws.com/seize-the-dream/${
                          elem.Key
                        }`}
                        alt="display"
                        className="home-image"
                        data-grid={{ x: 4, y: 0, w: 1, h: 2 }}
                        onClick={this.imageClick}
                      />
                    </div>
                  );
                })}
              </Masonry>
            )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps, {login})(Home);
