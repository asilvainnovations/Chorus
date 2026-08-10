import { Domain } from './types';

/**
 * Chorus Strategic Foresight Explorer — Domain Taxonomy
 * 
 * 10 interconnected domains focused on global challenges, sustainability,
 * resilience, and innovation. Each domain has frameworks, curated resources,
 * and a system prompt addendum to ground AI responses.
 */

export const DOMAINS: Record<string, Domain> = {
  'sustainable-development': {
    id: 'sustainable-development',
    name: 'Sustainable Development',
    description: 'Aligning development with environmental, social, and economic goals. SDG alignment.',
    icon: '🌍',
    color: '#0069a8',
    backgroundColor: '#e3f2fd',
    relatedDomainIds: ['green-economy', 'circular-economy', 'resilience', 'inclusivity'],
    frameworks: ['UN Sustainable Development Goals (SDGs)', 'Paris Agreement', 'UN DESA', 'OECD Sustainable Development'],
    resources: [
      { title: 'UN SDGs Dashboard', url: 'https://sdgs.un.org/', type: 'framework', description: 'Official SDG progress tracking' },
      { title: 'UNDP Accelerator Labs', url: 'https://www.undp.org/acceleratorlabs', type: 'initiative', description: 'Innovation for sustainable development' },
      { title: 'Earth System Boundaries', url: 'https://www.science.org/doi/10.1126/sciadv.adh2458', type: 'research', description: 'Planetary boundaries research' },
    ],
    systemPromptAddendum: `You are advising on Sustainable Development (SDG alignment). Ground responses in:
- The 17 UN Sustainable Development Goals and their targets
- Interlinkages between SDGs (trade-offs and co-benefits)
- Leave No One Behind principles
- Just Transition frameworks`,
    suggestedQueries: [
      'How can green energy transition support multiple SDGs?',
      'What are the SDG trade-offs in coastal development?',
      'Describe a circular economy pathway aligned with SDGs',
    ],
  },
  'green-economy': {
    id: 'green-economy',
    name: 'Green Economy',
    description: 'Economic models that decouple growth from resource depletion and environmental damage.',
    icon: '💚',
    color: '#0f7d51',
    backgroundColor: '#e8f5e9',
    relatedDomainIds: ['sustainable-development', 'circular-economy', 'resilience', 'innovation'],
    frameworks: ['UNEP Green Economy', 'Natural Capital Accounting', 'Environmental Kuznets Curve', 'Regenerative Economics'],
    resources: [
      { title: 'UNEP Green Economy Initiative', url: 'https://www.unep.org/explore-topics/green-economy', type: 'initiative', description: 'UNEP green economy programs' },
      { title: 'Natural Capital Protocol', url: 'https://naturalcapitalcoalition.org/', type: 'framework', description: 'Measuring natural capital' },
      { title: 'Ellen MacArthur Circular Economy', url: 'https://www.ellenmacarthurfoundation.org/', type: 'initiative', description: 'Circular economy thought leadership' },
    ],
    systemPromptAddendum: `You are advising on Green Economy transitions. Focus on:
- Decoupling economic growth from resource extraction and emissions
- Green jobs creation and just transitions for workers
- Valuing natural capital and ecosystem services
- Renewable energy economics and cost trajectories
- Sustainable finance mechanisms (green bonds, impact investing)`,
    suggestedQueries: [
      'What does a just transition look like for coal-dependent regions?',
      'How can we measure and value ecosystem services?',
      'What green economy policies have succeeded in developing nations?',
    ],
  },
  'circular-economy': {
    id: 'circular-economy',
    name: 'Circular Economy',
    description: 'Economic systems designed to eliminate waste by keeping materials in use as long as possible.',
    icon: '♻️',
    color: '#8a6d00',
    backgroundColor: '#fff8e1',
    relatedDomainIds: ['green-economy', 'sustainable-development', 'systems-thinking', 'innovation'],
    frameworks: ['Circular Economy Principles', 'Cradle-to-Cradle', 'Extended Producer Responsibility', 'Product-as-Service Models'],
    resources: [
      { title: 'Ellen MacArthur Foundation Resources', url: 'https://www.ellenmacarthurfoundation.org/publications', type: 'research', description: 'Circular economy frameworks and case studies' },
      { title: 'EU Circular Economy Action Plan', url: 'https://ec.europa.eu/environment/strategy/circular-economy-action-plan_en', type: 'framework', description: 'European policy framework' },
      { title: 'Circle Economy', url: 'https://www.circle-economy.com/', type: 'tool', description: 'Circular economy strategy tools' },
    ],
    systemPromptAddendum: `You are advising on Circular Economy design. Focus on:
- Designing out waste and pollution (ReSOLVE framework: Regenerate, Share, Optimize, Loop, Virtualize, Exchange)
- Biological and technical nutrients
- Business model innovation (product-as-service, sharing platforms, remanufacturing)
- Supply chain circularity and material tracking
- Behavioral incentives for circular consumption`,
    suggestedQueries: [
      'Design a circular economy strategy for the fashion industry',
      'How can digital technology enable circular business models?',
      'What circular economy barriers exist in developing countries?',
    ],
  },
  'resilience': {
    id: 'resilience',
    name: 'Resilience',
    description: 'Capacity to anticipate, withstand, adapt to, and recover from shocks. Systemic, community, and personal.',
    icon: '🛡️',
    color: '#5b34c9',
    backgroundColor: '#f3e5f5',
    relatedDomainIds: ['disaster-risk-reduction', 'systems-thinking', 'well-being', 'inclusive-leadership'],
    frameworks: ['UNDRR Sendai Framework', 'Community Resilience Theory', 'Adaptive Capacity', 'Bounce-Forward Thinking'],
    resources: [
      { title: 'UNDRR Sendai Framework', url: 'https://www.undrr.org/implementing-sendai-framework', type: 'framework', description: 'Disaster Risk Reduction & resilience' },
      { title: 'Resilience Institute Resources', url: 'https://www.resilienceinstitute.org/', type: 'initiative', description: 'Resilience research and practice' },
      { title: 'Stockholm Resilience Centre', url: 'https://www.su.se/stockholm-resilience-centre/', type: 'research', description: 'Systems resilience research' },
    ],
    systemPromptAddendum: `You are advising on Resilience building. Focus on:
- Systemic, community, organisational, and personal resilience
- Anticipation, absorption, adaptation, and transformation capacities
- Social cohesion and trust as resilience factors
- Nature-based solutions for climate resilience
- Post-crisis recovery and transformation (not just bouncing back, bouncing forward)`,
    suggestedQueries: [
      'How can communities build climate resilience in low-income settings?',
      'What makes systems socially resilient to economic shocks?',
      'Design a community resilience program for coastal cities.',
    ],
  },
  'disaster-risk-reduction': {
    id: 'disaster-risk-reduction',
    name: 'Disaster Risk Reduction',
    description: 'Systemic reduction of disaster risk through prevention, mitigation, preparedness, and response.',
    icon: '⚠️',
    color: '#c62828',
    backgroundColor: '#ffebee',
    relatedDomainIds: ['resilience', 'systems-thinking', 'inclusive-leadership', 'well-being'],
    frameworks: ['UNDRR Sendai Framework 2015-2030', 'Hazard Assessment', 'Early Warning Systems', 'Community-Based DRR'],
    resources: [
      { title: 'UNDRR Global Assessment Report', url: 'https://www.undrr.org/gar', type: 'research', description: 'Global disaster risk trends' },
      { title: 'IFRC Disaster Management', url: 'https://www.ifrc.org/our-work/disasters-and-crisis', type: 'initiative', description: 'International Federation Red Cross initiatives' },
      { title: 'PreventionWeb', url: 'https://www.preventionweb.net/', type: 'tool', description: 'DRR knowledge platform' },
    ],
    systemPromptAddendum: `You are advising on Disaster Risk Reduction (DRR). Focus on:
- UNDRR Sendai Framework priorities: understanding disaster risk, strengthening governance, investing in DRR
- Multi-hazard approaches (earthquakes, floods, storms, pandemics, etc.)
- Early warning systems and anticipatory action
- Community-based preparedness and response
- Building back better and DRR in recovery
- Interlinkages with climate adaptation`,
    suggestedQueries: [
      'Design an early warning system for flood-prone communities',
      'How should coastal cities integrate DRR into planning?',
      'What are successful community-based disaster preparedness programs?',
    ],
  },
  'systems-thinking': {
    id: 'systems-thinking',
    name: 'Systems Thinking',
    description: 'Frameworks for understanding complex, interconnected systems and leverage points for change.',
    icon: '🔗',
    color: '#00695c',
    backgroundColor: '#e0f2f1',
    relatedDomainIds: ['sustainable-development', 'circular-economy', 'resilience', 'innovation'],
    frameworks: ['Causal Loop Diagrams', 'Leverage Point Theory', 'System Dynamics', 'Actor-Network Analysis'],
    resources: [
      { title: 'Donella Meadows Leverage Points', url: 'https://donellameadows.org/archives/leverage-points-places-to-intervene-in-a-system/', type: 'research', description: 'Classic systems leverage paper' },
      { title: 'The Cynefin Framework', url: 'https://en.wikipedia.org/wiki/Cynefin_framework', type: 'framework', description: 'Decision-making in complex systems' },
      { title: 'System Dynamics Society', url: 'https://www.systemdynamics.org/', type: 'initiative', description: 'Systems modeling and simulation' },
    ],
    systemPromptAddendum: `You are advising on Systems Thinking. Focus on:
- Causal loop diagrams and feedback loops (balancing and reinforcing)
- Stocks and flows
- Leverage points for systemic change (high and low leverage interventions)
- Unintended consequences and side effects
- Temporal dynamics and delays
- Emergence and non-linear behavior`,
    suggestedQueries: [
      'Map the causal loops in urban inequality',
      'What are high-leverage points for climate action?',
      'Analyze the system dynamics of deforestation',
    ],
  },
  'inclusivity': {
    id: 'inclusivity',
    name: 'Inclusivity & Social Equity',
    description: 'Ensuring all people, especially marginalized groups, benefit from development and decision-making.',
    icon: '🤝',
    color: '#1976d2',
    backgroundColor: '#e3f2fd',
    relatedDomainIds: ['sustainable-development', 'resilience', 'well-being', 'inclusive-leadership'],
    frameworks: ['Leave No One Behind (LNOB)', 'Disability Inclusion', 'Gender Equality', 'Youth Empowerment', 'Indigenous Rights'],
    resources: [
      { title: 'UN DESA Social Policy', url: 'https://www.un.org/development/desa/dspd/', type: 'framework', description: 'Social inclusion policies' },
      { title: 'Disability Rights Advocacy', url: 'https://www.un.org/development/desa/disabilities/', type: 'initiative', description: 'UN disability inclusion work' },
      { title: 'Gender Equality Hub (UN Women)', url: 'https://www.unwomen.org/', type: 'initiative', description: 'Gender equality initiatives' },
    ],
    systemPromptAddendum: `You are advising on Inclusivity & Social Equity. Focus on:
- Leave No One Behind (LNOB) principles and targeted support
- Intersectionality and overlapping vulnerabilities
- Meaningful participation of marginalized groups in decision-making
- Disability inclusion and accessibility
- Gender equality and women's empowerment
- Youth agency and indigenous knowledge
- Reparations and historical justice`,
    suggestedQueries: [
      'How can climate action include indigenous communities?',
      'Design inclusive disaster preparedness for disabled persons',
      'What barriers prevent women from green economy jobs?',
    ],
  },
  'well-being': {
    id: 'well-being',
    name: 'Well-Being',
    description: 'Physical, mental, social, and spiritual health. Individual, community, and societal dimensions.',
    icon: '💚',
    color: '#388e3c',
    backgroundColor: '#e8f5e9',
    relatedDomainIds: ['inclusivity', 'resilience', 'inclusive-leadership', 'sustainable-development'],
    frameworks: ['WHO Well-Being Dimensions', 'MHPSS (Mental Health & Psychosocial Support)', 'Salutogenesis', 'Wellbeing Economy'],
    resources: [
      { title: 'WHO Well-Being Definition', url: 'https://www.who.int/about/objectives/health-definition', type: 'framework', description: 'WHO health and wellbeing framework' },
      { title: 'Wellbeing Economy Alliance', url: 'https://wellbeingeconomy.org/', type: 'initiative', description: 'Economics that prioritize wellbeing' },
      { title: 'UN OCHA MHPSS Resources', url: 'https://www.humanitarianresponse.info/en/topics/mental-health-and-psychosocial-support', type: 'tool', description: 'Psychosocial support guidance' },
    ],
    systemPromptAddendum: `You are advising on Well-Being. Focus on:
- Multi-dimensional wellbeing: physical, mental, social, spiritual, environmental
- Psychosocial support (MHPSS) in crisis and post-crisis settings
- Mental health equity and reducing stigma
- Social cohesion and community wellbeing
- Work-life balance and decent work
- Environmental health and nature-based wellbeing
- Salutogenesis (what creates health, not just absence of disease)`,
    suggestedQueries: [
      'How can climate change impact mental health, and what are solutions?',
      'Design a community mental health program for displaced persons',
      'What policies support worker wellbeing in green economy transitions?',
    ],
  },
  'inclusive-leadership': {
    id: 'inclusive-leadership',
    name: 'Real-Time Leadership',
    description: 'Adaptive, inclusive, and responsive leadership in dynamic, complex environments. Foresight-informed.',
    icon: '👥',
    color: '#7b1fa2',
    backgroundColor: '#f3e5f5',
    relatedDomainIds: ['systems-thinking', 'resilience', 'inclusivity', 'well-being'],
    frameworks: ['Transformational Leadership', 'Servant Leadership', 'Foresight and Scenario Planning', 'Adaptive Leadership'],
    resources: [
      { title: 'Harvard Adaptive Leadership', url: 'https://www.kennedyschool.harvard.edu/student-life/clubs-organizations/center-for-public-leadership', type: 'initiative', description: 'Adaptive leadership training' },
      { title: 'Future Leaders Platform', url: 'https://www.weforum.org/communities/future-leaders', type: 'initiative', description: 'Young leaders in global challenges' },
      { title: 'Scenario Planning Resources', url: 'https://www.millennium-project.org/publication-type/scenarios/', type: 'research', description: 'Futures and foresight methods' },
    ],
    systemPromptAddendum: `You are advising on Real-Time (Adaptive) Leadership. Focus on:
- Distributed and participatory decision-making
- Sense-making and sensegiving in uncertainty
- Scenario planning and foresight
- Building psychological safety and trust
- Stakeholder engagement and conflict resolution
- Ethical leadership and values-driven action
- Learning organizations and rapid adaptation`,
    suggestedQueries: [
      'How should leaders respond to conflicting stakeholder interests in climate policy?',
      'Design a scenario planning process for city climate resilience',
      'What leadership practices support organizational transformation?',
    ],
  },
  'innovation': {
    id: 'innovation',
    name: 'Innovations in Global Challenges',
    description: 'Technology, social innovation, business model innovation, and policy innovation for sustainability.',
    icon: '💡',
    color: '#ff6f00',
    backgroundColor: '#fff3e0',
    relatedDomainIds: ['green-economy', 'circular-economy', 'systems-thinking', 'sustainable-development'],
    frameworks: ['Theory of Change', 'Innovation Diffusion', 'Climate Tech', 'Social Innovation', 'Policy Innovation'],
    resources: [
      { title: 'Global Innovation Index', url: 'https://www.globalinnovationindex.org/', type: 'research', description: 'Global innovation tracking' },
      { title: 'X Prize Foundation', url: 'https://www.xprize.org/', type: 'initiative', description: 'Innovation incentive prizes' },
      { title: 'Climate Tech List', url: 'https://www.climate-tech-list.com/', type: 'tool', description: 'Climate technology catalog' },
    ],
    systemPromptAddendum: `You are advising on Innovation in global challenges. Focus on:
- Technology innovation: climate tech, renewable energy, carbon removal, agriculture tech
- Social innovation: new service models, community solutions, behavioral change
- Business model innovation: circular, platform, outcome-based models
- Policy innovation and regulatory sandboxes
- Indigenous and local knowledge + modern technology
- Innovation diffusion and scaling barriers
- Unintended consequences of innovation (anticipatory governance)`,
    suggestedQueries: [
      'What innovations in agriculture support climate resilience and food security?',
      'Analyze barriers to scaling climate tech in developing nations',
      'Design a social innovation to reduce plastic waste in informal settlements',
    ],
  },
};

export const getAllDomains = (): Domain[] => Object.values(DOMAINS);

export const getDomainById = (id: string): Domain | undefined => DOMAINS[id];

export const getDomainConnections = (domainId: string): { domain: Domain; directConnection: boolean }[] => {
  const domain = getDomainById(domainId);
  if (!domain) return [];

  const directConnections = domain.relatedDomainIds
    .map((id) => ({ domain: getDomainById(id)!, directConnection: true }))
    .filter((item) => item.domain);

  const secondOrder = new Set<string>();
  domain.relatedDomainIds.forEach((relatedId) => {
    const related = getDomainById(relatedId);
    if (related) {
      related.relatedDomainIds.forEach((id) => {
        if (id !== domainId && !domain.relatedDomainIds.includes(id)) {
          secondOrder.add(id);
        }
      });
    }
  });

  return [
    ...directConnections,
    ...[...secondOrder].map((id) => ({ domain: getDomainById(id)!, directConnection: false })),
  ];
};
