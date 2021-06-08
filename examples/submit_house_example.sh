# This folder contains the house_example.json file from the Bowtie SDK
# Documentation.  Running the demo server found in this project, to
# test that you have set the environment variables correctly and are
# communicating with the Young Alfred back-end (with the sandbox
# version, if you are using this demo), run the command below in this
# folder.  You should get back a valid response.

curl -X POST "http://localhost:3001/portfolio/submit" -H "Content-Type: application/json" -d '@./house_example.json'
