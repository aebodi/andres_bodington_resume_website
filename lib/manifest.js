/* =============================================================================
 * manifest.js — brand and content data for the Andres Bodington portfolio.
 *
 * AI use: this file was generated with Claude (Anthropic) from content written
 * and supplied by Andres Bodington. All facts, projects and milestones below
 * were provided by him; nothing here is invented.
 *
 * Exposes exactly one global: window.__BRAND__
 * ========================================================================== */

(function () {
	'use strict';

	window.__BRAND__ = {
		name: 'Andres Bodington',
		roles: ['Backend Engineer', 'AI Engineer', 'NCAA D2 Athlete'],
		tagline: 'Production AI backends, shipped.',

		contact: {
			email: 'aebodington27@gmail.com',
			github: 'https://github.com/aebodi',
			linkedin: 'https://www.linkedin.com/in/andresbodington',
			resume: 'assets/docs/andres-bodington-resume.pdf'
		},

		stats: [
			{ value: 3.97, suffix: '', label: 'GPA', note: 'Computer Science, Lewis University' },
			{ value: 2027, suffix: '', label: 'May graduation', note: 'B.S. CS · minors in Math and AI', raw: 'May 2027' },
			{ value: 2, suffix: '', label: 'Production chatbots shipped', note: 'Mandarina Tec · Tribu Deportiva' },
			{ value: 1, suffix: '', label: 'Year of NCAA eligibility left', note: 'Division II · GLVC' }
		],

		pillars: [
			{
				title: 'Backend engineering',
				body: 'REST APIs, data models, and the unglamorous parts that decide whether a product stays up.',
				tags: ['TypeScript', 'NestJS', 'Node.js', 'REST APIs', 'PostgreSQL']
			},
			{
				title: 'AI engineering',
				body: 'LLM orchestration that survives contact with real users: retrieval, prompt design, agent flows.',
				tags: ['LangChain', 'RAG', 'Prompt design', 'Agent design', 'LLM orchestration']
			},
			{
				title: 'Student-athlete',
				body: 'Distance freestyle and the 400 IM in the GLVC. A full CS course load on top of it.',
				tags: ['NCAA D2', 'GLVC', 'Distance free', '400 IM'],
				honors: ['Second Team Scholar All-America 2025', 'Scholastic All-America 2024',
					'Eight-time conference finalist', 'Dean\u2019s List every semester']
			}
		],

		timeline: [
			{
				year: 'May 2027',
				status: 'upcoming',
				title: 'B.S. Computer Science, Lewis University',
				body: 'Minors in Mathematics and Artificial Intelligence. Available for full-time work in June 2027.'
			},
			{
				year: '2026',
				status: 'done',
				title: '3.97 GPA through senior year',
				body: 'Held across the full major sequence while training and competing at NCAA Division II.'
			},
			{
				year: 'Jun\u2013Aug 2026',
				status: 'done',
				title: 'Software Engineering Intern, Andrómeda Ventures',
				body: 'Venezuela. Built real-time backend and AI services for the Mandarina Tec and Tribu Deportiva products.'
			},
			{
				year: '2025',
				status: 'done',
				title: 'Second Team Scholar All-America',
				body: 'Scholastic All-America in 2024. Merit Transfer Scholarship, 2025 to present. Dean\u2019s List every semester.'
			},
			{
				year: 'Aug 2025',
				status: 'done',
				title: 'Transfer to Lewis University',
				body: 'From Mars Hill, where he held three school records in the 500, 1000 and 1650 freestyle.'
			},
			{
				year: '2023\u20132025',
				status: 'done',
				title: 'Mars Hill University',
				body: 'Computer Science. Eight-time conference finalist and three-event school record holder.'
			}
		],

		stack: [
			'TypeScript', 'Java', 'Python', 'C++', 'SQL',
			'NestJS', 'Spring Boot', 'Node.js', 'LangChain',
			'REST APIs', 'WebSockets', 'PostgreSQL', 'Git', 'Docker'
		],

		projects: [
			{
				featured: true,
				name: 'Mandarina Tec & Tribu Deportiva',
				kind: 'Backend & AI services · Andrómeda Ventures · 2026',
				problem: 'Two live products served real traffic against a paid model API with no ceiling on per-user spend.',
				built: 'Real-time, event-driven backend services in NestJS, with a rate limiter enforcing a hard $0.10 per-user spend cap and alerts at 80% of budget.',
				role: 'Re-architected the HTTP integration onto a persistent WebSocket connection so cost tracking added zero measurable latency; refactored nested logic into the Repository Pattern with full unit-test coverage.',
				result: 'Benchmarked competing architectures and shipped the winner — incorrect outputs down over 70%, token usage per transaction reduced at constant output quality.',
				stack: ['TypeScript', 'NestJS', 'LangChain', 'WebSockets', 'Node.js'],
				links: []   /* internship work — repos are private */
			},
			{
				featured: false,
				name: 'AquaAnalytics',
				kind: 'Swim performance analytics REST API',
				problem: 'Coaching staff tracked meet results by hand; the useful signal was locked inside results PDFs.',
				built: 'A multi-tenant REST API with schema-level tenant isolation covering 50+ athletes and 200+ events, with statistical endpoints over 10,000+ race results.',
				role: 'Built end to end. Ingestion parses meet PDFs with Apache PDFBox and reconciles records with fuzzy name matching, cutting manual data entry by 90%.',
				stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Apache PDFBox'],
				links: []   /* PLACEHOLDER — add the repo URL */
			}
		]
	};
})();
