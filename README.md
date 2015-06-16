cred web interface
=====
cred-web is a javascript interface that displays data and other things using the
API exposed by a [cred-server web application](https://github.com/Tehnix/cred-server "cred-server repository").

To use the application, first configure it to use your API key and set the host
for the cred-server, which the javascript interface will talk to.


Configuration
=====
First you need to configure the application to point to your server, and to use
the API key that you have generated.

To do this, simply create a file called
`config.yaml` in the root directory of the project, and fill it with your
details.

An example could be,

```yaml
port: 3000
hostname: 'http://127.0.0.1:5000'
apikey: 'P4SB6o5jWR5aO49haY6vs3ky1zFeagIHkSR2prXGNNw'
```

* `port` is the port number cred-web will run on.
* `hostname` is the API server, usually [cred-server](https://github.com/Tehnix/cred-server "cred-server repository")
or some other implementation.
* `apikey` is an API key that gives READ access to the API server.

Finally

Development
=====
NOTE: The project is developed using python 3.4.3, so other versions might
experience problems.

The following should get you going,

1. `$ git clone git@github.com:Tehnix/cred-web.git && cd cred-web`
2. `$ virtualenv env && source env/bin/activate`
3. `pip install -r requirements.txt`


[React.js tooling](https://facebook.github.io/react/docs/tooling-integration.html) is used for compiling the ´.jsx´ code. You can get going with,

```bash
npm install -g react-tools
```

Then you can compile the `src/app.jsx` file to `public/app.js` with,

```bash
jsx --extension jsx src/ public/
```

or with `--watch` to keep building after automatically on file changes.
