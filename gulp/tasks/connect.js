export default function(gulp, plugins, config) {
  var {connect} = plugins;

  return (cb) => {
    connect.server({
      root: 'dist',
      port: 3000
    });

    cb();
  };
}

