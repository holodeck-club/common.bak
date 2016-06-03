# Holodeck Club

Greetings! This is a WebVR playground, a Holodeck club.


## Local development

You'll need a local development server to work on this project.

Included in this repo is a Browsersync server that out of the box handles live-reloading and tunnelling (useful for loading sites on other networks and mobile devices).

To install the [Node](https://nodejs.org/en/download/) dependencies:

```bash
npm install
```

To start the server:

```bash
npm start
```

If you'd rather not depend on Node, there are [several other options of running the content locally](https://github.com/mrdoob/three.js/wiki/How-to-run-things-locally).


### Easy installation

Or all the commands here:

```bash
export HOLODECK_CLUB_PATH=$HOME'/holodeck-club'  # or some path of your choosing
mkdir -p $HOLODECK_CLUB_PATH
git clone holodeck-club/lobby $HOLODECK_CLUB_PATH/lobby
cd $HOLODECK_CLUB_PATH/lobby
npm start
npm install
```

## Creating new groups (repos)

First create the [repo](https://github.com/organizations/holodeck-club/repositories/new). Then run these commands:

```bash
cat "# Holodeck Club > Education\n\n__https://education.holodeck.club/__" > README.md
cat "education.holodeck.club" > CNAME.md
git init
git checkout -b gh-pages
mkdir -p cadavr/ colors/
touch cadavr/.gitkeep colors/.gitkeep
git add .
git commit -m "THIS IS HOLODECK.CLUB/EDUCATION"
git remote add origin git@github.com:holodeck-club/education.git
git push -u origin head
```

## Maintainers

To install new JS dependencies to `js/vendor/`:

```bash
npm run jspm -- install github:donmccurdy/aframe-extras github:aframevr/aframe@master github:gasolin/aframe-href-component
```

And to run any other [jspm commands](https://github.com/jspm/jspm-cli#documentation), simply prefix your command with `npm run jspm -- `.
