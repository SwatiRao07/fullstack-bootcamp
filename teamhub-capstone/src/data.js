const data = {
  projects: [
    { id: 'p1', name: 'Inventory Redesign', status: 'In Progress', lead: 'Alice', tech: ['React', 'Node.js'] },
    { id: 'p2', name: 'Mobile App Beta', status: 'Active', lead: 'Bob', tech: ['React Native', 'Firebase'] },
    { id: 'p3', name: 'Cloud Migration', status: 'Planned', lead: 'Charlie', tech: ['AWS', 'Terraform'] }
  ],
  articles: [
    { id: 'a1', title: 'New Office Guidelines', author: 'HR Department', date: '2026-03-01', content: 'Welcome to the new office! Here are the updated guidelines...' },
    { id: 'a2', title: 'Engineering Roadmap Q2', author: 'CTO Office', date: '2026-03-15', content: 'Our focus for Q2 will be on scaling our infrastructure...' }
  ],
  team: [
    { id: 'u1', name: 'Alice Smith', role: 'Staff Engineer', department: 'Platform', projects: ['p1'] },
    { id: 'u2', name: 'Bob Johnson', role: 'Product Designer', department: 'Design', projects: ['p2'] },
    { id: 'u3', name: 'Charlie Brown', role: 'DevOps Engineer', department: 'Cloud', projects: ['p3'] }
  ]
};

export default data;
