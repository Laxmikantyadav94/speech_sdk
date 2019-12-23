# Introduction 
DeepSpeech sdk for browser .

#Installation of npm package / from git repositiry

1. Add following the the package.json dependencies 

   "speech-sdk": "git+ssh://smartek21India@vs-ssh.visualstudio.com:v3/smartek21India/IntelligentMachines/speech-sdk"

2. Add import statement 

    import * as  SDK   from 'speech-sdk'

3. Uses 

let obj = new SDK.DeepSpeech();
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

