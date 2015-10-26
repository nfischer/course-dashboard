var mapObject = function(obj, callback) {
    return Object.keys(obj).map(function(value, index, array) {
        return callback(obj[value], value, obj);
    });
}

var Renderer = React.createClass({
    render: function() {
        var callback = function(value, key, obj) {
                return <Renderer key={key} graph={value} />;
        };

        if (Object.keys(this.props.graph.children).length == 0) {
            return (
                <div className="node">
                    <div className="contents">
                        {this.props.graph.contents}
                    </div>
                </div>);
        } else {
            return (
                <div className="node">
                    <div className="contents">
                        {this.props.graph.contents}
                    </div>
                    <div className="children">
                        {mapObject(this.props.graph.children, callback)}
                    </div>
                </div>);
        }
    }
});

var graph = {
    contents: "Week 1",
    children: {
        assign1: {
            contents: "Assignment 1",
            children: {}
        },

        piazza: {
            contents: "Piazza",
            children: {
                hello: {
                    contents: "Hello",
                    children: {
                        reply1: {
                            contents: "Reply 1",
                            children: {}
                        },

                        reply2: {
                            contents: "Reply 2",
                            children: {}
                        },

                        reply3: {
                            contents: "Very Big Reply",
                            children: {}
                        }
                    }
                },

                bye: {
                    contents: "Bye",
                    children: {}
                },

                bye: {
                    contents: "Dre Tha Shiznit",
                    children: {}
                }
            }
        }
    }
}

ReactDOM.render(
    <Renderer key="root" graph={graph} />,
    document.getElementById("dashboard")
);
