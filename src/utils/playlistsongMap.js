const mapDBToModel = ({
  // eslint-disable-next-line camelcase
  id, title, performer,
}) => ({
  id,
  title,
  performer,
});

module.exports = { mapDBToModel };
