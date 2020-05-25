# Introduction 
DeepSpeech sdk for browser .

#Installation of npm package / from git repositiry

1. Add following the the package.json dependencies 

   "speech-sdk": "url to repo"

2. Add import statement 

    import * as  speechSDK   from 'speech-sdk'

3. Uses 

    let obj = new speechSDK.DeepSpeech();

    await obj.init();

    try{

          obj.recordAudio();

          setTimeout( async function(){

              let text= await obj.stopAudio();

              console.log("stop Audio resolved",text)

          }, 5000);

      }catch(err){

          console.log(err)

      } 

# In a Browser, using Webpack

1.  run "npm run bundle" this will generate a bundle file .
2.  Add the generated bundle to your html page:
    <script src="../../distrib/speech.sdk.bundle.js"></script>
3. uses -

    var  obj = window.speechSDK.DeepSpeech();

    try{
        obj.init().then(function () {

                // console.log("deepspeech socket initilized");

                obj.recordAudio();

                setTimeout( async function(){

                    obj.stopAudio().then(function (text) {
                        console.log("stop Audio resolved",text)
                    }).catch(function (err) {
                        console.log(err);
                    });

                }, 5000);

            }).catch(function (err) {
                console.log(err);
            })      
         
      }catch(err){

          console.log(err)

      } 


