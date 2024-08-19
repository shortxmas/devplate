# devplate

**Devplate is a developer tool that allows the pulling of personal development templates (Devplates) from a GitHub repository**

1. [Installation](#installation)
2. [Getting Started](#getting-started)
2. [Commands](#commands)
3. [Devplate Site](#devplate-site)
3. [Contributing](#contributing)
4. [Devplate Diagram](#devplate-diagram)

## Installation

https://www.npmjs.com/package/devplate
Run ```npm install -g devplate``` to install the Devplate CLI globally.

Make sure you have the Git CLI installed.

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

```dp pull <devplate ID>``` - Pull down a Devplate via its Devplate ID eg. dp pull shortxmas/example-devplate-repository/django-dbfilestore-whitenoise-vercel

## Devplate Site

To view and search through all public Devplates along with their pull commands, go to https://devplate-site.vercel.app/

## Contributing

To contribute, please make issues/PRs on the Devplate GitHub repo.

**Devplate is currently in its early stages and may not work fully. Please make issues for any errors encountered at https://github.com/shortxmas/devplate/issues**

## Devplate Diagram
![devplate drawio (5)](https://github.com/user-attachments/assets/eefab22b-5883-4cf7-8d40-582defcc09c6)
