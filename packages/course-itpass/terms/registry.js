// packages/course-itpass/terms/registry.js — IT Passport term registry
// Each term: id, en, ja, zh, termType, definitionJa, definitionZh,
// contextJa, contextZh, compareWith, examCueJa, examCueZh, sourceRefs

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
