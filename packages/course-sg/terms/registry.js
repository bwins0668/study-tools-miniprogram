// packages/course-sg/terms/registry.js — SG term registry
var registry = {};

function register(term) {
  if (term && term.id) registry[term.id] = term;
}

function getTerm(id) {
  return registry[id] || null;
}

function getTerms(ids) {
  return (ids || []).map(function(id) { return registry[id]; }).filter(Boolean);
}

module.exports = { register: register, getTerm: getTerm, getTerms: getTerms, registry: registry };
