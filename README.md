# VFF-CLI
### The power to develop and deploy overlays for Videoflow

This is the home of the DevKit for [Videoflow](https://www.videoflow.io) overlays. 

## The Goal of VFF CLI

VFF Cli let you develop and deploy you overly projects. It's built on top of [VFF](https://github.com/TwiztedDesign/vff)


# Getting Started

## Installation
There are two option to install vff cli tool:
- Windows\Linux\macOS:
    1. Get [npm](https://www.npmjs.com/get-npm)
    1. Run the following command `npm install -g vff-cli`
    1. You are ready to go
- Windows
    1. MSI installation available on this [link](https://d2vhshfrrpr8m8.cloudfront.net/downloads/vff-cli/vff-cli.exe)

## Usage
Let's create your first Videoflow overlay!

- First login with your Videoflow credentials
```
vff login
```
You will be prompt for your email and password

- Create a new folder with an _index.html_ file
```
mkdir hello-videoflow
cd hello-videoflow
vff create
```
You will be prompt for a few questions, select "basic" template
**CONGRATULATIONS**! You have created your first Videoflow overlay.

Let's check that everything looks ok
- serve the vff project locally (**Experimental feature, uses [serveo.net](http://serveo.net) under the hood**)
```
vff serve
```
You can open this link locally [http://localhost:5454](http://localhost:5454)
Or login to [Videoflow](https://www.videoflow.io) to see your new overlay
![](http://g.recordit.co/hkEQXHdZbj.gif)
**NOTE** in order to stop serving the overlay just press 'ctrl c'

Now let's deploy it:
```
vff deploy
``` 
Done.

You're brand new overlay should appear under the 'Overlays' section in your Videoflow dashboard.


## Commands
We will elaborate about each command 

BTW, you can always get all the supported commands by pressing
```
vff -h
```

### login
Login to Videoflow. Otherwise we won't know who are you...
```
vff login
```
You will be prompt for your email and password
 
***If you arn't logged in, you won't see the new overlay in your Videoflow dashboard***
### logout
Logout vff-cli tool from Videoflow
```
vff logout
```
### init
Initialize a new overlay project
```
vff init
```
You should run this command inside the overlay folder. You will be prompt for a few questions and some default values

Once you finished with it, you will noticed a new file on your root folder (vff.json)
```
{
    "name": "hello-videoflow",
    "main": "index.html",
    "version": "1.0.0"
}
```
This file is important to sync Videoflow server about the new overlay.

***Please don't change it manually***
### create
Create command is helping you to create boilerplate out of the box
```
vff create [directory]
```
You will be prompt for a few questions such as project name, and which boilerplate.
If a directory is provided, it will be created, otherwise the overlay will be created in the current location

#### Boilerplates
- Basic - Basic overlay boilerplarte
```
    .
    ├── css                   # Style folder
    |    └ vff-overlay        # General styles for the overlay layout on various devices
    ├── js                    # Js files folder
    ├── index.html            # Main index.html file
    └── vff.json              # vff-cli config file - generated automatically
```

### deploy
Deploy command allows you to deploy your overlay and make it available for all.
```
vff deploy
```
**Make sure you are logged in**
Once you deploy your overlay you will be able to see it on your Videoflow dashboard under the "Overlays" section.

In case somethings is wrong(such as missing vff.json file) you will get the relevant error message

### info
Printing metadata info about your overlay from the vff.json file
```
vff info
```

```ℹ Overlay name: hello-videoflow```

**Make sure you are running this command inside the overlay folder**

### status
Printing connection status to Videoflow server
```
vff info
```
```
ℹ Server URL: https://www.videoflow.io/
ℹ Logged in as: z**.******@tw*******.com
```

### env
This command is mostly for development usage. It allow us(the developers) to improve vff-cli tool and make it greater
```
vff env
```
**If you don't know what to do with it, please don't touch it**




