const mapDBToModel = ({
  // eslint-disable-next-line camelcase
  id, name, username,
}) => ({
  id,
  name,
  username,
});

module.exports = { mapDBToModel };
