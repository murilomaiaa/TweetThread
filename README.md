# Tweet Thread generator
To run this app
1. Set the environments variables see [Config env](#config-env) 
2. install packages
  `yarn install`
3. Up database with `docker compose up` or `docker-compose up` 
4. Start application with `yarn dev`

### Config env
To set up the env use 
  `cp .env.example .env`
You'll need to generate an openAI api key. 
- `OPEN_AI_API_KEY` is generated [here](https://platform.openai.com/account/api-keys).