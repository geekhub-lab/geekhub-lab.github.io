# Geekhub Blog Workspace

Geekhub blog will be deployed on [this repository](https://github.com/geekhub-lab/geekhub-lab.github.io) automatically on each push.

## Setup

```
# Clone
git clone -b vuepress git@github.com:geekhub-lab/geekhub-blog-workspace

# Install packages
yarn install
```

## Deployment

When you push, the CircleCI will auto deploy the static blog to `master` branch
