import React, { Component } from "react";
import Header from "../header/Header";
import "../styles/Upload.css";
import axios from 'axios';
import {connect} from 'react-redux';
import {login} from '../../ducks/reducer';


class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      // imagePreviewUrl: "",
      text: "",
      categories: [],
      category: '',
      inst: false,
    };
    this.showInstructions = this.showInstructions.bind(this);
  }

  componentDidMount(){
    axios.get('/user-data').then(response => {
      const user = response.data
      this.props.login(user)
      axios.get('/getcategory').then(response => {
        console.log(response.data)
        this.setState({
          categories: response.data
        })
      })
    }).catch(() => {
      this.props.history.push('/loggedout')
    });
  }

  _handleSubmit(e) {
    e.preventDefault();
    console.log("uploading-", this.state.file, this.state.text, this.props.user, this.state.category, 'Hey');
    const {id} = this.props.user
    axios.post(`/uploadimage/${id}`, {
      user_id: id,
      image_url: this.state.file,
      image_text: this.state.text,
      category: this.state.category,
    })
    .then(response => {
        this.props.history.push(`/mydreams/${id}`)
    })
  }

  _handleTextChange(e){
    this.setState({
      text: e.target.value
    });
    console.log(this.state.text);
  }

  _handleImageChange(e) {
    e.preventDefault();
    let file = e.target.value;
      this.setState({
        file: file,
      });
  }

  //CATEGORY
  handleCategory(e){
    console.log('target', e.target.value)
    //eslint-disable-next-line
    this.state.categories.filter((elem) => {
      if(elem.category_name === e.target.value){
        console.log(elem.id)
      this.setState({
      category: elem.id
    });}
  })
  }

  showInstructions(e){
    this.setState({
      inst: true
    })
  }

  render() {
    console.log(this.state.category)
    let { file } = this.state;
    let $imagePreview = null;
    let {categories} = this.state
    let showCat = null;
    if (file) {
      $imagePreview = <img className='upload-img' src={file} alt="display" />;
    } else {
      $imagePreview = (
        <div className="previewText">Please select an Image for Preview</div>
      );
    }
    if(categories[0]){
      showCat = <select className='genre-choice' onChange={e => this.handleCategory(e)}>
        <option value='Default'>Select Category</option>
        <option value={categories[0].category_name}>{categories[0].category_name}</option>
        <option value={categories[1].category_name}>{categories[1].category_name}</option>
        <option value={categories[2].category_name}>{categories[2].category_name}</option>
        <option value={categories[3].category_name}>{categories[3].category_name}</option>
        <option value={categories[4].category_name}>{categories[4].category_name}</option>
        <option value={categories[5].category_name}>{categories[5].category_name}</option>
        </select>
    } else {
      showCat = <p>Loading Categories</p>
    }
    return (
      <div className="component">
        <Header />
        <div className='upload-page'>
        {this.state.inst ? 
        <div className='instructions'>
        <h1 className='inst-title'>Upload Instructions</h1>
        <p><b>Step 1</b></p>
        <h3>Navigate to Google.com/imghp or click <a href='https://www.google.com/imghp'>here.</a></h3>
        <p><b>Step 2</b></p>
        <h3>Search for an image of your choice.</h3>
        <p><b>Step 3</b></p>
        <h3>Once you've selected your image, use the 'View Image' button to locate and copy the URL.</h3>
        <p><b>Step 4</b></p>
        <h3>Paste the URL in the 'Image Url' box to view a preview.</h3>
        <p><b>Step 5</b></p>
        <h3>In the 'Add Caption' field, enter an inspiring quote or a simple reminder of why you the image represents a personal dream.</h3>
        <p><b>Step 6</b></p>
        <h3>Choose a category to keep your dreams organized.</h3>
        <p><b>Step 7</b></p>
        <h3>Click upload to SEIZE YOUR DREAM!</h3>
        </div>
        : <button className='inst-button' onClick={this.showInstructions}>Instructions</button>}
        <div className="previewComponent">
          <form onSubmit={e => this._handleSubmit(e)}>
            Image Url: <input
              className="fileInput"
              placeholder='paste URL here'
              onChange={e => this._handleImageChange(e)}
            />
          </form>
          <div className="imgPreview">{$imagePreview}</div>
          <h2 className="image-text">{this.state.text}</h2>
          <textarea
            placeholder="Add Image Caption Before Upload"
            className="caption"
            onChange={e => this._handleTextChange(e)}
          />
          <div className='cat'>{showCat}</div>
          <div className="submit">
            <button
              className="home-btn"
              type="submit"
              onClick={e => this._handleSubmit(e)}
            >
              Upload Dream
            </button>
          </div>
        </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, {login})(Upload);