const endent = require("endent").default;

module.exports = function makeDynamicRemotes(remotes) {
  const dynamicRemotes = Object.entries(remotes).reduce(
    (acc, [alias, location]) => {
      const [globalName, url] = location.split("@");
      acc[alias] = endent`promise new Promise(async (resolve) => {
        const versionConfigReq = await fetch("http://localhost:3001/version-config.json");
        const versionConfig = await versionConfigReq.json();
        const script = document.createElement('script');
        script.src = "${url}/" + versionConfig.${globalName} + "/remoteEntry.js";
  
        script.onload = () => {
          const proxy = {
            get: (request) => window.${globalName}.get(request),
            init: (arg) => {
              try {
                return window.${globalName}.init(arg)
              } catch(e) {
                console.log('remote container already initialized')
              }
            }
          }
          resolve(proxy)
        }
  
        document.head.appendChild(script);
      })`;

      return acc;
    },
    {}
  );
};
