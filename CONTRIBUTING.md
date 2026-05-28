# Contributing to Smart Xerox Center

## Code of Conduct
- Be respectful and inclusive
- Focus on code quality
- Help others learn and grow

## Getting Started as a Developer

### 1. Clone the Repository
```bash
git clone your-repo-url
cd xerox-center-website
```

### 2. Setup Development Environment
Follow the QUICKSTART.md or SETUP.md guide

### 3. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 4. Development Workflow

#### Backend Development
```bash
cd backend
npm run dev    # Start with auto-reload
npm test       # Run tests
npm run lint   # Check code quality
```

#### Frontend Development
```bash
cd frontend
npm start      # Start dev server
npm run build  # Build for production
npm run lint   # Check code quality
```

## Coding Standards

### JavaScript/Node.js
- Use ES6+ syntax
- Use `const` and `let`, avoid `var`
- Write descriptive variable names
- Add comments for complex logic
- Follow 2-space indentation

### React Components
- Use functional components with hooks
- Keep components focused and single-responsibility
- Use meaningful prop names
- Add PropTypes or TypeScript types

### CSS/Tailwind
- Use Tailwind utility classes
- Avoid inline styles
- Use responsive breakpoints (md:, lg:, etc.)
- Maintain consistent spacing

### Database/Models
- Use proper data types
- Add validation
- Index frequently queried fields
- Document relationships

## Git Workflow

### Commits
```bash
# Good commit message
git commit -m "feat: Add user authentication system"

# Bad commit message  
git commit -m "update"
```

### Commit Types
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Pull Requests
1. Create descriptive title
2. Reference related issues
3. Describe changes made
4. Request code review

## Testing

### Backend Tests
```bash
npm test                 # Run all tests
npm test -- --watch    # Watch mode
npm test -- --coverage # Coverage report
```

### Frontend Tests
```bash
npm test               # Run tests (interactive)
npm test -- --coverage # Coverage report
```

### Manual Testing Checklist
- [ ] Feature works on desktop
- [ ] Feature works on mobile
- [ ] Feature works in dark mode
- [ ] No console errors
- [ ] API endpoints respond correctly
- [ ] Data persists in database
- [ ] Error handling works

## Documentation

Update documentation when:
- Adding new features
- Changing existing functionality  
- Adding new API endpoints
- Updating database schema

### Files to Update
- README.md
- docs/API.md
- docs/DATABASE.md
- DEVELOPMENT.md

## Security Considerations

- Never commit secrets (.env files)
- Use environment variables for sensitive data
- Validate all user inputs
- Sanitize data before database storage
- Follow OWASP guidelines
- Review security best practices

## Performance Guidelines

### Frontend
- Minimize bundle size
- Use code splitting
- Optimize images
- Implement lazy loading
- Reduce API calls

### Backend
- Use database indexes
- Implement caching
- Optimize queries
- Use pagination
- Monitor performance

## Debugging

### Backend
```bash
# Enable debug logs
DEBUG=* npm run dev

# Use Node debugger
node --inspect src/server.js
```

### Frontend
- Use React Developer Tools extension
- Use browser DevTools
- Check Network tab for API calls
- Use console.log for debugging

## Deployment Checklist

Before deploying:
- [ ] All tests pass
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Performance tested

## Issue Reporting

### When Reporting Bugs
Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/OS version
- Screenshots/logs

### Feature Requests
Provide:
- Clear description
- Use cases
- Mockups/wireframes
- Priority level

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Merge to main branch
4. Create git tag
5. Push tag to repository
6. Build and push Docker images
7. Deploy to staging
8. Deploy to production

## Communication

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Documentation**: README + docs/
- **Real-time**: Team chat (Slack/Discord)

## Resources

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Best Practices](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Tailwind CSS Docs](https://tailwindcss.com)

## Getting Help

1. Check existing documentation
2. Search issues and discussions
3. Ask in team chat
4. Create a new issue if needed
5. Reach out to team leads

---

Thank you for contributing to Smart Xerox Center! ❤️
