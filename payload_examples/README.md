This folder contains the house_example.json file from the Bowtie SDK
Documentation.  To test that you have set the environment variables
correctly and are communicating with the Young Alfred back-end (with the
sandbox version, if you are using this demo), first run the server in
one window, then in another window run the command below in this folder.
You should get back a valid response. You can then examine the output of
the server window to see it's response/request cycle with the Young
Alfred API.

Running the server (type this into the project root):

``` shell
BOWTIE_PARTNER_ID="<YOUR_PARTNER_ID>" API_KEY="<YOUR_API_KEY>" npm run server
```

Testing that the server is communicating correctly (run this from the
current folder):

``` shell
curl -X POST "http://localhost:3001/portfolio/submit" -H "Content-Type: application/json" -d '@./house_example.json'
```


