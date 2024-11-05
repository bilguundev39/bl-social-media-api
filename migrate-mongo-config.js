const config = {
  mongodb: {
    url: "mongodb://localhost:27017",
    databaseName: "social_media"
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs'
};

module.exports = config