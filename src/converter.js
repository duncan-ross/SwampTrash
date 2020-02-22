import React from 'react';
import base64 from 'react-file-base64'
var axios = require('axios');

const Converter = (props) => {

    // props.setFile('.../public/images/HTB1Y.V6aIrrK1Rjy1zeq6xalFXaA.jpg');
    const file =  'https://sc02.alicdn.com/kf/HTB1Y.V6aIrrK1Rjy1zeq6xalFXaA/232900318/HTB1Y.V6aIrrK1Rjy1zeq6xalFXaA.jpg'

    let result, confidence;
    let outputJSON;

    const base64_encode = (file) =>{

        return base64.encode(file);

        // // read binary data
        // var bitmap = fs.readFileSync(file);
        // // convert binary data to base64 encoded string
        // return new Buffer(bitmap).toString('base64');
    }

        axios.defaults.headers.common['Content-Type'] = "application/json";
        axios.defaults.headers.common['Authorization'] = "Bearer ya29.c.Ko8BvweiEswHjnW0B4ym9z1sfuQ6qpa3R8GYdpxYa67pHOhFULl6VmUVVS4N15j0QcA4wKULUpGbb2rng50AA53VEJVl33P2tBzu4HYFce9IwTSMfljBzLNsi8Qem87KjoPVaknOCt8sR_w7VwnEdkAggHnEb32zILlZ7qrueDa1M-L6bngebz_PPg83UWMgyvg"/* Copy token key here */;
        // function to encode file data to base64 encoded string
    
        var base = base64_encode(file);
        axios.post("https://automl.googleapis.com/v1beta1/projects/766644774605/locations/us-central1/models/ICN5802549470285529088:predict",
            {
                "payload": {
                    "image": {
                        "imageBytes": base
                    }
                }
            }).then(function(res){
    
                if (Object.keys(res.data).length == 0){
                    result = 'trash'
                    confidence = 99;
                } else{
                    result = res.data.payload[0].displayName;
                    confidence = res.data.payload[0].classification.score;
                    confidence = confidence * 100;
                    confidence = Math.round(confidence);
                }
    
                let temp = {
                    "result" : result,
                    "confidence" : confidence
                };
    
                temp = JSON.stringify(temp);
    
                outputJSON = JSON.parse(temp);
                console.log(outputJSON);
            //     fs.writeFile('output.json', JSON.stringify(outputJSON), 'utf8', (err, data) => {
            //         if (err) console.log(err);
            //         else console.log('written');
            // });
        }).catch(function(err) {
            console.log(err);
        });
    

    return (
        <div>
            
        </div>
    );

};
export default Converter;