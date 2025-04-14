module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/landing2",
        permanent: true,
      },
    ];
  },
};
