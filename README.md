# Synology Upload Action

Upload a file to Synology Nas

## Run

```yaml
name: Test CI

on:
  push:
    branches: [ master ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Make test file
      run: echo "${{ github.sha }}" > test.txt
    - name: Test upload
      uses: bungabear/synology_upload_action@master
      with:
        host:  ${{ secrets.synologyHost }}
        username:  ${{ secrets.synologyUsername }}
        password:  ${{ secrets.synologyPassword }}
        filepath: test.txt
        filename:  synology_upload_test.txt
        uploadpath: /home/share
        overwrite: true
        createparent: true
```

## How to build

```bash
npm install
npx webpack
```
