module.exports = {
  apps: [
    {
      name: "JCWD-2504-03", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 5403,
      },
      time: true,
    },
  ],
};
