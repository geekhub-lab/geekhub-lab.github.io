# geekhub-lab.github.io

[![CircleCI](https://circleci.com/gh/geekhub-lab/geekhub-lab.github.io/tree/deploy.svg?style=svg)](https://circleci.com/gh/geekhub-lab/geekhub-lab.github.io/tree/deploy)

http://geekhub.co.kr/

## Setup

```
# Clone
git clone -b vuepress git@github.com:geekhub-lab/geekhub-lab.github.io

# Install packages
yarn install
```

## Deployment

When you `rebase` or `merge` the `vuepress` to `deploy` branch, the CircleCI will auto deploy the static blog to `master` branch. Using `rebase` is recommended rather than `merge`.

Steps:

1. Working on `vuepress` branch
2. When done, `rebase` or `merge` to `deploy`
3. Push to remote `deploy` branch
4. Auto build and deploy will be processed
