# devplate

**Devplate is a developer tool that allows the pulling of personal development templates (Devplates) from a GitHub repository**

1. [Installation](#installation)
2. [Getting Started](#getting-started)
2. [Commands](#commands)
3. [Contributing](#contributing)

## Installation

https://www.npmjs.com/package/pmp-hub
Run ```npm install -g devplate``` to install the pmp-hub CLI globally.

## Getting Started

### 1. Setup your Devplate repository

Create a new public repository and for every development template (Devplate) you have, create a sub-folder within the repo with the name of the folder being a short name for your Devplate.

An example Devplate repository can be found [here](https://github.com/shortxmas/example-devplate-repository)

### 2. Add your Devplate repository to Devplate 

After creating your Devplate repository add it to your local Devplate config by running ```dp repo add```.
You can verify if your repository was added by running ```dp repo view``` or by checking the devplates.json file in the package.

## Commands

```dp repo view```- view your Devplate repositories

```dp repo add``` - add a new Devplate repository

```dp repo remove``` - remove a Devplate repository

```dp view``` - View Devplates within a Devplate repository

```dp select``` - Select a Devplate to pull down from a Devplate repository

## Contributing

To contribute, please make issues/PRs on the Devplate GitHub repo.

**Devplate is currently in its early stages and may not work fully. Please make issues for any errors encountered at https://github.com/shortxmas/devplate/issues**