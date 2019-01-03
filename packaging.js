const pkg         = require('pkg');
const fs          = require('fs');
const wix         =  require ('electron-wix-msi');

async function pack() {
   console.log('===========Starting Packaging============');
   pkg.exec(['./package.json', '--target', 'win', '--out-path', './packs']).then(res => {
      //window;
      //rename file from vff-cli-win.exe to -> vff.exe
      fs.rename('./packs/vff-cli.exe', './packs/vff.exe', () => {
         console.log('done');

         //rename Create MSI
         // const msiCreator = new wix.MSICreator({
         //    appDirectory: './packs',
         //    description: 'My amazing Kitten simulator',
         //    exe: 'vff-cli',
         //    name: 'vff-cli',
         //    manufacturer: 'Twizted Design',
         //    version: '1.0.0',
         //    outputDirectory: './packs'
         // });
         //
         // // Step 2: Create a .wxs template file
         // msiCreator.create().then(()=>{
         //    // Step 3: Compile the template to a .msi file
         //    msiCreator.compile();
         // });
         //
         // msiCreator.compile();

         //Upload to S3

      });


      //At the end delete temp folder
   });
}

pack();