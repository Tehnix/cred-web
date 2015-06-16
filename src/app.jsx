// Authenticate with the server, getting a session key. The authentication is
// done out here, so it doesn't have to wait for the components to be rendered
var clientId = false,
    sessionKey = false;
$.ajax({
    url: hostname + '/auth',
    dataType: 'json',
    type: 'POST',
    data: authData,
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    },
    success: function(data) {
        clientId = data.id;
        sessionKey = data.sessionKey;
    },
    error: function(xhr, status, err) {
        console.error('/auth', status, err.toString());
    }
});

var Application = React.createClass({
    loadClients: function() {
        if (!sessionKey) {
            // If we haven't authenticated yet, simply try again in a bit
            setTimeout(this.loadClients, 200);
            return false;
        }
        $.ajax({
            url: this.props.hostname + '/clients?full=true',
            type: 'GET',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                this.setState({clients: data.clients});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('/clients', status, err.toString());
            }.bind(this),
            complete: function() {
                setTimeout(this.loadClients, this.props.pollInterval);
            }.bind(this)
        });
    },
    loadEvents: function() {
        if (!sessionKey) {
            // If we haven't authenticated yet, simply try again in a bit
            setTimeout(this.loadEvents, 200);
            return false;
        }
        var lastEventID = this.state.lastEventID;
        var after = '&after=' + lastEventID;
        if (lastEventID === 0) {
            // If this is the first pull, we don't want to fetch the entire
            // event history, so we limit it to 1, until we have an ID to go
            // from
            after = '&limit=1';
        }
        $.ajax({
            url: this.props.hostname + '/events?full=true' + after,
            type: 'GET',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                // Update the last event that was fetched
                if (data.events.length > 0) {
                    lastEventID = data.events[0].id;
                }
                // Append new events, to the existing ones
                var events = this.state.events,
                    newEvents = events.concat(data.events);
                this.setState({
                    events: newEvents,
                    lastEventID: lastEventID
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('/events', status, err.toString());
            }.bind(this),
            complete: function() {
                setTimeout(this.loadEvents, this.props.pollInterval);
            }.bind(this)
        });
    },
    componentDidMount: function() {
        // Initialize the data polling
        this.loadClients();
        this.loadEvents();
    },
    getInitialState: function() {
        return {
            clients: [],
            events: [],
            lastEventID: 0
        };
    },
    render: function() {
        return (
            <div>
                <EventContainer data={this.state.events} />
                <ClientContainer data={this.state.clients} />
            </div>
        );
    }
});

var EventContainer = React.createClass({
    render: function() {
        var eventNodes = this.props.data.map(function (event) {
            return (
                <Event data={event} />
            );
        });
        return (
            <div className="eventContainer">
                <h1>Events</h1>
                {eventNodes}
            </div>
        );
    }
});

var Event = React.createClass({
    render: function() {
        return (
            <div className="event">
                <span className="device">{this.props.data.device}</span>
                <span className="eventName">{this.props.data.name}</span>
                <span className="location">{this.props.data.location}</span>
                <span className="action">{this.props.data.action}</span>
                <span className="value">{this.props.data.value}</span>
            </div>
        );
    }
});

var ClientContainer = React.createClass({
    render: function() {
        return (
      <div className="clientContainer">
        <h1>Clients</h1>
        <ClientTable data={this.props.data} />
      </div>
  );
    }
});

var ClientTable = React.createClass({
    render: function() {
        var clientNodes = this.props.data.map(function (client) {
            return (
                <Client data={client} />
            );
        });
        return (
            <div className="clientTable">
                {clientNodes}
            </div>
        );
    }
});

var Client = React.createClass({
    render: function() {
        return (
            <div className="client">
                <span>{this.props.data.device}</span>
                <span>{this.props.data.location}</span>
            </div>
        );
    }
});

React.render(
    <Application hostname={hostname} pollInterval={5000} />,
    document.getElementById('content')
);
