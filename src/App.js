import React, { Component, useState } from 'react';
import axios from 'axios';
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import base64 from 'react-native-base64'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      loaded: 0
    }

  }

  checkMimeType = (event) => {
    //getting file object
    let files = event.target.files
    //define message container
    let err = []
    // list allow mime type
    const types = ['image/png', 'image/jpeg', 'image/gif']
    // loop access array
    for (var x = 0; x < files.length; x++) {
      // compare file type find doesn't matach
      if (types.every(type => files[x].type !== type)) {
        // create error message and assign to container   
        err[x] = files[x].type + ' is not a supported format.\n';
      }
    };
    for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
      // discard selected file
      toast.error(err[z])
      event.target.value = null
    }
    return true;
  }
  maxSelectFile = (event) => {
    let files = event.target.files
    if (files.length > 3) {
      const msg = 'Only 3 images can be uploaded at a time'
      event.target.value = null
      toast.warn(msg)
      return false;
    }
    return true;
  }
  checkFileSize = (event) => {
    let files = event.target.files
    let size = 2000000
    let err = [];
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err[x] = files[x].type + 'is too large, please pick a smaller file.\n';
      }
    };
    for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
      // discard selected file
      toast.error(err[z])
      event.target.value = null
    }
    return true;
  }
  onChangeHandler = event => {
    var files = event.target.files
    if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)) {
      // if return true allow to setState
      this.setState({
        selectedFile: files,
        loaded: 0
      })
    }
  }
  onClickHandler = () => {
    const data = new FormData()
    if (this.state.selectedFile != null) {
      for (var x = 0; x < this.state.selectedFile.length; x++) {
        data.append('file', this.state.selectedFile[x])
      }
      axios.post("http://localhost:8000/upload", data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
          })
        },
      })
        .then(res => { // then print response status

          toast.success('Upload Successful')


        })
        .catch(err => { // then print response status
          toast.error('Upload Failed')
        })
    }
    else {
      toast.error('No file selected.')
    }
  }
  onAnalyzeHandler = () => {
    const image2base64 = require('image-to-base64');
    let base;
    image2base64("/picture.jpeg") // you can also to use url
      .then(
        (response) => {
          base = response;
          let result, confidence;
          let outputJSON;
          axios.defaults.headers.common['Content-Type'] = "application/json";
          axios.defaults.headers.common['Authorization'] = "Bearer ya29.c.Ko8BvwfGlwDRB8iHrgaYt220O9VZvxh64gyDtnUHGpWU_EUlvWoIuuQ3x8QAi-AP3ts3gxLYNvRPm0FO5iRAfmhp9TZqKOseCqjz8wXQodtii9sMceVUrhFXlbA4qejSQxv2gWkXHKpGi9p2Oc6LmDGsXsTnG-mZZmc_3sErpe6dYVB7Hgbi-PTPFSBFyr0vLRM"
          /* Copy token key here */;

          axios.post("https://automl.googleapis.com/v1beta1/projects/766644774605/locations/us-central1/models/ICN5802549470285529088:predict",
            {
              "payload": {
                "image": {
                  "imageBytes": base
                }
              }
            }).then(function (res) {
              console.log(res);
              if (Object.keys(res.data).length === 0) {
                result = 'trash'
                confidence = 99;
              } else {
                result = res.data.payload[0].displayName;
                confidence = res.data.payload[0].classification.score;
                confidence = confidence * 100;
                confidence = Math.round(confidence);
              }

              let temp = {
                "result": result,
                "confidence": confidence
              };
              toast.info('I am ' + confidence + '% confident that this is '+result+'.');
              temp = JSON.stringify(temp);

              outputJSON = JSON.parse(temp);
              console.log(outputJSON);
            }).catch(function (err) {
              console.log(err);
            });

        }
      )
      .catch(
        (error) => {
          console.log(error); //Exepection error....
        }
      )

    //var base = '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'


  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="offset-md-3 col-md-6">
            <div className="form-group files">
              <label>Upload Your File </label>
              <input type="file" className="form-control" multiple onChange={this.onChangeHandler} />
            </div>
            <div className="form-group">
              <ToastContainer />
              <Progress max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded, 2)}%</Progress>

            </div>

            <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button>
            <button type="button" className="btn btn-success btn-block" onClick={this.onAnalyzeHandler}>Analyze</button>

          </div>
        </div>
      </div>
    );
  }
}

export default App;
