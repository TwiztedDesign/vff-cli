# VFF-CLI
the vff cli tool gives you the power to develop and deploy overlays for [Videoflow](https://www.videoflow.io)

## Installation
`npm install -g vff-cli`

## Usage
Let's create your first Videoflow overlay!

- Create a new folder with an _index.html_ file
```
mkdir hello-videoflow
cd hello-videoflow
echo '<h1>Hello Videoflow</h1>' > index.html
```
- initialize a VFF project
```
vff init
```
You will be prompt for a few questions, you can't leave the default value by pressing the Enter key.

**CONGRATULATIONS**! You have created your first Videoflow overlay.

Now let's deploy it:
```
vff deploy
``` 
Done.
You'r brand new overlay should appear under the 'Overlays' section in your Videoflow dashboard.


## Commands

### init
### login
### logout
### serve
### deploy